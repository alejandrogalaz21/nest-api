import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus
} from '@nestjs/common'

import { ConfigService } from '@nestjs/config'
import { WhatsAppService } from '@/modules/whatsapp/whatsapp.service'
import { WhatsAppRequestDto } from '@/modules/whatsapp/dto/whatsapp-request.dto'

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService,
    private whatsApp: WhatsAppService
  ) {}

  @Get('health')
  async healthCheck() {
    return {
      status: 'App running'
      // config: this.configService.get('pg'),
      // app: this.configService.get('app')
    }
  }

  @Post('webhook')
  async handleMessage(@Body() whatsApp: WhatsAppRequestDto) {
    try {
      console.log('/webhook WhatsApp Message Received :', whatsApp)
      const responseMessage = await this.whatsApp.handleMessage(
        whatsApp.Body,
        whatsApp.From,
        whatsApp.To
      )
      return { message: responseMessage }
    } catch (error) {
      return { message: 'No response generated' }
    }
  }
}
