import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function main() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/v1')
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
  const appName = process.env.APP_NAME || 'Timi API'
  await app.listen(port)

  // Poomeranio kawaii saludando
  console.log(
    `\n` +
      '  ／＞　 フ\n' +
      ' |       |\n' +
      '／　　ミ  ＿＿\n' +
      '|　　(●) (●)\n' +
      '|　　　　● |\n' +
      '\\　　　　ノ\n' +
      '　＼＿＿＿／\n' +
      '     U   U\n' +
      'Hola, soy Timi! 🐶\n'
  )
  console.log(`El servidor está corriendo en el puerto: ${port}`)

  console.log(`Nombre de la app: ${appName}`)
}
main()
