import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

/** MongoDB ObjectId: 24 caracteres hexadecimais */
const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;

export class CreateProposalDto {
  @ApiPropertyOptional({ description: 'Ignorado para afiliado; obrigatório para admin' })
  @IsOptional()
  @ValidateIf((o) => o.profileId != null && o.profileId !== '')
  @IsString()
  @Matches(OBJECT_ID_REGEX, { message: 'profileId deve ser um ObjectId válido (24 caracteres hex)' })
  profileId?: string;

  @ApiProperty({ description: 'ID do produto (MongoDB ObjectId)' })
  @IsString()
  @Matches(OBJECT_ID_REGEX, { message: 'productId deve ser um ObjectId válido (24 caracteres hex)' })
  productId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  value: number;

  @ApiPropertyOptional({ description: 'Chave de idempotência para evitar duplicidade' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
