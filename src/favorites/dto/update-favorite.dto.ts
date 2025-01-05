import { PartialType } from '@nestjs/swagger';

import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';

export class UpdateFavoriteDto extends PartialType(CreateFavoriteDto) {}
