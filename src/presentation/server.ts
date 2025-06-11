import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import hpp from 'hpp';

interface Options {
    port: number;
    routes: Router;
}

const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
    origin: function (origin: string | undefined, callback: any) {
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
};

export class Server {
    private readonly app = express();
    private readonly port: number;
    private readonly routes: Router;

    constructor(options: Options) {
        this.port = options.port;
        this.routes = options.routes;
    }

    async start() {
        this.app.use(express.json({ limit: '100kb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50kb' }));
        this.app.use(cors(corsOptions));
        this.app.use(cookieParser());
        this.app.disable('x-powered-by');
        this.app.use(helmet());
        this.app.use(
            rateLimit({
                windowMs: 15 * 60 * 1000,
                limit: 100,
            })
        );
        this.app.use(hpp());
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
    }
}
