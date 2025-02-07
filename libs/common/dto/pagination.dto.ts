import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequestDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  page: number;
}
