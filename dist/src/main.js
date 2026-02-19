"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const LOVABLE_ORIGIN_SUFFIXES = ['.lovable.app', '.lovableproject.com'];
function isLovableOrigin(origin) {
    if (!origin || typeof origin !== 'string')
        return false;
    return LOVABLE_ORIGIN_SUFFIXES.some((s) => origin.endsWith(s));
}
function corsMiddleware(req, res, next) {
    const raw = process.env.CORS_ORIGIN ?? '*';
    const origins = raw.split(',').map((o) => o.trim()).filter(Boolean);
    const allowAny = origins.length === 0 || origins.every((o) => o === '*');
    const requestOrigin = req.headers.origin;
    let origin;
    if (allowAny) {
        origin = requestOrigin;
    }
    else if (requestOrigin && origins.includes(requestOrigin)) {
        origin = requestOrigin;
    }
    else if (isLovableOrigin(requestOrigin)) {
        origin = requestOrigin;
    }
    if (origin)
        res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    next();
}
async function bootstrap() {
    console.log('[Render] Bootstrap iniciando... PORT=', process.env.PORT);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(corsMiddleware);
    const config = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: process.env.NODE_ENV === 'production',
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    const corsOrigin = config.get('CORS_ORIGIN', '*');
    const origins = corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);
    const allowAny = origins.length === 0 || origins.every((o) => o === '*');
    const originCallback = (requestOrigin, callback) => {
        if (allowAny || !requestOrigin) {
            callback(null, allowAny ? requestOrigin : true);
            return;
        }
        if (origins.includes(requestOrigin) || isLovableOrigin(requestOrigin)) {
            callback(null, requestOrigin);
            return;
        }
        callback(null, false);
    };
    app.enableCors({
        origin: originCallback,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const swagger = new swagger_1.DocumentBuilder()
        .setTitle('United Club API')
        .setDescription('Plataforma de Afiliados Gamificada - Fintech')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swagger);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = Number(process.env.PORT) || 10000;
    if (!Number.isInteger(port) || port < 1) {
        throw new Error(`PORT inválido: ${process.env.PORT}`);
    }
    console.log('[Render] Abrindo porta', port, 'em 0.0.0.0...');
    await app.listen(port, '0.0.0.0');
    console.log(`United Club API listening on port ${port}`);
    console.log(`Swagger: /api/docs`);
}
bootstrap().catch((err) => {
    console.error('Falha ao subir a API:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map