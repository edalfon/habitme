---
theme: dashboard
title: Habits
toc: false
---

# Rocket launches 🚀

```js
import { trackPlot, habitStreakHeatMap } from "./components/habitPlots.js";
import { 
  aggregateDaily, fillMissingDates, calculateStreaks 
} from "./components/wrangling.js";
```
```js
const readbooks = FileAttachment("data/readbooks.json").json();
```

```js
const maptypeInput = Inputs.checkbox(["Streak map", "Heat map"], {
    sort: false,
    unique: true,
    value: ["Streak map"],
    label: ""
  })
;
const maptype = Generators.input(maptypeInput);
```

```js
const streaks = calculateStreaks(readbooks.daily, "updated_at", "words_read", "cutoff")
```

<div class="grid grid-cols-2">
  <div class="grid grid-rows-2">
    <div class="card">
      <h2>Latest streak</h2>
      <br/>
      <span class="big">${streaks["latest"].streak_length} days</span>
      <br/><br/>
      From ${new Date(streaks["latest"].start_date).toDateString()}
      <br/>
      To ${new Date(streaks["latest"].start_date).toDateString()}
    </div>
    <div class="card">
      <h2>Longest streaks</h2>
      <br/>
      <span class="big">${streaks["longest"].streak_length} days</span>
      <br/><br/>
      From ${new Date(streaks["longest"].start_date).toDateString()}
      <br/>
      To ${new Date(streaks["longest"].start_date).toDateString()}
    </div>
  </div>
  <div class="card">
    ${maptypeInput}
    ${resize((width) => habitStreakHeatMap(readbooks.daily, {width}, "updated_at", "words_read", "cutoff", maptype.includes("Streak map"), maptype.includes("Heat map")))}
  </div> 
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => trackPlot(readbooks.daily, {width}, "updated_at", "words_read", "cutoff"))}
  </div>
</div>


```js
maptype
const isHeatmap = maptype.includes("Heatmap");
```

${Inputs.table(readbooks.daily)}

```js
const wow = fillMissingDates(readbooks.daily, "updated_at", 365)
```

raw
${Inputs.table(readbooks.daily)}
wow
${Inputs.table(wow)}
