"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.updateCoverPicture = exports.updateProfilePicture = exports.updateProfileDetails = exports.unfollowProfile = exports.followProfile = exports.getUserPosts = exports.getProfile = void 0;
var user_model_1 = __importDefault(require("../models/user.model"));
var mongoose_1 = __importDefault(require("mongoose"));
var followers_model_1 = __importDefault(require("../models/followers.model"));
var following_model_1 = __importDefault(require("../models/following.model"));
var logger_1 = __importDefault(require("../logger"));
var post_model_1 = __importDefault(require("../models/post.model"));
var controller_util_1 = require("../utils/controller.util");
var cloudinary_util_1 = __importDefault(require("../utils/cloudinary.util"));
/**
 * @description To get the User's profile
 * @param req Express Request Object
 * @param res Express Response Object
 */
var getProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_model_1.default.aggregate([
                        { $match: { _id: mongoose_1.default.Types.ObjectId(id) } },
                        // Join the user's followers from the followers collection
                        {
                            $lookup: {
                                from: "followers",
                                as: "followers",
                                let: { userId: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$userId", "$$userId"],
                                            },
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "followers.user",
                                            foreignField: "_id",
                                            as: "followers",
                                        },
                                    },
                                ],
                            },
                        },
                        // Join the user's followings from the followings collection
                        {
                            $lookup: {
                                from: "followings",
                                as: "following",
                                let: { userId: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$userId", "$$userId"],
                                            },
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "following.user",
                                            foreignField: "_id",
                                            as: "following",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $addFields: {
                                followers: "$followers.followers",
                                following: "$following.following",
                            },
                        },
                        { $unwind: "$followers" },
                        { $unwind: "$following" },
                        {
                            $project: {
                                _id: 1,
                                details: 1,
                                avatar: 1,
                                cover_picture: 1,
                                fullName: 1,
                                email: 1,
                                createdAt: 1,
                                "followers._id": 1,
                                "followers.fullName": 1,
                                "followers.avatar": 1,
                                "following._id": 1,
                                "following.fullName": 1,
                                "following.avatar": 1,
                            },
                        },
                    ])];
            case 2:
                user = _a.sent();
                res.json(user[0]);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                logger_1.default.error("Something went wrong!");
                res.status(404).json({ message: err_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getProfile = getProfile;
/**
 * @description To get a specific user's post
 * @param req Express Request Object
 * @param res Express Response Object
 */
var getUserPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, posts, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, controller_util_1.fetchPosts(id)];
            case 2:
                posts = _a.sent();
                return [4 /*yield*/, post_model_1.default.populate(posts, {
                        path: "reactions.reactions.by",
                        select: "_id fullName avatar",
                        model: "User",
                    })];
            case 3:
                _a.sent();
                res.json(posts);
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                logger_1.default.error(err_2.message);
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getUserPosts = getUserPosts;
/**
 * @description To follow a user
 * @param req Express Request Object
 * @param res Express Response Object
 */
var followProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, currentUser, currentUserFollowings, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                currentUser = res.locals.userId;
                return [4 /*yield*/, following_model_1.default.findOne({
                        userId: currentUser._id,
                    })];
            case 1:
                currentUserFollowings = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                if (currentUserFollowings === null || currentUserFollowings === void 0 ? void 0 : currentUserFollowings.following.find(function (following) { return following.user.toString() === id; })) {
                    throw new Error("Already following this user!");
                }
                if (currentUser._id === id) {
                    throw new Error("A user cannot follow himself!");
                }
                // Retrieve current user's followings
                return [4 /*yield*/, following_model_1.default.findOneAndUpdate({ userId: currentUser._id }, {
                        $push: {
                            following: { user: id },
                        },
                    }, { new: true })];
            case 3:
                // Retrieve current user's followings
                _a.sent();
                // Retrieve the followers list of the user who is being followed here
                return [4 /*yield*/, followers_model_1.default.findOneAndUpdate({
                        userId: id,
                    }, {
                        $push: {
                            followers: { user: currentUser._id },
                        },
                    }, { new: true })];
            case 4:
                // Retrieve the followers list of the user who is being followed here
                _a.sent();
                res.json({ message: "Followed!" });
                return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                logger_1.default.error(err_3.message);
                res.status(400).json({ message: err_3.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.followProfile = followProfile;
/**
 * @description To unfollow a user
 * @param req Express Request Object
 * @param res Express Response Object
 */
var unfollowProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, currentUser, currentUserFollowings, userFollowers, err_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                currentUser = res.locals.userId;
                return [4 /*yield*/, following_model_1.default.findOne({
                        userId: currentUser._id,
                    })];
            case 1:
                currentUserFollowings = _c.sent();
                _c.label = 2;
            case 2:
                _c.trys.push([2, 6, , 7]);
                if (!(currentUserFollowings === null || currentUserFollowings === void 0 ? void 0 : currentUserFollowings.following.find(function (following) { return following.user.toString() === id; }))) {
                    throw new Error("Cannot unfollow the user as it is already unfollowed!");
                }
                if (currentUserFollowings._id === id) {
                    throw new Error("A user cannot unfollow himself!");
                }
                return [4 /*yield*/, following_model_1.default.findOneAndUpdate({ userId: mongoose_1.default.Types.ObjectId(currentUser._id) }, {
                        following: (_a = currentUserFollowings === null || currentUserFollowings === void 0 ? void 0 : currentUserFollowings.following) === null || _a === void 0 ? void 0 : _a.filter(function (following) { return following.user.toString() !== id; }),
                    }, { new: true })];
            case 3:
                _c.sent();
                return [4 /*yield*/, followers_model_1.default.findOne({
                        userId: mongoose_1.default.Types.ObjectId(id),
                    })];
            case 4:
                userFollowers = _c.sent();
                return [4 /*yield*/, followers_model_1.default.findOneAndUpdate({
                        userId: mongoose_1.default.Types.ObjectId(id),
                    }, {
                        followers: (_b = userFollowers === null || userFollowers === void 0 ? void 0 : userFollowers.followers) === null || _b === void 0 ? void 0 : _b.filter(function (follower) {
                            return (follower === null || follower === void 0 ? void 0 : follower.user.toString()) !== currentUser._id;
                        }),
                    }, { new: true })];
            case 5:
                _c.sent();
                res.json({ message: "Unfollowed!" });
                return [3 /*break*/, 7];
            case 6:
                err_4 = _c.sent();
                logger_1.default.error(err_4.message);
                res.status(400).json({ message: err_4.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.unfollowProfile = unfollowProfile;
var updateProfileDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var details, newDetails, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                details = req.body.details;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: res.locals.userId._id }, { details: __assign({}, details) }, { new: true })];
            case 2:
                newDetails = _a.sent();
                res.json(newDetails);
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                logger_1.default.error(err_5.message);
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateProfileDetails = updateProfileDetails;
var updateProfilePicture = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var image, uploadedImage, updatedUser, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                image = req.body.image;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, cloudinary_util_1.default.v2.uploader.upload(image, {
                        width: 200,
                        height: 200,
                        folder: "" + process.env.CLOUDINARY_AVATAR_UPLOAD_FOLDER,
                    })];
            case 2:
                uploadedImage = _a.sent();
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: res.locals.userId._id }, {
                        avatar: uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url,
                    }, { new: true })];
            case 3:
                updatedUser = _a.sent();
                res.json({ updatedUser: updatedUser });
                return [3 /*break*/, 5];
            case 4:
                err_6 = _a.sent();
                logger_1.default.error(err_6.message);
                res.json({ message: err_6.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateProfilePicture = updateProfilePicture;
var updateCoverPicture = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var image, uploadedImage, updatedUser, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                image = req.body.image;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, cloudinary_util_1.default.v2.uploader.upload(image, {
                        width: 851,
                        height: 315,
                        folder: "" + process.env.CLOUDINARY_COVER_UPLOAD_FOLDER,
                    })];
            case 2:
                uploadedImage = _a.sent();
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: res.locals.userId._id }, {
                        cover_picture: uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url,
                    }, { new: true })];
            case 3:
                updatedUser = _a.sent();
                res.json({ updatedUser: updatedUser });
                return [3 /*break*/, 5];
            case 4:
                err_7 = _a.sent();
                logger_1.default.error(err_7.message);
                res.json({ message: err_7.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateCoverPicture = updateCoverPicture;
