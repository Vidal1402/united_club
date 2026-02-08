import { PrismaService } from '../../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';
export declare class ProductsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ProductCreateInput): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    findBySlug(slug: string): Promise<Product | null>;
    findMany(params: {
        skip?: number;
        take?: number;
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
    }): Promise<Product[]>;
    count(where?: Prisma.ProductWhereInput): Promise<number>;
    update(id: string, data: Prisma.ProductUpdateInput): Promise<Product>;
}
