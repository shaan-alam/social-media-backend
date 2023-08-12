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
var mongoose_1 = __importDefault(require("mongoose"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var followers_model_1 = __importDefault(require("./followers.model"));
var following_model_1 = __importDefault(require("./following.model"));
var UserSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        min: 6,
    },
    avatar: {
        type: String,
        default: "",
    },
    cover_picture: {
        type: String,
        default: "",
    },
    details: {
        lives_in_city: {
            type: String,
            default: "",
        },
        from_city: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
        },
        education: {
            type: [String],
            default: [],
        },
        works: {
            type: [String],
            default: [],
        },
    },
}, { timestamps: true });
// Used for logging in
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            user = this;
            return [2 /*return*/, bcryptjs_1.default.compare(candidatePassword, user.password).catch(function (e) { return false; })];
        });
    });
};
// Middleware Used For hashing the password
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, hashedPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = this;
                    if (!user.password) return [3 /*break*/, 2];
                    return [4 /*yield*/, bcryptjs_1.default.hash(user.password, 12)];
                case 1:
                    hashedPassword = _a.sent();
                    user.password = hashedPassword;
                    _a.label = 2;
                case 2:
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
// Middleware to create a followers and following document when a new user is created
UserSchema.post("save", function (user) {
    return __awaiter(this, void 0, void 0, function () {
        var followers, following;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new followers_model_1.default({ userId: user._id })];
                case 1:
                    followers = _a.sent();
                    return [4 /*yield*/, followers.save()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, new following_model_1.default({ userId: user._id })];
                case 3:
                    following = _a.sent();
                    return [4 /*yield*/, following.save()];
                case 4:
                    _a.sent();
                    console.log(followers);
                    console.log(following);
                    return [2 /*return*/];
            }
        });
    });
});
var User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
