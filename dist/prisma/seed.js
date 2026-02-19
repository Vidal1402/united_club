"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const JOURNEY_LEVELS = [
    { name: 'Aprendiz', slug: 'aprendiz', minSales: 15_000, order: 1 },
    { name: 'Executor', slug: 'executor', minSales: 50_000, order: 2 },
    { name: 'Alquimista', slug: 'alquimista', minSales: 100_000, order: 3 },
    { name: 'Mestre', slug: 'mestre', minSales: 250_000, order: 4 },
    { name: 'Mago', slug: 'mago', minSales: 500_000, order: 5 },
    { name: 'Lenda', slug: 'lenda', minSales: 1_000_000, order: 6 },
    { name: 'Campeao', slug: 'campeao', minSales: 5_000_000, order: 7 },
];
const ADMIN_EMAIL = 'admin@unitedclub.com';
const ADMIN_PASSWORD = 'admin123';
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        create: {
            email: ADMIN_EMAIL,
            passwordHash,
            role: 'admin',
        },
        update: {},
    });
    await prisma.profile.upsert({
        where: { userId: admin.id },
        create: { userId: admin.id, fullName: 'Administrador', document: 'ADMIN-SYSTEM' },
        update: { fullName: 'Administrador', document: 'ADMIN-SYSTEM' },
    });
    console.log('Admin user seeded:', ADMIN_EMAIL);
    for (const level of JOURNEY_LEVELS) {
        await prisma.journeyLevel.upsert({
            where: { slug: level.slug },
            create: level,
            update: { minSales: level.minSales, order: level.order, name: level.name },
        });
    }
    console.log('Journey levels seeded.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map