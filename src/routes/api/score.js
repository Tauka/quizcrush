import { S3 } from '@aws-sdk/client-s3';
import { streamToString } from '../utils';
import { Client }  from '@notionhq/client';

//if(process.env.NODE_ENV === 'development') {
  //const dotenv = await import('dotenv');
  //dotenv.default.config();
//}
//

export async function post({ request, platform }) {
  const notion = new Client({ auth: platform.env.NOTION_API_KEY });
  const blockId = '2c0012be-d5c8-4b92-8e20-5773160ae6e6';
  const response = await notion.blocks.retrieve({ block_id: blockId })
  const leaderboard = JSON.parse(response.paragraph.rich_text[0].plain_text);

  const { name, score }= await request.json()
  const [newLeaderboard, insertIndex] = addToLeaderboard(leaderboard, { name, score });

  const newBlock = {
    ...response,
    paragraph: {
      ...response.paragraph,
      'rich_text': [{
        ...response.paragraph['rich_text'][0],
        text: {
          ...response.paragraph['rich_text'][0].text,
          content: JSON.stringify(newLeaderboard)
        }
      }]
    }
  };

  await notion.blocks.update({
    block_id: blockId,
    paragraph: newBlock.paragraph
  })

  return {
    body: {
      leaderboard: newLeaderboard,
      insertIndex
    }
  };
}

const addToLeaderboard = (leaderboard, newScore) => {
  const newLeaderboard = [];

  let i = 0;
  let insertIndex = null;

  while(i < leaderboard.length) {
    if(leaderboard[i].score >= newScore.score) {
      newLeaderboard.push(leaderboard[i]);
    }
    else {
      insertIndex = i;
      newLeaderboard.push(newScore);
      console.log(`added at index ${i}`, newLeaderboard);
      newLeaderboard.push(leaderboard[i]);
      break;
    }

    i++;
  }

  if(newLeaderboard.length < 10 && insertIndex === null) {
    newLeaderboard.push(newScore);
    insertIndex = newLeaderboard.length - 1;
    console.log("added to end", newLeaderboard);
  }

  if(newLeaderboard.length > 10)
    newLeaderboard.pop();

  return [newLeaderboard, insertIndex];
};
