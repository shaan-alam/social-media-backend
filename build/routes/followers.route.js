"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validateToken_middleware_1 = __importDefault(require("../middlewares/validateToken.middleware"));
var followers_controller_1 = require("../controller/followers.controller");
var router = express_1.default.Router();
router.get("/:id", validateToken_middleware_1.default, followers_controller_1.retrieveFollowers);
exports.default = router;
