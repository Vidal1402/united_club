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
async function bootstrap() {
    console.log('[Render] Bootstrap iniciando... PORT=', process.env.PORT);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: process.env.NODE_ENV === 'production',
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    const corsOrigin = config.get('CORS_ORIGIN', '*');
    const origins = corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);
    const allowOrigin = origins.length && !origins.every((o) => o === '*')
        ? origins
        : true;
    app.enableCors({
        origin: allowOrigin,
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