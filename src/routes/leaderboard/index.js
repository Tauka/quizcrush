import leaderboard from '../api/leaderboard.json';

export async function get() {
  return {
    body: { leaderboard }
  }
}
