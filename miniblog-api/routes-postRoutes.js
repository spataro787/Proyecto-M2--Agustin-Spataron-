import express from "express";
import {
  getPosts,
  getPost,
  createNewPost,
  updateExistingPost,
  deleteExistingPost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", createNewPost);
router.put("/:id", updateExistingPost);
router.delete("/:id", deleteExistingPost);

export default router;
