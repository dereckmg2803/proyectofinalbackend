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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const hpp_1 = __importDefault(require("hpp"));
const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
};
class Server {
    constructor(options) {
        this.app = (0, express_1.default)();
        this.port = options.port;
        this.routes = options.routes;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(express_1.default.json({ limit: '100kb' }));
            this.app.use(express_1.default.urlencoded({ extended: true, limit: '50kb' }));
            this.app.use((0, cors_1.default)(corsOptions));
            this.app.use((0, cookie_parser_1.default)());
            this.app.disable('x-powered-by');
            this.app.use((0, helmet_1.default)());
            this.app.use((0, express_rate_limit_1.default)({
                windowMs: 15 * 60 * 1000,
                limit: 100,
            }));
            this.app.use((0, hpp_1.default)());
            /*this.app.use(
              helmet({
                contentSecurityPolicy: {
                  directives: {
                    defaultSrc: ["'self'"], // Permite cargar recursos solo desde el mismo origen
                    scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.example.com'], // Scripts desde tu origen y un CDN
                    styleSrc: [
                      "'self'",
                      "'unsafe-inline'",
                      'https://fonts.googleapis.com',
                    ], // Estilos desde tu origen y Google Fonts
                    imgSrc: ["'self'", 'data:', 'https://example.com'], // Imágenes desde tu origen, datos base64 y un dominio específico
                    connectSrc: ["'self'", 'ws://localhost:3000'], // Conexiones a tu origen y WebSockets
                    fontSrc: ["'self'", 'https://fonts.gstatic.com'], // Fuentes desde tu origen y Google Fonts
                    objectSrc: ["'none'"], // Prohíbe plugins como Flash o Java
                    baseUri: ["'self'"], // Restringe el atributo <base>
                    formAction: ["'self'"], // Restringe los destinos de los formularios
                    frameAncestors: ["'none'"], // Prohíbe que la página sea incrustada en iframes
                    upgradeInsecureRequests: [], // Si tu sitio es HTTPS, reescribe las URLs HTTP a HTTPS
                    // reportUri: '/report-violation', // Opcional: URL donde se enviarán los informes de violación de CSP
                  },
                },
                dnsPrefetchControl: { allow: false },
                frameguard: { action: 'deny' },
                hidePoweredBy: true,
                hsts: {
                  maxAge: 31536000,
                  includeSubDomains: true,
                  preload: false,
                },
                ieNoOpen: true,
                noSniff: true,
                permittedCrossDomainPolicies: {
                  permittedPolicies: 'none'
                },
                referrerPolicy: {
                  policy: 'no-referrer'
                },
                xssFilter: true
              })
            );*/
            //rutas
            this.app.use(this.routes);
            this.app.listen(this.port, () => {
                console.log(`Server is running on port ${this.port}`);
            });
        });
    }
}
exports.Server = Server;
