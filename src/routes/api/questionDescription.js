import * as cheerio from 'cheerio';

export async function post({ request }) {
	// `params.id` comes from [id].js
  const { link }= await request.json();

  const response = await fetch(`https://www.imdb.com${link}`);
  const page = await response.text();
  const $ = cheerio.load(page);

  const premise = $('span[data-testid="plot-xs_to_m"]').text();

  return {
    body: { premise }
  };
}
