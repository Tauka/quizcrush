import * as cheerio from 'cheerio';
import movies from './movies.json';

const sleep = time => new Promise(res => setTimeout(res, time));

export async function get({ request, url }) {
	// `params.id` comes from [id].js
  const startYear = Number(url.searchParams.get('startYear'))
  const endYear = Number(url.searchParams.get('endYear'));
  const year = randomIntFromInterval(startYear, endYear);

  const yearMovies = movies[year];
  yearMovies[randomIntFromInterval(0, yearMovies.length - 1)]
  await sleep(500);

  return {
    body: yearMovies[randomIntFromInterval(0, yearMovies.length - 1)]
  };
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
