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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
let UsersService = class UsersService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(data) {
        const existing = await this.repository.findByEmail(data.email);
        if (existing) {
            throw new common_1.ConflictException('E-mail já cadastrado');
        }
        return this.repository.create({
            email: data.email.toLowerCase(),
            role: data.role ?? 'affiliate',
        });
    }
    async findById(id) {
        return this.repository.findById(id);
    }
    async findByEmail(email) {
        return this.repository.findByEmail(email);
    }
    async findMany(params) {
        const skip = params.page && params.limit ? (params.page - 1) * params.limit : 0;
        const take = params.limit ?? 20;
        const where = params.role ? { role: params.role } : {};
        const [users, total] = await Promise.all([
            this.repository.findMany({ skip, take, where }),
            this.repository.count(where),
        ]);
        return { data: users, total };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map