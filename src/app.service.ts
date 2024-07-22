import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Chat, Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService){}

  async createMessage(data: any): Promise<Chat> {
    return await this.prisma.chat.create({
      data: {
        username: data.username,
        text: data.text,
        createdAt: data.createdAt
      }
    });
  }

  async getMessages() {
    return await this.prisma.chat.findMany();
  }
}
