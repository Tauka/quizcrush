import * as cheerio from 'cheerio';

export async function get({ request }) {
	// `params.id` comes from [id].js
  //const [, searchParamsString] = request.url.split('?');
  const response = await fetch('https://www.imdb.com/chart/top/?ref_=nv_mv_250', {
    headers: {
      Cookie: import.meta.env.VITE_COOKIE
    }
  });
  const page = await response.text();
  const $ = cheerio.load(page);

  const movies = $('.lister-list').children().map((i, elem) => {
    const nameTd = $(elem).children().get(1);
    const a = $(nameTd).children('a');
    const href = a.get(0).attribs.href;
    const name = a.text();

    return {
      name,
      href
    }
  }).toArray();

  return {
    body: { movies }
  };
}
