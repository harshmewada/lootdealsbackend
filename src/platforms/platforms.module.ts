import { Module } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { PlatformsController } from './platforms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Platform, PlatformSchema } from './schema/platforms.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Platform.name, schema: PlatformSchema },
    ]),
  ],
  controllers: [PlatformsController],
  providers: [PlatformsService],
})
export class PlatformsModule {}
