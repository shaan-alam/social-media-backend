"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var logger_1 = __importDefault(require("./logger"));
var connect_1 = __importDefault(require("./db/connect"));
var routes_1 = __importDefault(require("./routes"));
var cors_1 = __importDefault(require("cors"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var path_1 = __importDefault(require("path"));
dotenv_1.default.config();
var app = express_1.default();
var PORT = process.env.PORT || 5000;
app.use(cors_1.default());
app.use(express_1.default.json({ limit: "25mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "25mb" }));
app.use("/static", express_1.default.static(path_1.default.join(__dirname, "assets")));
var options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Facebook 2.0 API",
            version: "1.0.0",
            description: "API Docs for Facebook 2.0",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
    },
    apis: ["./src/routes/*.route.ts"],
};
var specs = swagger_jsdoc_1.default(options);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
    customSiteTitle: "Facebook 2.0 Documentation",
    customCssUrl: "http://localhost:5000/static/css/custom.css",
}));
// Routing configuration
routes_1.default(app);
app.listen(PORT, function () {
    logger_1.default.info("The server is up and running on PORT " + PORT);
    connect_1.default();
});
