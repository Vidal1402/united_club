import { PrismaService } from '../../prisma/prisma.service';
import { Proposal, Prisma } from '@prisma/client';
export declare class ProposalsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ProposalCreateInput): Promise<Proposal>;
    findById(id: string): Promise<Proposal | null>;
    findByIdempotencyKey(key: string): Promise<Proposal | null>;
    findMany(params: {
        skip?: number;
        take?: number;
        where?: Prisma.ProposalWhereInput;
        orderBy?: Prisma.ProposalOrderByWithRelationInput;
    }): Promise<Proposal[]>;
    count(where?: Prisma.ProposalWhereInput): Promise<number>;
    update(id: string, data: Prisma.ProposalUpdateInput): Promise<Proposal>;
}
