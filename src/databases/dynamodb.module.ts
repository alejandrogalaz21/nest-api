import { Module } from '@nestjs/common';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Module({
  providers: [
    {
      provide: 'DYNAMODB_CLIENT',
      useFactory: () => {
        const client = new DynamoDBClient({
          region: 'us-west-2',
          endpoint: 'http://localhost:8000', // dynamodb-local
        });

        return DynamoDBDocumentClient.from(client, {
          marshallOptions: { removeUndefinedValues: true },
        });
      },
    },
  ],
  exports: ['DYNAMODB_CLIENT']
})
export class DynamoDbModule {}
