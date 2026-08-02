import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class PaginationPayload {
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  public page!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: ' "limit" attribute should be a number ' })
  public limit!: number;

  @IsOptional()
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}
