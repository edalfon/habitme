import * as Plot from "npm:@observablehq/plot";
import { calculateStreaks } from "./wrangling.js";
import { trackPlot, habitStreakHeatMap } from "./habitPlots.js";

export function StreakMetrics(streaks) {
  const current = streaks.current;
  const longest = streaks.longest;

  return `
  <div class="grid grid-cols-2">
    <div class="card">
      <h2>Current streak</h2>
      <br/>
      <span class="big">${current.streak_length} days</span>
      <br/><br/>
      ${current.streak_length > 0 ? `From ${new Date(current.start_date).toDateString()}` : ""}
      <br/>
      ${current.streak_length > 0 ? `To ${new Date(current.end_date).toDateString()}` : ""}
    </div>
    <div class="card">
      <h2>Longest streaks</h2>
      <br/>
      <span class="big">${longest.streak_length} days</span>
      <br/><br/>
      From ${new Date(longest.start_date).toDateString()}
      <br/>
      To ${new Date(longest.start_date).toDateString()}
    </div>
  </div>
  `;
}

export function HabitSection(data, {
  width,
  timeVar,
  valueVar,
  cutoffVar,
  mapTypeInput,
  mapTypeValues
} = {}) {

  const streaks = calculateStreaks(data, timeVar, valueVar, cutoffVar);
  const metricsHTML = StreakMetrics(streaks);

  // We need to render the plots into a container or return them as HTML/DOM
  const heatMap = habitStreakHeatMap(data, { width: width / 2 }, timeVar, valueVar, cutoffVar, mapTypeValues.includes("Streak map"), mapTypeValues.includes("Heat map"));
  const track = trackPlot(data, { width }, timeVar, valueVar, cutoffVar);

  // Construct the grid layout
  const container = document.createElement("div");
  container.className = "grid grid-cols-1";

  // Top Row: Metrics (Left 2/2) + Heatmap (Right)
  // Actually in the original it was: 
  // Left Col: Metrics (2 stacked cards)
  // Right Col: MapTypeInput + Heatmap
  // But StreakMetrics returns a grid-cols-2 itself? 
  // Wait, the original was:
  // <div class="grid grid-cols-2">
  //   <div class="grid grid-rows-2"> [Metrics Cards] </div>
  //   <div class="card"> [Map Input + Heatmap] </div>
  // </div>

  // Let's adjust StreakMetrics to match the original "Left Column" structure if we want exact parity,
  // OR just use a cleaner 3-card layout.
  // The user asked for "steps 1 and 2, and also step 3", implying I should use the components I make.

  // Let's make `StreakMetrics` return the *inner content* of that left column (the two stacked cards).

  const topGrid = document.createElement("div");
  topGrid.className = "grid grid-cols-2";

  // Left Side: Metrics
  const metricsDiv = document.createElement("div");
  metricsDiv.className = "grid grid-rows-2";
  metricsDiv.innerHTML = `
    <div class="card">
      <h2>Current streak</h2>
      <br/>
      <span class="big">${streaks.current.streak_length} days</span>
      <br/><br/>
      ${streaks.current.streak_length > 0 ? `From ${new Date(streaks.current.start_date).toDateString()}` : ""}
      <br/>
      ${streaks.current.streak_length > 0 ? `To ${new Date(streaks.current.end_date).toDateString()}` : ""}
    </div>
    <div class="card">
      <h2>Longest streaks</h2>
      <br/>
      <span class="big">${streaks.longest.streak_length} days</span>
      <br/><br/>
      From ${new Date(streaks.longest.start_date).toDateString()}
      <br/>
      To ${new Date(streaks.longest.end_date).toDateString()}
    </div>
    `;

  // Right Side: Map
  const mapDiv = document.createElement("div");
  mapDiv.className = "card";
  if (mapTypeInput) mapDiv.appendChild(mapTypeInput);
  mapDiv.appendChild(heatMap);

  topGrid.appendChild(metricsDiv);
  topGrid.appendChild(mapDiv);

  // Bottom Row: Track Plot
  const bottomGrid = document.createElement("div");
  bottomGrid.className = "grid grid-cols-1";
  const trackDiv = document.createElement("div");
  trackDiv.className = "card";
  trackDiv.appendChild(track);
  bottomGrid.appendChild(trackDiv);

  container.appendChild(topGrid);
  container.appendChild(bottomGrid);

  return container;
}
