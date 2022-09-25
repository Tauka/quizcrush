import fetch from 'node-fetch';
import { getYear } from 'date-fns';
import * as cheerio from 'cheerio';
import fs from 'fs';

const moviesDb = JSON.parse(fs.readFileSync('movies.json', 'utf8'));
const startYear = Object.keys(moviesDb).map(Number).reduce((prev, next) => next > prev ? next : prev);
const currentYear = getYear(new Date());
const hostname = 'https://www.imdb.com';

const opts = {
  headers: {
    cookie: 'session-id=142-2531308-2856950; ubid-main=133-0246385-9953109; adblk=adblk_no; session-id-time=2274890266l; session-token="Hc31CVG8EsaZc3ryqHf/uKNSd8YX3PHl40lKHGowAKjTt/TkP7L8D+eZ11T933Dz7LBRbG0a1QoEU04U5PEK8HomYCfwRthzQd50W9uLFXi1IOkYPb/34uFfckw5+/2yWteFE52eIz47pL+T9l27lepeXl6KUQJmkbGhO/QyfMfPwtG5Ph0ZHMYJ4Fh8AkOcmg2JSHPG1IANucSQrmcMLpDW2OnqrHNAl06FLd4N8mA="; x-main="Xqf61lhPVdSTpxb8z3ffu3yD??SZu9yaJ0uYaBNxHIVxFk9u1V6ASxOSdgcU4QQX"; at-main=Atza|IwEBIEP1WsTSpRKe_sh5uFLBEv1G67cqtDvWSgPCK96iya4ocoUf1GOC47KtuAByOQryjgEwfJNbO3M5VYbrvd4diadE6ajHhfV01yT6OzKMMp8itJpaQcIjI-ubVVP8QQjIZdeXOPqwkTwiSlgYGUFZfeQhJt5q-wmOYtcH_WmOxRSqQZ271p1qW5G5sXgtAwAnB_sHNIFL2Od99MoH6LckQ8saPK3DrZXCvWlI-GPqfU5i73aKQWnl8RuQYzIICZp8gAY; sess-at-main="iMuMK1/m513xJ4xqkQv7ZXlXydagr8UQG7Gi557zuDw="; uu=eyJpZCI6InV1ZWY1ODNiZWUwNGQ5NDYyNjhkODQiLCJwcmVmZXJlbmNlcyI6eyJmaW5kX2luY2x1ZGVfYWR1bHQiOmZhbHNlfSwidWMiOiJ1cjE0NjQ3NzQzMyJ9; lc-main=en_US; csm-hit=tb:2S617S53MV03ZCMW7WQ4+s-17R6JZB3D1M3XGY8R32Z|1644170439220&t:1644170439220&adb:adblk_no'
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
//fetchMovies(2022).then(ms => console.log(ms));
//fetchStarsImgs({
  //name: 'Ticket to Paradise',
  //starsLinks: [
    //'/name/nm0000123/?ref_=adv_li_st_0',
    //'/name/nm1116918/?ref_=adv_li_st_1',
    //'/name/nm0000210/?ref_=adv_li_st_2',
    //'/name/nm4687524/?ref_=adv_li_st_3'
  //]
//}).then(console.log);
 fetchAll().then(() => console.log("done"));
//(async () => {
  //const r = await fetch('https://www.imdb.com/name/nm0240797/?ref_=adv_li_st_2');
  //const page = await r.text();
  //console.log("page", page);
//})();
