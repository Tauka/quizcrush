import fs from 'fs';

const moviesDb = JSON.parse(fs.readFileSync('movies.json', 'utf8'));
console.log("movies db", moviesDb);
Object.entries(moviesDb).forEach(([year, movies]) => {
  // console.log("year", year);
  fs.writeFileSync(`movies/${year}.json`, JSON.stringify(movies));
});
