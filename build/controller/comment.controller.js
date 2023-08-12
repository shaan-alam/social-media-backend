"use strict";
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
exports.likeComment = exports.editComment = exports.deleteComment = exports.retrieveComments = exports.commentOnPost = void 0;
var comment_model_1 = __importDefault(require("../models/comment.model"));
var commentLikes_model_1 = __importDefault(require("../models/commentLikes.model"));
var logger_1 = __importDefault(require("../logger"));
var controller_util_1 = require("../utils/controller.util");
var lodash_1 = require("lodash");
/**
 * For Commenting on a post.
 * @param req Express Request Object
 * @param res Express Response Object
 */
var commentOnPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, comment, newComment, newCommentLikesDocument, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                comment = req.body.comment;
                console.log(id, comment);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, new comment_model_1.default({
                        message: comment.message,
                        postId: id,
                        author: comment.author,
                    })];
            case 2:
                newComment = _a.sent();
                return [4 /*yield*/, newComment.save()];
            case 3:
                _a.sent();
                return [4 /*yield*/, new commentLikes_model_1.default({
                        commentId: newComment._id,
                        likes: [],
                    })];
            case 4:
                newCommentLikesDocument = _a.sent();
                return [4 /*yield*/, newCommentLikesDocument.save()];
            case 5:
                _a.sent();
                return [4 /*yield*/, comment_model_1.default.populate(newComment, {
                        path: "author",
                        select: "_id fullName avatar",
                        model: "User",
                    })];
            case 6:
                _a.sent();
                res.json({ comment: lodash_1.omit(newComment.toJSON(), "__v") });
                return [3 /*break*/, 8];
            case 7:
                err_1 = _a.sent();
                logger_1.default.error(err_1);
                res.status(500).json({ message: err_1 });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.commentOnPost = commentOnPost;
/**
 * For retrieving comments of a post by offset
 * @param req Express Request Object
 * @param res Express Response Object
 */
var retrieveComments = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, offset, comments, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                offset = req.query.offset;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, controller_util_1.fetchComments(id, offset)];
            case 2:
                comments = _a.sent();
                res.json(comments);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                logger_1.default.error(err_2);
                res.status(500).json({ err: err_2 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.retrieveComments = retrieveComments;
/**
 * @function deleteComment
 * @description To delete a comment for a post
 * @param req Express Request Object
 * @param res Express Response Object
 */
var deleteComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, comment_model_1.default.findByIdAndRemove(id)];
            case 2:
                _a.sent();
                res.status(204).json({ message: "Comment Deleted!!" });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.status(500).json(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteComment = deleteComment;
var editComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, message, updatedComment, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                message = req.body.message;
                console.log(id, message);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, comment_model_1.default.findByIdAndUpdate(id, { message: message }, {
                        new: true,
                    })];
            case 2:
                updatedComment = _a.sent();
                res.json({ comment: updatedComment });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                logger_1.default.error(err_4);
                res.status(500).json({ message: err_4 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.editComment = editComment;
var likeComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, commentId, likedBy, commentLikeDocument, updatedCommentLike, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, commentId = _a.commentId, likedBy = _a.likedBy;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, commentLikes_model_1.default.findOne({ commentId: commentId })];
            case 2:
                commentLikeDocument = _b.sent();
                console.log(commentLikeDocument);
                updatedCommentLike = void 0;
                if (!(commentLikeDocument === null || commentLikeDocument === void 0 ? void 0 : commentLikeDocument.likes.find(function (like) { return like.by == likedBy; }))) return [3 /*break*/, 4];
                console.log("filtering !!");
                return [4 /*yield*/, commentLikes_model_1.default.findOneAndUpdate({ commentId: commentId }, {
                        $pull: { likes: { by: likedBy } },
                    }, { new: true })];
            case 3:
                updatedCommentLike = _b.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, commentLikes_model_1.default.findOneAndUpdate({ commentId: commentId }, { $push: { likes: { by: likedBy } } }, { new: true })];
            case 5:
                updatedCommentLike = _b.sent();
                _b.label = 6;
            case 6:
                res.json({ updatedCommentLike: updatedCommentLike });
                return [3 /*break*/, 8];
            case 7:
                err_5 = _b.sent();
                logger_1.default.error(err_5);
                res.status(500).json({ message: err_5 });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.likeComment = likeComment;
