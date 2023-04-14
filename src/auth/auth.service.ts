import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from 'src/admins/schema/admins.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Admin.name) private admins: Model<Admin>,
  ) {}

  async signIn(data: LoginDto) {
    const user = await this.admins.findOne({ email: data.email });

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { _id: user._id, name: user.name };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
