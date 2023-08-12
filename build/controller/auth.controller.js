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
exports.googleAuthentication = exports.getUserFromDB = exports.signIn = exports.signUp = void 0;
var user_model_1 = __importDefault(require("../models/user.model"));
var jwt_service_1 = require("../service/jwt.service");
var lodash_1 = require("lodash");
var logger_1 = __importDefault(require("../logger"));
/**
 * @description Sign Up controller to create a new user and save it in the database
 * @param req Express Request Object
 * @param res Express Response Object
 */
var signUp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullName, email, password, avatar, newUser, token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (res.locals.user) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "A user already exists with that email!" })];
                }
                _a = req.body, fullName = _a.fullName, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                avatar = "https://avatars.dicebear.com/api/initials/" + fullName + ".svg";
                return [4 /*yield*/, new user_model_1.default({ fullName: fullName, email: email, password: password, avatar: avatar, })];
            case 2:
                newUser = _b.sent();
                return [4 /*yield*/, newUser.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, jwt_service_1.signToken(newUser._id)];
            case 4:
                token = _b.sent();
                res.json({ user: lodash_1.omit(newUser.toJSON(), "password"), token: token });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                logger_1.default.error(err_1);
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.signUp = signUp;
/**
 * @description Sign In controller to login the user
 * @param req Express Request Object
 * @param res Express Response Object
 */
var signIn = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var password, user, isValid, token, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!res.locals.user) {
                    return [2 /*return*/, res.status(404).json({ message: "No user with that email!" })];
                }
                password = req.body.password;
                user = res.locals.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, user.comparePassword(password)];
            case 2:
                isValid = _a.sent();
                if (!isValid) {
                    return [2 /*return*/, res.status(400).json({ err: "Invalid Password " })];
                }
                return [4 /*yield*/, jwt_service_1.signToken(user._id)];
            case 3:
                token = _a.sent();
                res.json({ user: lodash_1.omit(user.toJSON(), "password"), token: token });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                logger_1.default.error(err_2);
                res.json({ message: err_2.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.signIn = signIn;
/**
 * @description To get the user from the database along with token.
 * @param req Express Request Object.
 * @param res Express Response Object
 */
var getUserFromDB = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!res.locals.user) return [3 /*break*/, 2];
                return [4 /*yield*/, jwt_service_1.signToken(res.locals.user._id)];
            case 1:
                token = _a.sent();
                return [2 /*return*/, res.json({ user: res.locals.user, token: token })];
            case 2: return [2 /*return*/, res.json({ message: "No user found with that email" })];
        }
    });
}); };
exports.getUserFromDB = getUserFromDB;
/**
 * @description Google Authentication controller to signin/signup.
 * @param req Express Request Object
 * @param res Express Response Object
 */
var googleAuthentication = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, avatar, fullName, email, token, newUser, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, avatar = _a.avatar, fullName = _a.fullName, email = _a.email;
                if (!res.locals.user) return [3 /*break*/, 2];
                return [4 /*yield*/, jwt_service_1.signToken(res.locals.user._id)];
            case 1:
                token = _b.sent(); // Sign a new JWT Token
                return [2 /*return*/, res.json({ user: lodash_1.omit(res.locals.user.toJSON(), "password"), token: token })];
            case 2:
                _b.trys.push([2, 6, , 7]);
                return [4 /*yield*/, new user_model_1.default({ email: email, fullName: fullName, avatar: avatar })];
            case 3:
                newUser = _b.sent();
                return [4 /*yield*/, jwt_service_1.signToken(newUser._id)];
            case 4:
                token = _b.sent(); // Sign a new JWT Token
                return [4 /*yield*/, newUser.save()];
            case 5:
                _b.sent();
                res.json({ user: lodash_1.omit(newUser.toJSON(), "password"), token: token });
                return [3 /*break*/, 7];
            case 6:
                err_3 = _b.sent();
                logger_1.default.error(err_3);
                res.status(400).json({ message: "Something went wrong!" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.googleAuthentication = googleAuthentication;
