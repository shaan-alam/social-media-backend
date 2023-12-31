import { Request, Response } from "express";
import Comment from "../models/comment.model";
import CommentLikes from "../models/commentLikes.model";
import logger from "../logger";
import { fetchComments } from "../utils/controller.util";
import { omit } from "lodash";

/**
 * For Commenting on a post.
 * @param req Express Request Object
 * @param res Express Response Object
 */
export const commentOnPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body;

  console.log(id, comment);

  try {
    const newComment = await new Comment({
      message: comment.message,
      postId: id,
      author: comment.author,
    });
    await newComment.save();

    const newCommentLikesDocument = await new CommentLikes({
      commentId: newComment._id,
      likes: [],
    });
    await newCommentLikesDocument.save();

    await Comment.populate(newComment, {
      path: "author",
      select: "_id fullName avatar",
      model: "User",
    });

    res.json({ comment: omit(newComment.toJSON(), "__v") });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ message: err });
  }
};

/**
 * For retrieving comments of a post by offset
 * @param req Express Request Object
 * @param res Express Response Object
 */
export const retrieveComments = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { offset } = req.query;

  try {
    const comments = await fetchComments(id, offset as string);

    res.json(comments);
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ err });
  }
};

/**
 * @function deleteComment
 * @description To delete a comment for a post
 * @param req Express Request Object
 * @param res Express Response Object
 */
export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Comment.findByIdAndRemove(id);

    res.status(204).json({ message: "Comment Deleted!!" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message } = req.body;

  console.log(id, message);

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { message },
      {
        new: true,
      }
    );

    res.json({ comment: updatedComment });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ message: err });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  const { commentId, likedBy } = req.body;

  try {
    const commentLikeDocument = await CommentLikes.findOne({ commentId });
    console.log(commentLikeDocument);

    let updatedCommentLike;

    if (commentLikeDocument?.likes.find((like) => like.by == likedBy)) {
      console.log("filtering !!");
      updatedCommentLike = await CommentLikes.findOneAndUpdate(
        { commentId },
        {
          $pull: { likes: { by: likedBy } },
        },
        { new: true }
      );
    } else {
      updatedCommentLike = await CommentLikes.findOneAndUpdate(
        { commentId },
        { $push: { likes: { by: likedBy } } },
        { new: true }
      );
    }

    res.json({ updatedCommentLike });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ message: err });
  }
};
