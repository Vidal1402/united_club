import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Slug único (ex.: curso-xyz)' })
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({ description: 'Descrição do produto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Preço (R$ ou unidade)' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Produto ativo para venda' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Imagem do produto (não obrigatório). URL ou data URL base64.' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Video-aula (não obrigatório). URL ou data URL base64.' })
  @IsOptional()
  @IsString()
  videoUrl?: string;
}
