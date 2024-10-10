import { PartialType } from '@nestjs/swagger';

import { CreateSettingDto } from '@/settings/dto/create-setting.dto';

export class UpdateSettingDto extends PartialType(CreateSettingDto) {}
