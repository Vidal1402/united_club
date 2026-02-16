import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Profile, Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * Cria User e Profile em sequência (sem $transaction).
   * MongoDB Atlas M0 não suporta transações; apenas replica sets suportam.
   */
  async createUserWithProfile(
    userData: { email: string; passwordHash: string; role?: 'admin' | 'affiliate' },
    profileData: { fullName: string; phone?: string },
  ): Promise<User & { profile: Profile | null }> {
    const user = await this.prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        passwordHash: userData.passwordHash,
        role: userData.role ?? 'affiliate',
      },
    });
    try {
      await this.prisma.profile.create({
        data: {
          userId: user.id,
          fullName: profileData.fullName,
          phone: profileData.phone ?? undefined,
        },
      });
    } catch (err) {
      await this.prisma.user.delete({ where: { id: user.id } }).catch(() => {});
      throw err;
    }
    return this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      include: { profile: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      ...params,
      include: { profile: true },
    });
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }
}
