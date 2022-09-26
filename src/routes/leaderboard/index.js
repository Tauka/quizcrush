import { S3 } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { streamToString } from '../utils';

dotenv.config();

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
  },
  region: 'us-east-1'
});

export async function get() {
  const response = await s3.getObject({
    Bucket: 'quizcrusher',
    Key: 'leaderboard.json'
  });

  const leaderboard = JSON.parse(await streamToString(response.Body));

  return {
    body: { leaderboard }
  }
}
