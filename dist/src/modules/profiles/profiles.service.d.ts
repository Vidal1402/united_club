import { ProfilesRepository } from './profiles.repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesService {
    private repository;
    constructor(repository: ProfilesRepository);
    create(userId: string, dto: CreateProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        document: string | null;
        phone: string | null;
        avatarUrl: string | null;
        bankCode: string | null;
        bankAgency: string | null;
        bankAccount: string | null;
        pixKey: string | null;
        userId: string;
    }>;
    findByUserId(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        document: string | null;
        phone: string | null;
        avatarUrl: string | null;
        bankCode: string | null;
        bankAgency: string | null;
        bankAccount: string | null;
        pixKey: string | null;
        userId: string;
    }>;
    update(userId: string, dto: UpdateProfileDto, currentUserId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        document: string | null;
        phone: string | null;
        avatarUrl: string | null;
        bankCode: string | null;
        bankAgency: string | null;
        bankAccount: string | null;
        pixKey: string | null;
        userId: string;
    }>;
}
