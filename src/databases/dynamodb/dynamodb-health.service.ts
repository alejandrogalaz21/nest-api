// src/databases/dynamodb/dynamodb-health.service.ts
import { Inject, Injectable } from '@nestjs/common'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb'

@Injectable()
export class DynamoDBHealthService {
  constructor(
    @Inject('DYNAMODB_CLIENT')
    private readonly dynamo: DynamoDBDocumentClient
  ) {}

  async checkConnection() {
    try {
      // Intenta leer metadata de una tabla (usa una tabla real)
      const command = new DescribeTableCommand({
        TableName: process.env.DYNAMODB_HEALTH_TABLE || 'TestTable'
      })

      await this.dynamo.send(command)

      return {
        ok: true,
        message: 'DynamoDB connection OK',
        status: 'healthy'
      }
    } catch (error) {
      return {
        ok: false,
        message: 'Failed to connect to DynamoDB',
        status: 'unhealthy',
        error: error.message
      }
    }
  }
}
