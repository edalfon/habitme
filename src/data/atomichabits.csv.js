import { fetchSingleDoc } from "../components/readwise.js";
import { readFileSync, appendFileSync } from "node:fs";

const allData = await fetchSingleDoc('01jfadtvr15x8ndaxv69zq48e8');

const static_file = "src/data/atomichabits_static.csv"

const newline = allData.map(doc => [
  doc.last_opened_at,
  doc.updated_at,
  doc.word_count,
  doc.reading_progress
].join(',')) + "\n"

appendFileSync(static_file, newline, "utf-8");

const c = readFileSync(static_file, "utf-8");

process.stdout.write(c);
