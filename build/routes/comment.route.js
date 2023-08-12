"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var comment_controller_1 = require("../controller/comment.controller");
var router = express_1.default.Router();
router.post("/:id", comment_controller_1.commentOnPost);
router.get("/:id", comment_controller_1.retrieveComments);
router.delete("/:id", comment_controller_1.deleteComment);
router.patch("/:id", comment_controller_1.editComment);
router.patch("/:id/like", comment_controller_1.likeComment);
exports.default = router;
