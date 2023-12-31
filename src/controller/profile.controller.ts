import { Request, Response } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";
import Followers from "../models/followers.model";
import Following from "../models/following.model";
import logger from "../logger";
import Post from "../models/post.model";
import { fetchPosts } from "../utils/controller.util";
import cloudinary, { formatCloudinaryUrl } from "../utils/cloudinary.util";

/**
 * @description To get the User's profile
 * @param req Express Request Object
 * @param res Express Response Object
 */
export const getProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      // Join the user's followers from the followers collection
      {
        $lookup: {
          from: "followers",
          as: "followers",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "followers.user",
                foreignField: "_id",
                as: "followers",
              },
            },
          ],
        },
      },
      // Join the user's followings from the followings collection
      {
        $lookup: {
          from: "followings",
          as: "following",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "following.user",
                foreignField: "_id",
                as: "following",
              },
            },
          ],
        },
      },
      {
        $addFields: {
          followers: "$followers.followers",
          following: "$following.following",
        },
      },
      { $unwind: "$followers" },
      { $unwind: "$following" },
      {
        $project: {
          _id: 1,
          details: 1,
          avatar: 1,
          cover_picture: 1,
          fullName: 1,
          email: 1,
          createdAt: 1,
          "followers._id": 1,
          "followers.fullName": 1,
          "followers.avatar": 1,
          "following._id": 1,
          "following.fullName": 1,
          "following.avatar": 1,
        },
      },
    ]);

    res.json(user[0]);
  } catch (err) {
    logger.error("Something went wrong!");
    res.status(404).json({ message: err });
  }
};

/**
 * @description To get a specific user's post
 * @param req Express Request Object
 * @param res Express Response Object
 */
export const getUserPosts = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const posts = await fetchPosts(id);

    await Post.populate(posts, {
      path: "reactions.reactions.by",
      select: "_id fullName avatar",
      model: "User",
    });

    res.json(posts);
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @description To follow a user
 * @param req Express Request Object
 * @param res Express Response Object
 */
export const followProfile = async (req: Request, res: Response) => {
  const { id } = req.params; // Id of the user to be followed
  const currentUser = res.locals.userId;

  const currentUserFollowings = await Following.findOne({
    userId: currentUser._id,
  });

  try {
    if (
      currentUserFollowings?.following.find(
        (following) => following.user.toString() === id
      )
    ) {
      throw new Error("Already following this user!");
    }

    if (currentUser._id === id) {
      throw new Error("A user cannot follow himself!");
    }

    // Retrieve current user's followings
    await Following.findOneAndUpdate(
      { userId: currentUser._id },
      {
        $push: {
          following: { user: id },
        },
      },
      { new: true }
    );

    // Retrieve the followers list of the user who is being followed here
    await Followers.findOneAndUpdate(
      {
        userId: id as any,
      },
      {
        $push: {
          followers: { user: currentUser._id },
        },
      },
      { new: true }
    );

    res.json({ message: "Followed!" });
  } catch (err: any) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * @description To unfollow a user
 * @param req Express Request Object
 * @param res Express Response Object
 */
export const unfollowProfile = async (req: Request, res: Response) => {
  const { id } = req.params; // Id of the user to be followed
  const currentUser = res.locals.userId;

  const currentUserFollowings = await Following.findOne({
    userId: currentUser._id,
  });

  try {
    if (
      !currentUserFollowings?.following.find(
        (following) => following.user.toString() === id
      )
    ) {
      throw new Error("Cannot unfollow the user as it is already unfollowed!");
    }

    if (currentUserFollowings._id === id) {
      throw new Error("A user cannot unfollow himself!");
    }

    await Following.findOneAndUpdate(
      { userId: mongoose.Types.ObjectId(currentUser._id) },
      {
        following: currentUserFollowings?.following?.filter(
          (following) => following.user.toString() !== id
        ),
      },
      { new: true }
    );

    const userFollowers = await Followers.findOne({
      userId: mongoose.Types.ObjectId(id),
    });

    await Followers.findOneAndUpdate(
      {
        userId: mongoose.Types.ObjectId(id),
      },
      {
        followers: userFollowers?.followers?.filter(
          (follower) =>
            follower?.user.toString() !== (currentUser._id as string)
        ),
      },
      { new: true }
    );

    res.json({ message: "Unfollowed!" });
  } catch (err: any) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

export const updateProfileDetails = async (req: Request, res: Response) => {
  const { details } = req.body;

  try {
    const newDetails = await User.findOneAndUpdate(
      { _id: res.locals.userId._id },
      { details: { ...details } },
      { new: true }
    );

    res.json(newDetails);
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  const { image } = req.body;

  try {
    const uploadedImage = await cloudinary.v2.uploader.upload(image, {
      width: 200,
      height: 200,
      folder: `${process.env.CLOUDINARY_AVATAR_UPLOAD_FOLDER}`,
    });

    const updatedUser = await User.findOneAndUpdate(
      { _id: res.locals.userId._id },
      {
        avatar: uploadedImage?.secure_url,
      },
      { new: true }
    );

    res.json({ updatedUser });
  } catch (err: any) {
    logger.error(err.message);
    res.json({ message: err.message });
  }
};

export const updateCoverPicture = async (req: Request, res: Response) => {
  const { image } = req.body;

  try {
    const uploadedImage = await cloudinary.v2.uploader.upload(image, {
      width: 851,
      height: 315,
      folder: `${process.env.CLOUDINARY_COVER_UPLOAD_FOLDER}`,
    });

    const updatedUser = await User.findOneAndUpdate(
      { _id: res.locals.userId._id },
      {
        cover_picture: uploadedImage?.secure_url,
      },
      { new: true }
    );

    res.json({ updatedUser });
  } catch (err: any) {
    logger.error(err.message);
    res.json({ message: err.message });
  }
};
