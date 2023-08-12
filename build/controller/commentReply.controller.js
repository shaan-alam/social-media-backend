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
exports.deleteCommentReply = exports.editCommentReply = exports.retrieveCommentReplies = exports.createCommentReply = void 0;
var commentReply_model_1 = __importDefault(require("../models/commentReply.model"));
var logger_1 = __importDefault(require("../logger"));
var comment_model_1 = __importDefault(require("../models/comment.model"));
var controller_util_1 = require("../utils/controller.util");
/**
 * @function createCommentReply
 * @description Used for creating comment replies
 * @param req Express Request object
 * @param res Express Response object
 */
var createCommentReply = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, message, commentId, author, newCommentReply, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body.commentReply, message = _a.message, commentId = _a.commentId, author = _a.author;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, new commentReply_model_1.default({
                        message: message,
                        commentId: commentId,
                        author: author,
                    })];
            case 2:
                newCommentReply = _b.sent();
                return [4 /*yield*/, newCommentReply.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, commentReply_model_1.default.populate(newCommentReply, {
                        path: 'author',
                        model: 'User',
                        select: '_id fullName avatar'
                    })];
            case 4:
                _b.sent();
                res.json({ reply: newCommentReply });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                logger_1.default.error(err_1);
                res.status(500).json({ message: "Something went wrong on our side!" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createCommentReply = createCommentReply;
/**
 * @function retrieveCommentReplies
 * @description Used for retrieving comment replies
 * @param req Express Request Object
 * @param res Express Response Object
 */
var retrieveCommentReplies = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, offset, comment, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentId = req.params.commentId;
                offset = req.query.offset;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, comment_model_1.default.findOne({ _id: commentId })];
            case 2:
                comment = _a.sent();
                if (!comment) {
                    return [2 /*return*/, res.status(404).json({ message: "No comment found with that ID" })];
                }
                return [4 /*yield*/, controller_util_1.fetchCommentReplies(commentId, offset)];
            case 3:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                logger_1.default.error(err_2);
                res.status(500).json({ message: err_2 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.retrieveCommentReplies = retrieveCommentReplies;
/**
 * @function editCommentReply
 * @param req Express Request Object
 * @param res Express Response Object
 */
var editCommentReply = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentReplyId, message, updatedCommentReply, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentReplyId = req.params.commentReplyId;
                message = req.body.message;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, commentReply_model_1.default.findByIdAndUpdate(commentReplyId, { message: message }, {
                        new: true,
                    })];
            case 2:
                updatedCommentReply = _a.sent();
                res.json(updatedCommentReply);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                logger_1.default.error(err_3);
                res.status(500).json({ message: err_3 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.editCommentReply = editCommentReply;
/**
 * @function deleteCommentReply
 * @param req Express Request Object
 * @param res Express Response Object
 */
var deleteCommentReply = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentReplyId, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentReplyId = req.params.commentReplyId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, commentReply_model_1.default.findByIdAndRemove(commentReplyId)];
            case 2:
                _a.sent();
                res.status(204).json({ message: "Comment Reply Deleted!!" });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                res.status(500).json(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteCommentReply = deleteCommentReply;
