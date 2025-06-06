import { fetchSingleDoc } from "../components/readwise.js";
import { aggregateDaily } from "../components/wrangling.js";
import { fillMissingDates } from "../components/wrangling.js";

import { readFileSync, appendFileSync } from "node:fs";
import { csvParse, csvFormat } from 'd3-dsv';
import { groups, sort } from 'd3-array';

// get the data for the single document, and append a line to the static data
// so that the data accummulates incrementally
const static_file = "src/data/readbooks_static.csv";
async function update_book_progress(bookid, static_file) {
  const allData = await fetchSingleDoc(bookid);

  const newline = allData.map(doc => [
    new Date().toISOString(), // log when the data wwere fetched
    doc.id,
    //doc.title,
    //doc.author,
    doc.last_opened_at,
    doc.updated_at,
    doc.word_count,
    doc.reading_progress,
    '500' // hard-code here the cutoff
  ].join(',')) + "\n";

  appendFileSync(static_file, newline, "utf-8");
  return static_file;
}

const books_to_track = [
  // "01jfadtvr15x8ndaxv69zq48e8", // Atomic Habits
  // "01jfadv2p9jc66xtcwg8ksb89k", // Nexus
  "01jqnk6pvx936a3c8m7yvd3spg", // I am Pilgrim
  "01jfadtxgqzj6cxgqjvxfwdtth", // Hmo Deus
]
for (const bookid of books_to_track) {
  await update_book_progress(bookid, static_file);
}

// Now process the static file with the whole data
const csvLines = readFileSync(static_file, "utf-8").split('\n');
const uniqueLines = Array.from(new Set(csvLines)).join('\n');
const parsedData = csvParse(uniqueLines);

const processedData = groups(parsedData, d => d.id)
  .flatMap(([id, group]) => {
    // Sort group by time
    const sortedGroup = sort(group, d => d.fetched_at);

    return sortedGroup.map((item, index, arr) => {
      const words_progress = item.reading_progress * item.word_count;
      const words_read = index > 0 ? words_progress - (arr[index - 1].word_count * arr[index - 1].reading_progress) : 0;
      const seconds = words_read > 0 ? (new Date(item.updated_at) - new Date(item.last_opened_at)) / 1000 : undefined;

      return {
        ...item,
        words_progress: item.reading_progress * item.word_count,
        words_read,
        seconds,
        words_per_second: words_read / seconds
      };
    });
  });

const daily = aggregateDaily(processedData, 'fetched_at', [
  ['cutoff', 'max'],
  ['words_read', 'sum'],
  ['seconds', 'sum'],
]);

daily.forEach(d => {
  d.words_per_second = d.words_read / d.seconds;
});

//const expanded = fillMissingDates(daily, "fetched_at", 1);

const outputJson = JSON.stringify({
  'raw': processedData,
  //'expanded': expanded,
  'daily': daily
});

process.stdout.write(outputJson);
