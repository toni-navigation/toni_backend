import { Module } from '@nestjs/common';

import { BlacklistService } from '@/blacklist/blacklist.service';

@Module({
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule {}
