import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateSettingDto } from '@/settings/dto/create-setting.dto';
import { UpdateSettingDto } from '@/settings/dto/update-setting.dto';
import { SettingsService } from '@/settings/settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  // @Patch(':id/add-meter')
  // async addMeter(@Param('id') id: string, @Body('meter') meter: number) {
  //   return this.settingsService.addMeter(id, meter);
  // }
  //
  // @Patch(':id/add-factor')
  // async addFactor(@Param('id') id: string, @Body('factor') factor: number) {
  //   return this.settingsService.addFactor(id, factor);
  // }

  @Get(':settingId')
  findOne(@Param('settingId') settingId: string) {
    return this.settingsService.findOne(settingId);
  }

  @Patch(':settingId')
  update(@Param('settingId') settingId: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(settingId, updateSettingDto);
  }

  @Delete(':settingId')
  remove(@Param('settingId') settingId: string) {
    return this.settingsService.remove(settingId);
  }
}
