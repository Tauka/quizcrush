import dotenv from 'dotenv';
import { S3 } from '@aws-sdk/client-s3';
import { streamToString } from '../utils';

dotenv.config();

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
  },
  region: 'us-east-1'
});

export async function post({ request }) {
  const response = await s3.getObject({
    Bucket: 'quizcrusher',
    Key: 'leaderboard.json'
  });
  const leaderboard = JSON.parse(await streamToString(response.Body));

  const { name, score }= await request.json()
  const [newLeaderboard, insertIndex] = addToLeaderboard(leaderboard, { name, score });

  try {
    await s3.putObject({
      Bucket: 'quizcrusher',
      Key: 'leaderboard.json',
      Body: JSON.stringify(newLeaderboard)
    })
  }
  catch(e) {
    console.log("Error", e);
  }

  return {
    body: {
      leaderboard: [],
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
