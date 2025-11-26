import { Controller, Get } from '@nestjs/common'

@Controller('/')
export class RootController {
  @Get()
  root() {
    return {
      message: '¡Timi API está corriendo!',
      hint: 'Visita /api/v1 para la API REST.',
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  }
}
