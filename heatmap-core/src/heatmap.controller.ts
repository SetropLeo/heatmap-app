import { Controller, Post, Get, Req } from '@nestjs/common';
import { HeatmapService } from './heatmap.service';
import type { Request } from 'express';

@Controller('heatmap')
export class HeatmapController {
  constructor(private service: HeatmapService) {}

  @Post('events')
  collectEvents(@Req() req: Request) {
    let payload = req.body;

    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        console.log('Erro ao parsear:', payload);
        return { ok: false };
      }
    }

    if (!Array.isArray(payload)) {
      console.log('Payload inválido:', payload);
      return { ok: false };
    }

    console.log('SALVANDO EVENTOS:', payload.length);
    this.service.saveEvents(payload);

    return { ok: true };
  }

  @Post('identify')
  identifyUser(@Req() req: Request) {
    let payload = req.body;

    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        console.log('Erro ao parsear:', payload);
        return { ok: false };
      }
    }

    if (!payload || !(typeof payload === 'object') || Array.isArray(payload)) {
      console.log('Payload inválido:', payload);
      return { ok: false };
    }

    console.log('SALVANDO USUÁRIO:', Object.keys(payload).length);
    this.service.saveUser(payload);

    return { ok: true };
  }

  @Get('events')
  getData() {
    return this.service.getAllEvents();
  }

  @Get('users')
  getUsers() {
    return this.service.getAllUsers();
  }
}
