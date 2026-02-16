import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User, Profile, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  async create(data: {
    email: string;
    passwordHash: string;
    role?: Role;
  }): Promise<User> {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }
    return this.repository.create({
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role ?? 'affiliate',
    });
  }

  async createForRegister(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string;
  }): Promise<User & { profile: Profile | null }> {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }
    return this.repository.createUserWithProfile(
      {
        email: data.email,
        passwordHash: data.passwordHash,
        role: 'affiliate',
      },
      { fullName: data.fullName, phone: data.phone },
    );
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }

  async findMany(params: {
    page?: number;
    limit?: number;
    role?: Role;
  }) {
    const skip = params.page && params.limit ? (params.page - 1) * params.limit : 0;
    const take = params.limit ?? 20;
    const where = params.role ? { role: params.role } : {};
    const [users, total] = await Promise.all([
      this.repository.findMany({ skip, take, where }),
      this.repository.count(where),
    ]);
    return { data: users, total };
  }
}
