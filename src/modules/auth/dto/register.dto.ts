import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';

const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiPropertyOptional({ example: '11999999999' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'ID do usuário que indicou (MongoDB ObjectId). Permite comissões multinível.' })
  @IsOptional()
  @ValidateIf((o) => o.referrerId != null && o.referrerId !== '')
  @IsString()
  @Matches(OBJECT_ID_REGEX, { message: 'referrerId deve ser um ObjectId válido (24 caracteres hex)' })
  referrerId?: string;
}
