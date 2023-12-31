import { Request, Response, NextFunction } from "express";
import logger from "../logger";
import User, { UserDocument } from "../models/user.model";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    res.locals.user = user as UserDocument;
    return next();
  } catch (err: any) {
    logger.error("No user with that email");
    return res.status(404).json({ message: "No user with that email!" });
  }
};
