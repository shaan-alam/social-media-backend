"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_controller_1 = require("../controller/auth.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var validateRequest_middleware_1 = __importDefault(require("../middlewares/validateRequest.middleware"));
var auth_schema_1 = require("../schema/auth.schema");
var router = express_1.default.Router();
router.post("/signup/", validateRequest_middleware_1.default(auth_schema_1.createUserSchema), auth_middleware_1.getUser, auth_controller_1.signUp);
router.post("/signin/", validateRequest_middleware_1.default(auth_schema_1.loginSchema), auth_middleware_1.getUser, auth_controller_1.signIn);
router.post("/getuser", auth_middleware_1.getUser, auth_controller_1.getUserFromDB);
router.post("/googleAuth", validateRequest_middleware_1.default(auth_schema_1.googleAuthSchema), auth_middleware_1.getUser, auth_controller_1.googleAuthentication);
exports.default = router;
