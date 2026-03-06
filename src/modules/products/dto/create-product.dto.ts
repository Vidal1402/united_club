import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min, ValidateIf } from 'class-validator';

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

  @ApiPropertyOptional({ description: 'URL da imagem (após upload no front/S3/Cloudinary)' })
  @IsOptional()
  @ValidateIf((o) => o.imageUrl != null && o.imageUrl !== '')
  @IsString()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'URL da video-aula (após upload)' })
  @IsOptional()
  @ValidateIf((o) => o.videoUrl != null && o.videoUrl !== '')
  @IsString()
  @IsUrl({ require_tld: false })
  videoUrl?: string;
}
