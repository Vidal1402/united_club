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
exports.JourneyService = void 0;
const common_1 = require("@nestjs/common");
const journey_repository_1 = require("./journey.repository");
let JourneyService = class JourneyService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async addSalesAndUpdateLevel(userId, saleValue) {
        return this.repository.updateTotalSales(userId, saleValue);
    }
    async getMyProgress(userId) {
        return this.repository.getProgress(userId);
    }
    async getAllLevels() {
        return this.repository.getAllLevels();
    }
};
exports.JourneyService = JourneyService;
exports.JourneyService = JourneyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [journey_repository_1.JourneyRepository])
], JourneyService);
//# sourceMappingURL=journey.service.js.map