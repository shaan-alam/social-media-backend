"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactPost = exports.deletePost = exports.editPost = exports.getPosts = exports.createPost = void 0;
var logger_1 = __importDefault(require("../logger"));
var post_model_1 = __importDefault(require("../models/post.model"));
var reactions_model_1 = __importDefault(require("../models/reactions.model"));
var cloudinary_util_1 = __importStar(require("../utils/cloudinary.util"));
var controller_util_1 = require("../utils/controller.util");
var ObjectId = require("mongoose").Types.ObjectId;
/**
 * @description Creates a new Post
 * @param req Express Request Object
 * @param res Express Response Object
 */
var createPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, filter, image, caption, uploadedImage, thumbnail_url, newPost, newPostLikes, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, filter = _a.filter, image = _a.image, caption = _a.caption;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                if (!image) return [3 /*break*/, 3];
                return [4 /*yield*/, cloudinary_util_1.default.v2.uploader.upload(image, {
                        folder: "" + process.env.CLOUDINARY_POST_UPLOAD_FOLDER,
                    })];
            case 2:
                uploadedImage = _b.sent();
                _b.label = 3;
            case 3: return [4 /*yield*/, cloudinary_util_1.formatCloudinaryUrl(uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url, { width: 400, height: 400 }, true)];
            case 4:
                thumbnail_url = _b.sent();
                return [4 /*yield*/, new post_model_1.default({
                        filter: filter,
                        imageURL: (uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url) ? uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url : "",
                        caption: caption,
                        author: res.locals.userId,
                        thumbnailURL: thumbnail_url,
                    })];
            case 5:
                newPost = _b.sent();
                return [4 /*yield*/, newPost.save()];
            case 6:
                _b.sent();
                return [4 /*yield*/, new reactions_model_1.default({
                        postId: newPost._id,
                        reactions: [],
                    })];
            case 7:
                newPostLikes = _b.sent();
                return [4 /*yield*/, newPostLikes.save()];
            case 8:
                _b.sent();
                res.json({ post: newPost, newPostLikes: newPostLikes });
                return [3 /*break*/, 10];
            case 9:
                err_1 = _b.sent();
                logger_1.default.error(err_1);
                res.status(400).json({ message: err_1.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.createPost = createPost;
/**
 * @description Get all the posts
 * @param req Express Request Object
 * @param res Express Response Object
 */
var getPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, controller_util_1.fetchPosts()];
            case 1:
                posts = _a.sent();
                return [4 /*yield*/, post_model_1.default.populate(posts, {
                        path: "reactions.reactions.by",
                        select: "_id fullName avatar",
                        model: "User",
                    })];
            case 2:
                _a.sent();
                res.json(posts);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                logger_1.default.error(err_2);
                res.status(404).json({ message: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getPosts = getPosts;
/**
 * @description Edits a Post
 * @param req Express Request Object
 * @param res Express Response Object
 */
var editPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, caption, updatedPost, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = res.locals.post._id;
                caption = req.body.caption;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // If the post has empty image URL, that means it is of status type
                // Do not update a existing status's caption into an empty caption
                if (res.locals.post.imageURL === "" && (caption === "" || !caption)) {
                    throw new Error("Cannot update to empty status!");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, post_model_1.default.findByIdAndUpdate(_id, { _id: _id, caption: caption }, {
                        new: true,
                    })];
            case 2:
                updatedPost = _a.sent();
                res.json({ post: updatedPost });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                logger_1.default.error(err_3.message);
                res.status(400).json({ message: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.editPost = editPost;
/**
 * @description Deletes a Post
 * @param req Express Request Object
 * @param res Express Response Object
 */
var deletePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = res.locals.post._id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, post_model_1.default.findByIdAndRemove(_id)];
            case 2:
                _a.sent();
                res.json({ message: "Post deleted successfully!!" });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                logger_1.default.error(err_4.message);
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deletePost = deletePost;
/**
 * @description Likes a post
 * @param req Express Request Object
 * @param res Express Response Object
 */
var reactPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userReaction, postId, updatedReactions, reactions, existingReactions_1, err_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userReaction = req.body.reaction;
                console.log(userReaction);
                postId = res.locals.post._id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 10, , 11]);
                updatedReactions = {};
                return [4 /*yield*/, reactions_model_1.default.findOne({ postId: postId })];
            case 2:
                reactions = _b.sent();
                existingReactions_1 = (_a = reactions === null || reactions === void 0 ? void 0 : reactions.reactions) === null || _a === void 0 ? void 0 : _a.filter(function (result) { return result.by == userReaction.by; })[0];
                if (!existingReactions_1) return [3 /*break*/, 7];
                if (!(existingReactions_1.emoji === userReaction.emoji)) return [3 /*break*/, 4];
                return [4 /*yield*/, reactions_model_1.default.findOneAndUpdate({ postId: postId }, { $pull: { reactions: { _id: existingReactions_1 === null || existingReactions_1 === void 0 ? void 0 : existingReactions_1._id } } }, { new: true })];
            case 3:
                // If the previous reaction emoji is same as new one,
                // then remove the reaction
                updatedReactions = _b.sent();
                return [3 /*break*/, 6];
            case 4:
                // If the previous reaction emoji and new reaction emoji are different
                // then update the reaction emoji to the new one
                existingReactions_1.emoji = userReaction.emoji;
                return [4 /*yield*/, reactions_model_1.default.findOneAndUpdate({ postId: postId }, {
                        reactions: (reactions === null || reactions === void 0 ? void 0 : reactions.reactions).map(function (reaction) {
                            return reaction._id === existingReactions_1._id
                                ? existingReactions_1
                                : reaction;
                        }),
                    }, { new: true })];
            case 5:
                updatedReactions = _b.sent();
                _b.label = 6;
            case 6: return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, reactions_model_1.default.findOneAndUpdate({ postId: postId }, { $push: { reactions: userReaction } }, { new: true })];
            case 8:
                // If there are no reaction for the user, then push one to the reactions array
                updatedReactions = _b.sent();
                _b.label = 9;
            case 9: return [2 /*return*/, res.json(updatedReactions)];
            case 10:
                err_5 = _b.sent();
                logger_1.default.error(err_5);
                res.status(400).json({ message: err_5.message });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.reactPost = reactPost;
