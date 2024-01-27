import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Query,
  Delete,
  Param,
  Put,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UsersService } from './users.service';
import {
  CreateBulkUsersDto,
  CreateUserDto,
  FindAllParams,
  UpdateUserDto,
} from './dtos';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Res() res: any, @Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    await firstValueFrom(this.client.emit('user_created', user));

    return res.status(201).json(user);
  }

  @Post('bulk')
  async bulk(@Res() res: any, @Body() dto: CreateBulkUsersDto) {
    const inserted = await this.usersService.bulk(dto);

    const response = {
      statusCode: 201,
      message: `${inserted} users were created.`,
    };

    return res.status(201).json(response);
  }

  @Put(':id')
  async update(
    @Res() res: any,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    await this.usersService.update(id, dto);

    const response = {
      statusCode: 200,
      message: `User was updated.`,
    };

    return res.status(200).json(response);
  }

  @Get()
  async findAll(@Res() res: any, @Query() params: FindAllParams) {
    const users = await this.usersService.findAll(params);
    return res.status(200).json(users);
  }

  @Get(':id')
  async findById(@Res() res: any, @Param('id') id: string) {
    const user = await this.usersService.findOne({ _id: id });
    return res.status(200).json(user);
  }

  @Delete(':id')
  async removeById(@Res() res: any, @Param('id') id: string) {
    await this.usersService.removeById(id);

    const response = {
      statusCode: 200,
      message: `User was deleted.`,
    };

    return res.status(200).json(response);
  }
}
