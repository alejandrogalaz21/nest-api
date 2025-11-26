import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('pg.host'),
        port: configService.get('pg.port'),
        username: configService.get('pg.user'),
        password: configService.get('pg.password'),
        database: configService.get('pg.database'),
        autoLoadEntities: true,
        //synchronize: configService.get('pg.synchronize'),
        synchronize: true, // Set to true for development, false for production
        ssl: configService.get('pg.ssl')
      }),
      inject: [ConfigService]
    })
  ]
})
export class PgModule {
  constructor(private configService: ConfigService) {}
}
