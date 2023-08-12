"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var commentReply_controller_1 = require("../controller/commentReply.controller");
var validateToken_middleware_1 = __importDefault(require("../middlewares/validateToken.middleware"));
var validateRequest_middleware_1 = __importDefault(require("../middlewares/validateRequest.middleware"));
var commentReply_schema_1 = require("../schema/commentReply.schema");
var router = express_1.default.Router();
router.post("/reply", validateToken_middleware_1.default, validateRequest_middleware_1.default(commentReply_schema_1.createCommentReplySchema), commentReply_controller_1.createCommentReply);
router.get("/replies/:commentId", validateToken_middleware_1.default, commentReply_controller_1.retrieveCommentReplies);
router.patch("/edit-reply/:commentReplyId", validateToken_middleware_1.default, commentReply_controller_1.editCommentReply);
router.delete("/delete-reply/:commentReplyId", validateToken_middleware_1.default, commentReply_controller_1.deleteCommentReply);
exports.default = router;
