"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validateRequest_middleware_1 = __importDefault(require("../middlewares/validateRequest.middleware"));
var post_schema_1 = require("../schema/post.schema");
var post_controller_1 = require("../controller/post.controller");
var validateToken_middleware_1 = __importDefault(require("../middlewares/validateToken.middleware"));
var post_middleware_1 = require("../middlewares/post.middleware");
var router = express_1.default.Router();
router.post("/", validateToken_middleware_1.default, validateRequest_middleware_1.default(post_schema_1.createPostSchema), post_controller_1.createPost);
router.get("/", validateToken_middleware_1.default, post_controller_1.getPosts);
router.patch("/:id", validateToken_middleware_1.default, post_middleware_1.getPost, post_controller_1.editPost);
router.delete("/:id", validateToken_middleware_1.default, post_middleware_1.getPost, post_controller_1.deletePost);
router.patch("/:id/reactPost", post_middleware_1.getPost, post_controller_1.reactPost);
exports.default = router;
