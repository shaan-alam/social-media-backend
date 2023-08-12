"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCloudinaryUrl = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var cloudinary_1 = __importDefault(require("cloudinary"));
dotenv_1.default.config();
cloudinary_1.default.v2.config({
    cloud_name: "" + process.env.CLOUDINARY_CLOUD_NAME,
    api_key: "" + process.env.CLOUDINARY_API_KEY,
    api_secret: "" + process.env.CLOUDINARY_API_SECRET,
});
var formatCloudinaryUrl = function (url, size, thumb) {
    if (!url)
        return "";
    var splitUrl = url.split("upload/");
    splitUrl[0] += "upload/w_" + size.width + ",h_" + size.height + (thumb && ",c_thumb") + "/";
    var formattedUrl = splitUrl[0] + splitUrl[1];
    return formattedUrl;
};
exports.formatCloudinaryUrl = formatCloudinaryUrl;
exports.default = cloudinary_1.default;
