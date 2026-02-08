"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const products_repository_1 = require("./products.repository");
let ProductsService = class ProductsService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        const existing = await this.repository.findBySlug(dto.slug);
        if (existing)
            throw new common_1.ConflictException('Produto com este slug já existe');
        return this.repository.create({
            name: dto.name,
            slug: dto.slug,
            description: dto.description,
            price: dto.price,
            isActive: dto.isActive ?? true,
        });
    }
    async findById(id) {
        const product = await this.repository.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Produto não encontrado');
        return product;
    }
    async findMany(page = 1, limit = 20, activeOnly) {
        const skip = (page - 1) * limit;
        const where = activeOnly ? { isActive: true } : {};
        const [data, total] = await Promise.all([
            this.repository.findMany({ skip, take: limit, where }),
            this.repository.count(where),
        ]);
        return { data, total };
    }
    async update(id, dto) {
        await this.findById(id);
        const payload = { ...dto };
        if (dto.price != null)
            payload.price = dto.price;
        return this.repository.update(id, payload);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_repository_1.ProductsRepository])
], ProductsService);
//# sourceMappingURL=products.service.js.map