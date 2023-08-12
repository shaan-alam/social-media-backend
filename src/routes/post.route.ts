import express from "express";
import validateRequest from "../middlewares/validateRequest.middleware";
import { createPostSchema } from "../schema/post.schema";
import {
  createPost,
  getPosts,
  editPost,
  deletePost,
  reactPost,
} from "../controller/post.controller";
import validateToken from "../middlewares/validateToken.middleware";
import { getPost } from "../middlewares/post.middleware";

const router = express.Router();
router.post("/", validateToken, validateRequest(createPostSchema), createPost);
router.get("/", validateToken, getPosts);
router.patch("/:id", validateToken, getPost, editPost);
router.delete("/:id", validateToken, getPost, deletePost);

router.patch("/:id/reactPost", getPost, reactPost);

export default router;
