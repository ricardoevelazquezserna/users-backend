import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from './schemas';
import { UserEntity } from './entities';
import { UserStatusEnum } from './enums';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/shared/constants';
import { IFindResponse } from 'src/shared/interfaces';
import {
  CreateBulkUsersDto,
  CreateUserDto,
  FindAllParams,
  FindOneParams,
} from './dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserEntity>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    try {
      const user: User = {
        ...dto,
        status: UserStatusEnum.ACTIVE,
        lastSessionAt: null,
      };

      const createdUser = await this.userModel.create(user);

      return Promise.resolve(createdUser.toJSON());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async bulk(dto: CreateBulkUsersDto): Promise<number> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      const users = dto.users.map((current) => {
        return {
          insertOne: {
            document: {
              ...current,
              status: UserStatusEnum.ACTIVE,
              lastSessionAt: null,
            },
          },
        };
      });

      const bulkResult = await this.userModel.bulkWrite(users, { session });

      await session.commitTransaction();

      return Promise.resolve(bulkResult.insertedCount);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return Promise.reject(error);
    }
  }

  async update(id: string, dto: CreateUserDto): Promise<void> {
    try {
      const filters = { _id: id };

      await this.userModel.updateOne(filters, dto);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findAll(params: FindAllParams): Promise<IFindResponse> {
    try {
      const { name, lastName, email, status } = params;
      const offset = Number(params.offset) || DEFAULT_OFFSET;
      const limit = Number(params.limit) || DEFAULT_LIMIT;
      const filters = { status: status || UserStatusEnum.ACTIVE };
      const fields = 'name middleName lastName email';
      const sort = params.sort ? params.sort : 'createdAt';

      if (name) filters['name'] = { $regex: name };
      if (lastName) filters['lastName'] = { $regex: lastName };
      if (email) filters['email'] = { $regex: email };

      const usersQuery = this.userModel
        .find(filters)
        .select(fields)
        .skip(offset)
        .sort(sort)
        .limit(limit);

      const countQuery = this.userModel.countDocuments(filters);
      const promises = [usersQuery.exec(), countQuery.exec()];

      const responses = await Promise.all(promises);

      const users = responses[0] as any[];
      const count = responses[1] as number;

      const usersMapped: UserEntity[] = users.map((user) => user.toJSON());

      const response: IFindResponse = {
        items: usersMapped,
        total: count,
        offset,
        limit,
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOne(params: FindOneParams): Promise<UserEntity> {
    try {
      const response = await this.userModel.findOne(params);

      if (!response) throw new NotFoundException('User not found.');

      const user: UserEntity = response.toJSON();

      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async removeById(id: string): Promise<void> {
    try {
      await this.userModel.deleteOne({ _id: id });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
