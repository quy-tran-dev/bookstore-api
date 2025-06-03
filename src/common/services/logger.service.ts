import { DiscordLogService } from '@app/modules/discord-notify/log-discord.service';
import { Injectable, Logger } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
@Injectable()
export class LoggerService {
  constructor(private readonly discordService: DiscordLogService) {}
  private logger = new Logger();

  async logRequest(req: ExpressRequest, duration: number) {
    const message = `Request: ${req.method} ${req.url} - ${duration}ms`;
    this.logger.verbose(message);

    await this.discordService.sendLog('INFO', 'Request', message);
  }
  async logError(req: ExpressRequest, mess: string, errString: string) {
    const message = `Error on ${req.method} ${req.url}:\n${mess}`;
    this.logger.error(message);
    await this.discordService.sendLog('ERROR', errString, message);
  }
}
