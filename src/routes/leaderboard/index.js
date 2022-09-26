import { S3 } from '@aws-sdk/client-s3';
import { streamToString } from '../utils';
import { Client }  from '@notionhq/client';

//if(process.env.NODE_ENV === 'development') {
  //const dotenv = await import('dotenv');
  //dotenv.default.config();
//}

export async function get({ platform }) {
  const notion = new Client({ auth: platform.env.NOTION_API_KEY });
  const blockId = '2c0012be-d5c8-4b92-8e20-5773160ae6e6';
  const response = await notion.blocks.retrieve({ block_id: blockId })
  const leaderboard = JSON.parse(response.paragraph.rich_text[0].text.content);

  //const s3 = new S3({
    //credentials: {
      //accessKeyId: platform.env.AWS_ACCESS_KEY,
      //secretAccessKey: platform.env.AWS_ACCESS_SECRET
    //},
    //region: 'us-east-1'
  //});

  //const response = await s3.getObject({
    //Bucket: 'quizcrusher',
    //Key: 'leaderboard.json'
  //});

  //const leaderboard = JSON.parse(await streamToString(response.Body));

  return {
    body: { leaderboard }
  }
}
