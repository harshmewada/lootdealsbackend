import { Module } from '@nestjs/common';
import { FilehostService } from './filehost.service';
import { FilehostController } from './filehost.controller';

@Module({
  controllers: [FilehostController],
  providers: [FilehostService]
})
export class FilehostModule {}
