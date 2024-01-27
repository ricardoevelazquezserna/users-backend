import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from 'src/shared/dtos';
import { UserStatusEnum } from '../enums';

export class FindAllParams extends PaginationParamsDto {
  @IsOptional()
  @IsEnum(UserStatusEnum)
  readonly status: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  readonly email: string;
}
