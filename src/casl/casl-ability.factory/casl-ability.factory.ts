import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { Favorite } from '@/favorites/entities/favorite.entity';
import { User, UserRole } from '@/users/entities/user.entity';

export enum Action {
  Manage = 'manage', // wildcard for any action
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof Favorite | typeof User> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      // Regular users can read their own profiles
      can(Action.Read, User, { id: user.id });
      // Regular users can update their own profile
      can(Action.Update, User, { id: user.id });
      can(Action.Delete, User, { id: user.id });
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
