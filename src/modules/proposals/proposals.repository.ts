import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Proposal, Prisma, ProposalStatus } from '@prisma/client';

@Injectable()
export class ProposalsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProposalCreateInput): Promise<Proposal> {
    return this.prisma.proposal.create({ data });
  }

  async findById(id: string): Promise<Proposal | null> {
    return this.prisma.proposal.findUnique({
      where: { id },
      include: { product: true, profile: { include: { user: true } }, commissions: true },
    });
  }

  async findByIdempotencyKey(key: string): Promise<Proposal | null> {
    return this.prisma.proposal.findUnique({
      where: { idempotencyKey: key },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProposalWhereInput;
    orderBy?: Prisma.ProposalOrderByWithRelationInput;
  }): Promise<Proposal[]> {
    return this.prisma.proposal.findMany({
      ...params,
      include: { product: true, profile: true, commissions: true },
    });
  }

  async count(where?: Prisma.ProposalWhereInput): Promise<number> {
    return this.prisma.proposal.count({ where });
  }

  async update(id: string, data: Prisma.ProposalUpdateInput): Promise<Proposal> {
    return this.prisma.proposal.update({
      where: { id },
      data,
      include: { product: true, profile: true, commissions: true },
    });
  }
}
