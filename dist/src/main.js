"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: process.env.NODE_ENV === 'production',
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    app.enableCors({
        origin: config.get('CORS_ORIGIN', '*').split(','),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    try {
        const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
        const swagger = new DocumentBuilder()
            .setTitle('United Club API')
            .setDescription('Plataforma de Afiliados Gamificada - Fintech')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, swagger);
        SwaggerModule.setup('api/docs', app, document);
        console.log('Swagger: /api/docs');
    }
    catch (e) {
        console.warn('Swagger não carregado (API segue funcionando):', e.message);
    }
    const port = Number(process.env.PORT) || config.get('PORT', 3000);
    await app.listen(port, '0.0.0.0');
    console.log(`United Club API listening on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map