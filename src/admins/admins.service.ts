import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PERMISSIONS } from 'src/constants';
import { AdminDto } from './dto/admins.dto';
import { Admin } from './schema/admins.schema';
import bcrypt from 'bcrypt';

const saltOrRounds = 10;
@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private admins: Model<Admin>) {}

  async create(data: AdminDto) {
    try {
      const existing = await this.admins.findOne({ email: data.email });
      if (existing) {
        throw new ConflictException('Admin with same email  already exists');
      }
      const hash = await bcrypt.hash(data.password, saltOrRounds);
      await this.admins.create({
        ...data,
        permissions: PERMISSIONS[data.role],
        password: hash,
      });

      return;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
