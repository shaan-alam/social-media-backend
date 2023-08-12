"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_route_1 = __importDefault(require("./auth.route"));
var post_route_1 = __importDefault(require("./post.route"));
var comment_route_1 = __importDefault(require("./comment.route"));
var commentReply_route_1 = __importDefault(require("./commentReply.route"));
var profile_route_1 = __importDefault(require("./profile.route"));
var followers_route_1 = __importDefault(require("./followers.route"));
var following_route_1 = __importDefault(require("./following.route"));
var routes = function (app) {
    app.use("/auth/", auth_route_1.default);
    app.use("/posts/", post_route_1.default);
    app.use("/post/comment", comment_route_1.default);
    app.use("/post/comment-reply", commentReply_route_1.default);
    app.use("/profile", profile_route_1.default);
    app.use("/followers", followers_route_1.default);
    app.use("/following", following_route_1.default);
};
exports.default = routes;
