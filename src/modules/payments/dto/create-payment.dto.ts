import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsIn, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: ['withdrawal', 'advance'] })
  @IsIn(['withdrawal', 'advance'])
  type: 'withdrawal' | 'advance';
}
