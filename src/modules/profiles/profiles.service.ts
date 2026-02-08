import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProfilesRepository } from './profiles.repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private repository: ProfilesRepository) {}

  async create(userId: string, dto: CreateProfileDto) {
    return this.repository.create({
      user: { connect: { id: userId } },
      fullName: dto.fullName,
      document: dto.document,
      phone: dto.phone,
      avatarUrl: dto.avatarUrl,
      bankCode: dto.bankCode,
      bankAgency: dto.bankAgency,
      bankAccount: dto.bankAccount,
      pixKey: dto.pixKey,
    });
  }

  async findByUserId(userId: string) {
    const profile = await this.repository.findByUserId(userId);
    if (!profile) throw new NotFoundException('Perfil não encontrado');
    return profile;
  }

  async update(userId: string, dto: UpdateProfileDto, currentUserId: string) {
    if (userId !== currentUserId) {
      throw new ForbiddenException('Acesso negado a este perfil');
    }
    const profile = await this.repository.findByUserId(userId);
    if (!profile) throw new NotFoundException('Perfil não encontrado');
    return this.repository.update(profile.id, dto);
  }
}
