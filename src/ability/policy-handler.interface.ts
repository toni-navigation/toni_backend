// src/ability/policy-handler.interface.ts

import { AppAbility } from '@/casl/casl-ability.factory/casl-ability.factory';

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export interface PolicyHandler {
  handle(ability: AppAbility): boolean;
}

export type PolicyHandlerType = PolicyHandler | PolicyHandlerCallback;
