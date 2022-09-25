import fetch from 'node-fetch';
import { getYear } from 'date-fns';
import * as cheerio from 'cheerio';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
console.log("cookie", process.env.VITE_COOKIE);

const moviesDb = JSON.parse(fs.readFileSync('movies.json', 'utf8'));
const startYear = Object.keys(moviesDb).map(Number).reduce((prev, next) => next > prev ? next : prev);
const currentYear = getYear(new Date());
const hostname = 'https://www.imdb.com';

const opts = {
  headers: {
    cookie: process.env.VITE_COOKIE
  }
};


const imdbYearsLink = (year) => {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  return `https://www.imdb.com/search/title/?title_type=feature&year=${startDate},${endDate}`
};

//for (let i = startYear; i <= currentYear; i++) {
  //const link = imdbYearsLink(i);
  //const response = await fetch(link);
  //await response.text();
//};

const fetchMovies = async (year) => {
  const link = imdbYearsLink(year);
  const response = await fetch(link, opts);
  const page = await response.text();
  const $ = cheerio.load(page);
  const movies = [];

  $('.lister-list').children().each(function(i) {
    const content = $(this).find('.lister-item-content');
    const anchor = content.find('.lister-item-header a');
    const rating = content.find('.ratings-bar');

    if(rating.length > 0) {
      const strongRating = rating.find('strong').text();

      if(Number(strongRating) < 6)
        return;
    }

    const directorsStars = content.children()[3].attribs.class === 'text-muted'
      ? content.children()[4].children
      : content.children()[3].children;

    const starsIndex = directorsStars.findIndex(n => {
      return n.type === 'text' && n.data.includes('Stars');
    });

    const starsLinks = directorsStars
      .slice(starsIndex + 1)
      .filter(n => n.type === 'tag' && n.name === 'a')
      .map(n => n.attribs.href);

    movies.push({
      name: anchor.text(),
      starsLinks
    });
  });

  if(!moviesDb[year])
    return movies;

  const fetched = moviesDb[year];
  return movies.filter(m => !fetched.some(f => f.name === m.name));
};

const fetchStarsImgs = async (movie) => {
  const imgs = [];

  for (let i = 0; i < movie.starsLinks.length; i++) {
    const link = movie.starsLinks[i];
    const response = await fetch(`${hostname}${link}`);
    const page = await response.text();
    const $ = cheerio.load(page);

    const poster = $('#name-poster');
    if(poster.length > 0) {
      imgs.push(poster[0].attribs.src);
      console.log(`star ${i}`);
    }
  }

  return imgs;
};

async function* fetchMoviesByYear(year) {
  const movies = await fetchMovies(year);
  console.log(`fetched movies for ${year}`);

  for (let i = 0; i < movies.length; i++) {
    const imgs = await fetchStarsImgs(movies[i]);

    yield {
      name: movies[i].name,
      imgs
    };
  }
};

const fetchAll = async () => {
  for (let i = startYear; i <= currentYear; i++) {
    const movies = moviesDb[i] ?? [];

    for await (const movie of fetchMoviesByYear(i)) {
      movies.push(movie);
      moviesDb[i] = movies;
      fs.writeFileSync('movies.json', JSON.stringify(moviesDb));
      console.log(`success ${movie.name}`);
    }
  }
};

fetchAll().then(() => console.log("done"));
