"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var PostSchema = new mongoose_1.default.Schema({
    filter: String,
    imageURL: {
        type: String,
        default: "",
    },
    thumbnailURL: {
        type: String,
        default: "",
    },
    caption: {
        type: String,
        default: "",
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
var Post = mongoose_1.default.model("Post", PostSchema);
exports.default = Post;
