import { Module } from '@nestjs/common';
import { AppErrorService } from './app-error.service';
import { AppErrorController } from './app-error.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppError, AppErrorSchema } from './schema/apperror.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppError.name, schema: AppErrorSchema },
    ]),
  ],
  controllers: [AppErrorController],
  providers: [AppErrorService],
})
export class AppErrorModule {}
