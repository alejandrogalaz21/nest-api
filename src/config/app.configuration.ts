// src/config/app.configuration.ts
import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  port: process.env.PORT || 3000,
  secret: process.env.SECRET,
  name: process.env.APP_NAME || 'unknown',
  env: process.env.NODE_ENV || 'development',
  logoUrl:
    'https://timi-simple-storage.s3.us-west-2.amazonaws.com/timi-a-640-640.png',
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID,
    token: process.env.TWILIO_AUTH_TOKEN,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  google: {
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID
  },
  url: {
    website:
      process.env.WEBSITE_URL ||
      'http://timi-webpage-2025.s3-website-us-west-2.amazonaws.com',
    signIn:
      'http://timi-webpage-2025.s3-website-us-west-2.amazonaws.com/auth/jwt/sign-in'
  },
  ddb: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_DYNAMODB_ENDPOINT
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379
  }
}))
