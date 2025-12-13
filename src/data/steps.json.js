
import { DuckDBInstance } from "@duckdb/node-api";
import { aggregateDaily } from "../components/wrangling.js";

// Initialize DuckDB with MotherDuck connection
// This requires the MOTHERDUCK_TOKEN environment variable to be set
// Using @duckdb/node-api
async function query(sql) {
    try {
        const instance = await DuckDBInstance.create("md:");
        const connection = await instance.connect();
        const reader = await connection.run(sql);
        const rows = await reader.getRows();
        return rows;
    } catch (err) {
        throw err;
    }
}

async function main() {
    try {
        // defined your query here
        // We expect columns: fetched_at (timestamp), value (e.g. count, duration), cutoff (optional)
        const sql = `
            SELECT 
              SUM(count) AS value, 
              strftime(DATE_TRUNC('day', epoch_ms(start_time)), '%Y-%m-%d') AS date,
              10000 as cutoff
            FROM healthconnectsync.steps_record_table
            GROUP BY DATE_TRUNC('day', epoch_ms(start_time))
            ORDER BY date
            ;
        `;

        const rawData = await query(sql);

        // If no data, output empty structure to avoid build errors
        if (rawData.length === 0) {
            process.stdout.write(JSON.stringify({
                raw: []
            }));
            return;
        }

        // Map array results to objects and handle types
        const processedData = rawData.map(row => ({
            value: typeof row[0] === 'bigint' ? Number(row[0]) : row[0],
            date: row[1], // SQL strftime returns string
            cutoff: typeof row[2] === 'bigint' ? Number(row[2]) : row[2]
        }));

        const output = {
            raw: processedData,
            daily: processedData
        };

        process.stdout.write(JSON.stringify(output));

    } catch (error) {
        console.error("Error fetching data from MotherDuck:", error);
        process.exit(1);
    }
}

main();
