import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginationParamsDto {
  @IsOptional()
  @IsNumberString()
  readonly offset: string;

  @IsOptional()
  @IsNumberString()
  readonly limit: string;

  @IsOptional()
  @IsString()
  readonly sort: string;

  @IsOptional()
  @IsString()
  readonly lng: string;

  @IsOptional()
  @IsString()
  readonly tz: string;
}
