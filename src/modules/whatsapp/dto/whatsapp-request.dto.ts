import { IsNotEmpty } from 'class-validator'

export class WhatsAppRequestDto {
  @IsNotEmpty()
  From: string

  @IsNotEmpty()
  To: string

  @IsNotEmpty()
  Body: string
}
