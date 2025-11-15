import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class HeatmapService {
  private eventFilePath = path.join(__dirname, '..', 'events.json');
  private userFilePath = path.join(__dirname, '..', 'users.json');

  constructor() {
    // cria se não existir
    if (!fs.existsSync(this.eventFilePath)) {
      fs.writeFileSync(this.eventFilePath, '[]'); // começa como array vazio
    }

    if (!fs.existsSync(this.userFilePath)) {
      fs.writeFileSync(this.userFilePath, '[]'); // começa como objeto vazio
    }
  }

  saveEvents(events: any[]) {
    const raw = fs.readFileSync(this.eventFilePath, 'utf8');

    const current = JSON.parse(raw);

    const updated = [...current, ...events];

    fs.writeFileSync(this.eventFilePath, JSON.stringify(updated, null, 2));

    return updated;
  }

  saveUser(user: any) {
    if (!fs.existsSync(this.userFilePath)) {
      fs.writeFileSync(this.userFilePath, '[]'); // inicia vazio
    }

    const raw = fs.readFileSync(this.userFilePath, 'utf8');
    const current = JSON.parse(raw); // deve ser array

    current.push(user);

    fs.writeFileSync(this.userFilePath, JSON.stringify(current, null, 2));

    return user;
  }

  getAllEvents() {
    const raw = fs.readFileSync(this.eventFilePath, 'utf8');
    return JSON.parse(raw);
  }

  getAllUsers() {
    const raw = fs.readFileSync(this.userFilePath, 'utf8');
    return JSON.parse(raw);
  }
}
