import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class CreateBulkUsersDto {
  @IsArray()
  @Type(() => CreateUserDto)
  @ValidateNested({ each: true })
  readonly users: CreateUserDto[];
}
