import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function main() {
  process.env.APP_STARTED_AT = String(Date.now())
  const app = await NestFactory.create(AppModule)
  const prefix = 'api/v1'
  app.setGlobalPrefix(prefix)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )
  app.enableCors({
    origin: '*',
    credentials: false
  })
  const port = process.env.PORT || 8080
  const appName = process.env.APP_NAME || 'Project Nest API'
  await app.listen(port)

  console.log(`Nest API : ${appName}`)
  console.log(`App started at: ${process.env.APP_STARTED_AT}`)
  console.log(`api it's runnung on: http://localhost:${port}/${prefix}`)
}
main()
