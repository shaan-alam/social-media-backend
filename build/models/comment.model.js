"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var CommentSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    message: String,
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "post",
    },
});
var Comment = mongoose_1.default.model("Comment", CommentSchema);
exports.default = Comment;
