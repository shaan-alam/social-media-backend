"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var commentReplySchema = new mongoose_1.default.Schema({
    message: {
        type: String,
        required: true,
    },
    commentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("CommentReply", commentReplySchema);
