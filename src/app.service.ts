import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    const dbUser = this.configService.get<string>('DATABASE_USER');
    console.log('dbUser', dbUser);
    return dbUser + process.env.NODEENV;
  }
}
