import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private repository: ProductsRepository) {}

  async create(dto: CreateProductDto) {
    const existing = await this.repository.findBySlug(dto.slug);
    if (existing) throw new ConflictException('Produto com este slug já existe');
    return this.repository.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      price: dto.price,
      isActive: dto.isActive ?? true,
    });
  }

  async findById(id: string) {
    const product = await this.repository.findById(id);
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async findMany(page: number = 1, limit: number = 20, activeOnly?: boolean) {
    const skip = (page - 1) * limit;
    const where = activeOnly ? { isActive: true } : {};
    const [data, total] = await Promise.all([
      this.repository.findMany({ skip, take: limit, where }),
      this.repository.count(where),
    ]);
    return { data, total };
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);
    const payload: Record<string, unknown> = { ...dto };
    if (dto.price != null) payload.price = dto.price;
    return this.repository.update(id, payload as { name?: string; slug?: string; description?: string; price?: number; isActive?: boolean });
  }
}
