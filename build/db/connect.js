"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var logger_1 = __importDefault(require("../logger"));
var dbConnect = function () {
    mongoose_1.default.connect("" + process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose_1.default.set("useFindAndModify", false);
    var db = mongoose_1.default.connection;
    db.once("open", function () { return logger_1.default.info("Connected to Mongo DB!!"); });
    db.on("error", function (error) { return logger_1.default.error(error); });
};
exports.default = dbConnect;
