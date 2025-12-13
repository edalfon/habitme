import * as Plot from "npm:@observablehq/plot";
import { html } from "npm:htl";
import { calculateStreaks } from "./wrangling.js";
import { trackPlot, habitStreakHeatMap } from "./habitPlots.js";

export function currentStreakCard(streaks) {
  const current = streaks.current;

  return html`
    <div class="card">
      <h2>Current streak</h2>
      <br/>
      <span class="big">${current.streak_length} days</span>
      <br/><br/>
      ${current.streak_length > 0 ? html`From ${new Date(current.start_date).toDateString()}<br/>To ${new Date(current.end_date).toDateString()}` : ""}
    </div>
  `;
}

export function longestStreakCard(streaks) {
  const longest = streaks.longest;

  return html`
    <div class="card">
      <h2>Longest streaks</h2>
      <br/>
      <span class="big">${longest.streak_length} days</span>
      <br/><br/>
      From ${new Date(longest.start_date).toDateString()}
      <br/>
      To ${new Date(longest.start_date).toDateString()}
    </div>
  `;
}


export function HabitSection(data, {
  width,
  timeVar,
  valueVar,
  cutoffVar,
  mapTypeInput,
  mapTypeValues,
  resize
} = {}) {

  const streaks = calculateStreaks(data, timeVar, valueVar, cutoffVar);

  // Top Row Components
  const currentStreakHTML = currentStreakCard(streaks);
  const longestStreakHTML = longestStreakCard(streaks);

  const heatMap = resize
    ? resize((w) => habitStreakHeatMap(data, { width: w }, timeVar, valueVar, cutoffVar, mapTypeValues.includes("Streak map"), mapTypeValues.includes("Heat map")))
    : habitStreakHeatMap(data, { width: width }, timeVar, valueVar, cutoffVar, mapTypeValues.includes("Streak map"), mapTypeValues.includes("Heat map"));

  // Bottom Row Component
  const track = resize
    ? resize((w) => trackPlot(data, { width: w }, timeVar, valueVar, cutoffVar))
    : trackPlot(data, { width }, timeVar, valueVar, cutoffVar);

  return html`
  
    <div class="grid grid-cols-4">
      <div class="flex">
        ${currentStreakHTML}
        ${longestStreakHTML}
      </div>
      <div class="card grid-colspan-3">
        ${mapTypeInput}
        ${heatMap}
      </div>
    </div>
    <div class="card">
      ${track}
    </div>

  `;
}
