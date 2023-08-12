"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validateToken_middleware_1 = __importDefault(require("../middlewares/validateToken.middleware"));
var following_controller_1 = require("../controller/following.controller");
var router = express_1.default.Router();
router.get("/:id", validateToken_middleware_1.default, following_controller_1.retrieveFollowing);
exports.default = router;
