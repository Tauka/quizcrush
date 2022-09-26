import { S3 } from '@aws-sdk/client-s3';
import { streamToString } from '../utils';

//if(process.env.NODE_ENV === 'development') {
  //const dotenv = await import('dotenv');
  //dotenv.default.config();
//}

export async function get() {
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_ACCESS_SECRET
    },
    region: 'us-east-1'
  });

  const response = await s3.getObject({
    Bucket: 'quizcrusher',
    Key: 'leaderboard.json'
  });

  const leaderboard = JSON.parse(await streamToString(response.Body));

  return {
    body: { leaderboard }
  }
}
