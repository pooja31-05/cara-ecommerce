import express from "express";
import {
  messageController,
  newsLetterController,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/message", messageController);

router.post("/newsLetter", newsLetterController);

export default router;
