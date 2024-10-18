// src/ability/policies.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CHECK_POLICIES_KEY } from '@/ability/check-policies.decorator';
import { PolicyHandlerType } from '@/ability/policy-handler.interface';
import { AppAbility, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandlerType[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.abilityFactory.defineAbility(user);

    return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability));
  }

  private execPolicyHandler(handler: PolicyHandlerType, ability: AppAbility): boolean {
    if (typeof handler === 'function') {
      return handler(ability); // Handle function-based policy
    }

    return handler.handle(ability); // Handle class-based policy
  }
}
