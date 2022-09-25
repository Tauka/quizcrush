import leaderboard from './leaderboard.json';
import fs from 'fs';

export async function post({ request }) {
  console.log("score endpoint");
	// `params.id` comes from [id].js
  const { name, score }= await request.json()
  const [newLeaderboard, insertIndex] = addToLeaderboard(leaderboard, { name, score });
  fs.writeFileSync('src/routes/api/leaderboard.json', JSON.stringify(newLeaderboard));

  return {
    body: {
      leaderboard,
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
