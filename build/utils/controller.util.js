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
exports.fetchCommentReplies = exports.fetchComments = exports.fetchPosts = void 0;
var comment_model_1 = __importDefault(require("../models/comment.model"));
var commentReply_model_1 = __importDefault(require("../models/commentReply.model"));
var post_model_1 = __importDefault(require("../models/post.model"));
var mongoose_1 = __importDefault(require("mongoose"));
/**
 * @description A function which will return all the posts of the user's id, else all
 * the posts if no user id is given..
 * @param userId The Id of the user for which post is to be fetched
 * @returns An array of posts
 */
var fetchPosts = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var aggregation, posts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                aggregation = [
                    // Sort posts in descending order of their creation time.
                    { $sort: { createdAt: -1 } },
                    // Join user (*author of the post) from the users collection
                    {
                        $lookup: {
                            from: "users",
                            localField: "author",
                            foreignField: "_id",
                            as: "author",
                        },
                    },
                    { $unwind: "$author" },
                    // Join the reactions of the post from the reactions collection
                    {
                        $lookup: {
                            from: "reactions",
                            as: "reactions",
                            let: { postId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$postId", "$$postId"],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    { $unwind: "$reactions" },
                    // Join the latest comment for this post from the comments collection
                    // This is just to show a comment in the UI
                    // Later we will fetch the comments (10 each time) in the comment.controller.ts
                    {
                        $lookup: {
                            from: "comments",
                            as: "comments",
                            let: { post_id: "$_id" },
                            pipeline: [
                                // Get the latest comment
                                { $sort: { date: -1 } },
                                {
                                    $match: {
                                        $expr: { $eq: ["$postId", "$$post_id"] },
                                    },
                                },
                                {
                                    $limit: 3,
                                },
                                // Join the author of the comment from the users model
                                {
                                    $lookup: {
                                        from: "users",
                                        localField: "author",
                                        foreignField: "_id",
                                        as: "author",
                                    },
                                },
                                {
                                    $unwind: "$author",
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        message: 1,
                                        date: 1,
                                        "author.avatar": 1,
                                        "author.fullName": 1,
                                        "author._id": 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $lookup: {
                            from: "comments",
                            let: { post_id: "$_id" },
                            as: "commentCount",
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$postId", "$$post_id"] },
                                    },
                                },
                                {
                                    $sort: { date: -1 },
                                },
                                {
                                    $group: { _id: null, count: { $sum: 1 } },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: {
                            path: "$commentCount",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $addFields: {
                            commentCount: "$commentCount.count",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            imageURL: 1,
                            thumbnailURL: 1,
                            caption: 1,
                            createdAt: 1,
                            comments: 1,
                            filter: 1,
                            "author._id": 1,
                            "author.fullName": 1,
                            "author.avatar": 1,
                            "reactions.reactions": 1,
                            commentCount: 1,
                        },
                    },
                ];
                if (userId !== undefined) {
                    aggregation.unshift({
                        $match: {
                            author: mongoose_1.default.Types.ObjectId(userId),
                        },
                    });
                }
                return [4 /*yield*/, post_model_1.default.aggregate(aggregation)];
            case 1:
                posts = _a.sent();
                return [2 /*return*/, posts];
        }
    });
}); };
exports.fetchPosts = fetchPosts;
/**
 * @description To return comments for a post. It will return [offset] number of comments each time
 * @param postId Post ID for which comments are to be fetched
 * @param offset A limited number of comments to be returned
 * @returns Array of Comments of a post
 */
var fetchComments = function (postId, offset) { return __awaiter(void 0, void 0, void 0, function () {
    var comments, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, comment_model_1.default.aggregate([
                        { $match: { postId: mongoose_1.default.Types.ObjectId(postId) } },
                        { $sort: { date: -1 } },
                        { $limit: +offset },
                        {
                            $lookup: {
                                from: "users",
                                localField: "author",
                                foreignField: "_id",
                                as: "author",
                            },
                        },
                        { $unwind: "$author" },
                        {
                            $lookup: {
                                from: "commentreplies",
                                let: { commentId: "$_id" },
                                as: "commentRepliesCount",
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$commentId", "$$commentId"],
                                            },
                                        },
                                    },
                                    {
                                        $group: { _id: null, count: { $sum: 1 } },
                                    },
                                ],
                            },
                        },
                        {
                            $unwind: {
                                path: "$commentRepliesCount",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $addFields: {
                                commentRepliesCount: "$commentRepliesCount.count",
                            },
                        },
                        {
                            $lookup: {
                                from: "commentlikes",
                                localField: "_id",
                                foreignField: "commentId",
                                as: "commentLikes",
                            },
                        },
                        {
                            $addFields: {
                                commentLikes: "$commentLikes.likes",
                            },
                        },
                        {
                            $unwind: "$commentLikes"
                        },
                        {
                            $project: {
                                _id: 1,
                                message: 1,
                                "author._id": 1,
                                "author.avatar": 1,
                                "author.fullName": 1,
                                date: 1,
                                commentRepliesCount: 1,
                                commentLikes: 1,
                                postId: 1
                            },
                        },
                    ])];
            case 1:
                comments = _a.sent();
                return [2 /*return*/, comments];
            case 2:
                err_1 = _a.sent();
                throw new Error(err_1);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.fetchComments = fetchComments;
/**
 * @description To return comment replies for a comment.
    It will return [offset] number of comment replies each time
 * @param commentId Comment ID for which replies are to be fetched
 * @param offset A limited number of replies to be returned
 * @returns Array of Comment replies of a comment
 */
var fetchCommentReplies = function (commentId, offset) { return __awaiter(void 0, void 0, void 0, function () {
    var commentReplies, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, commentReply_model_1.default.aggregate([
                        { $match: { commentId: mongoose_1.default.Types.ObjectId(commentId) } },
                        { $sort: { date: 1 } },
                        { $limit: +offset },
                        {
                            $lookup: {
                                from: "users",
                                localField: "author",
                                foreignField: "_id",
                                as: "author",
                            },
                        },
                        { $unwind: "$author" },
                        {
                            $project: {
                                _id: 1,
                                message: 1,
                                "author._id": 1,
                                "author.avatar": 1,
                                "author.fullName": 1,
                                date: 1,
                            },
                        },
                    ])];
            case 1:
                commentReplies = _a.sent();
                return [2 /*return*/, commentReplies];
            case 2:
                err_2 = _a.sent();
                throw new Error(err_2);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.fetchCommentReplies = fetchCommentReplies;
