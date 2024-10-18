import { Module } from '@nestjs/common';

import { CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory], // Make sure to export it so other modules can use it
})
export class AbilityModule {}
