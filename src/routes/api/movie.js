import * as cheerio from 'cheerio';
import movies from './movies.json';

const sleep = time => new Promise(res => setTimeout(res, time));
const movieKeys = Object.entries(movies).flatMap(([key, movies]) => movies.map((_, i) => [Number(key), i]))

export async function get({ request, url }) {
	// `params.id` comes from [id].js
  const startYear = Number(url.searchParams.get('startYear'))
  const endYear = Number(url.searchParams.get('endYear'));
  const inRangeMovieKeys = movieKeys.filter(m => m[0] >= startYear && m[0] <= endYear);

  const movieKey = inRangeMovieKeys[randomIntFromInterval(0, inRangeMovieKeys.length - 1)];
  await sleep(500);

  return {
    body: movies[movieKey[0]][movieKey[1]]
  };
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
