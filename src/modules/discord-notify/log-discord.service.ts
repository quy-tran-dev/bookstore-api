import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DateFormatUtil } from 'src/common/utils/date-format.util';

@Injectable()
export class DiscordLogService {
  private webhookUrl: string;
  constructor(configService: ConfigService) {
    this.webhookUrl = configService.get('DISCORD_WEBHOOK_URL') as string;
  }

  async sendLog(
    level: 'INFO' | 'WARN' | 'ERROR',
    message: string,
    context?: string,
  ) {
    // Cắt ngắn message và context nếu quá dài
    const maxDescriptionLength = 2048;
    const maxTitleLength = 256;

    const safeMessage = message.substring(0, maxDescriptionLength);
    const safeContext = context ? context.substring(0, maxTitleLength - level.length - 3) : ''; // -3 cho ' - '

    const timestamp = DateFormatUtil.formatDate(new Date());

    const embed = {
      title: `${level} ${safeContext ? `- ${safeContext}` : ''}`,
      description: safeMessage,
      color: this.getColor(level),
      footer: {
        text: timestamp,
      },
    };

    try {
      // Thêm console.log để kiểm tra payload trước khi gửi
      console.log('Sending Discord embed:', JSON.stringify({ embeds: [embed] }, null, 2));
      await axios.post(this.webhookUrl, {
        embeds: [embed],
      });
      console.log('Discord log sent successfully.');
    } catch (error) {
      console.error('Failed to send Discord log:', error.message);
      if (axios.isAxiosError(error) && error.response) {
        // Log phản hồi từ Discord để debug chi tiết hơn
        console.error('Discord API response error:', error.response.data);
      }
    }
  }

  private getColor(level: string): number {
    switch (level) {
      case 'INFO':
        return 3447003; // blue
      case 'WARN':
        return 16776960; // yellow
      case 'ERROR':
        return 16711680; // red
      default:
        return 8421504; // gray
    }
  }
}
// how to use
// constructor(private readonly discordLogService: DiscordLogService) {}

// await this.discordLogService.sendLog('ERROR', 'Không thể kết nối DB', 'UserService');
// await this.discordLogService.sendLog('INFO', 'Sách mới được tạo', 'BookController');