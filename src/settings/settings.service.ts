import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSettingDto } from '@/settings/dto/create-setting.dto';
import { UpdateSettingDto } from '@/settings/dto/update-setting.dto';
import { Setting } from '@/settings/entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Setting) private readonly settingsRepository: Repository<Setting>) {}

  create(createSettingDto: CreateSettingDto) {
    return this.settingsRepository.save(this.settingsRepository.create(createSettingDto));
  }

  findAll() {
    return this.settingsRepository.find();
  }

  findOne(id: string) {
    return this.settingsRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateSettingDto: UpdateSettingDto) {
    const setting = await this.settingsRepository.findOneByOrFail({ id });

    return this.settingsRepository.save(Object.assign(setting, updateSettingDto));
  }

  async remove(id: string) {
    const setting = await this.settingsRepository.findOneByOrFail({ id });

    return this.settingsRepository.remove(setting);
  }
}
