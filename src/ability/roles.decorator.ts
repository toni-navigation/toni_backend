// src/ability/check-policies.decorator.ts
import { SetMetadata } from '@nestjs/common';

import { PolicyHandler } from '@/ability/policy-handler.interface';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);
