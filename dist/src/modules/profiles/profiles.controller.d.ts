import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { JwtPayload } from '../../common/types/auth.types';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    me(user: JwtPayload): Promise<{
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
    findOne(userId: string, user: JwtPayload): Promise<{
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
    update(userId: string, dto: UpdateProfileDto, user: JwtPayload): Promise<{
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
