import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

/** MongoDB ObjectId: 24 caracteres hexadecimais */
const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;

export class CreateProposalDto {
  @ApiProperty({ description: 'ID do perfil (MongoDB ObjectId)' })
  @IsString()
  @Matches(OBJECT_ID_REGEX, { message: 'profileId deve ser um ObjectId válido (24 caracteres hex)' })
  profileId: string;

  @ApiProperty({ description: 'ID do produto (MongoDB ObjectId)' })
  @IsString()
  @Matches(OBJECT_ID_REGEX, { message: 'productId deve ser um ObjectId válido (24 caracteres hex)' })
  productId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  value: number;

  @ApiPropertyOptional({ description: 'Chave de idempotência para evitar duplicidade' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
