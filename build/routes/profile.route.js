"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validateToken_middleware_1 = __importDefault(require("../middlewares/validateToken.middleware"));
var profile_controller_1 = require("../controller/profile.controller");
var router = express_1.default.Router();
router.get("/:id", validateToken_middleware_1.default, profile_controller_1.getProfile);
router.patch("/follow/:id", validateToken_middleware_1.default, profile_controller_1.followProfile);
router.patch("/unfollow/:id", validateToken_middleware_1.default, profile_controller_1.unfollowProfile);
router.get("/posts/:id", validateToken_middleware_1.default, profile_controller_1.getUserPosts);
router.patch("/edit/", validateToken_middleware_1.default, profile_controller_1.updateProfileDetails);
router.patch("/edit/profile-picture", validateToken_middleware_1.default, profile_controller_1.updateProfilePicture);
router.patch('/edit/cover-picture', validateToken_middleware_1.default, profile_controller_1.updateCoverPicture);
exports.default = router;
