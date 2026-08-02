import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FindAllQuryParams {
  @IsOptional()
  @IsInt({ message: 'Page must be a number' })
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page!: number;

  @IsInt({ message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  limit!: number;

  @IsOptional()
  search!: string;
}
