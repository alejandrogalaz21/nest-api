// src/app.controller.ts
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
import { DynamoDBHealthService } from '@/databases/dynamodb/dynamodb-health.service'
import { PgHealthService } from './databases/postgres/pg-health.service'
import { performance } from 'perf_hooks' // used to measure event loop delay in milliseconds
import * as os from 'os'

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService,
    private whatsApp: WhatsAppService,
    private dynamoHealth: DynamoDBHealthService,
    private pgHealth: PgHealthService
  ) {}

  @Get('/')
  root() {
    return {
      message: '¡Timi API está corriendo!',
      hint: 'Visita /api/v1 para la API REST.',
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  }

  @Get('health')
  async healthCheck() {
    // Calculate uptime
    const startedAt = Number(process.env.APP_STARTED_AT || Date.now())
    const now = Date.now()
    const uptimeMs = now - startedAt

    // Application info
    const app = {
      ok: true,
      name: this.configService.get('app.name'),
      version: this.configService.get('app.version'),
      env: this.configService.get('app.environment'),
      status: 'healthy',
      startTime: new Date(startedAt).toISOString(),
      uptimeMs,
      node: process.version
    }

    // RAM metrics (all values are in bytes)
    const mem = process.memoryUsage()
    // CPU usage since process start (values in microseconds)
    const cpuUsage = process.cpuUsage() // { user: µs, system: µs }
    // Load average over 1, 5, 15 minutes (unit: “load” per core; on Windows this is [0,0,0])
    const loadAvg = os.loadavg()
    // Number of CPU cores
    const cpuCount = os.cpus()?.length ?? 0

    // Event loop delay (measures how busy/blocking the event loop is; unit: milliseconds)
    const start = performance.now()
    await new Promise(r => setImmediate(r))
    const eventLoopDelayMs = performance.now() - start

    const resources = {
      memory: {
        // Resident Set Size: total memory allocated for the process (bytes)
        rss: mem.rss,
        // Heap used: actual JS heap used (bytes)
        heapUsed: mem.heapUsed,
        // Heap total: allocated JS heap (bytes)
        heapTotal: mem.heapTotal
      },
      cpu: {
        // Number of logical CPU cores
        cpuCount,
        // Load average over 1m, 5m, 15m (per core). Windows returns zeros.
        loadAvg, // number[]
        // CPU time spent by the process since start (microseconds)
        usageMicros: cpuUsage, // { user: number, system: number }
        // Event loop delay (ms) — higher values indicate blocking or heavy sync work
        eventLoopDelayMs
      }
    }
    // Check DynamoDB connection
    const t1 = Date.now()
    const ddbHealth = await this.dynamoHealth.checkConnection()
    const ddbLatencyMs = Date.now() - t1
    // Check Postgres connection
    const t2 = Date.now()
    const pgHealth = await this.pgHealth.check()
    const pgLatencyMs = Date.now() - t2
    const pgStats = await this.pgHealth.stats()

    return {
      app,
      resources,
      dynamodb: { ddbHealth, latencyMs: ddbLatencyMs },
      postgres: { pgHealth, latencyMs: pgLatencyMs, stats: pgStats }
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
