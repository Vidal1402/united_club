import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateProposalDto {
  @ApiProperty()
  @IsUUID()
  profileId: string;

  @ApiProperty()
  @IsUUID()
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
