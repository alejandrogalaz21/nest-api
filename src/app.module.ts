// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
// Config's
import { PgConfig, AppConfig } from '@/config'
// modules
import { PgModule } from '@/databases/postgres/pg.module'
import { DynamoDbModule } from '@/databases/dynamodb/dynamodb.module'
import { CommonModule } from '@/common/common.module'
import { UsersModule } from '@/modules/users/users.module'
import { WhatsAppModule } from '@/modules/whatsapp/whatsapp.module'
import { AuthModule } from '@/auth/auth.module'
import { LoggerMiddleware } from '@/common/middleware/logger.middleware'
import { OrdersModule } from '@/orders/orders.module'

// controllers
import { AppController } from '@/app.controller'
import { AuthController } from '@/auth/auth.controller'
import { UsersController } from '@/modules/users/users.controller'
import { OrdersController } from '@/orders/orders.controller'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig, PgConfig] }),
    PgModule,
    DynamoDbModule,
    UsersModule,
    OrdersModule,
    WhatsAppModule,
    AuthModule,
    CommonModule
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    OrdersController
  ],
  providers: [],
  exports: []
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // Apply LoggerMiddleware to all routes
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
