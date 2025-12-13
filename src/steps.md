---
theme: dashboard
title: Steps per day
toc: false
---

# Steps per day

```js
import { HabitSection } from "./components/habitsUI.js";
```
```js
const steps = FileAttachment("data/steps.json").json();
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

${resize((width) => HabitSection(steps.daily, {
  width,
  timeVar: "date",
  valueVar: "value",
  cutoffVar: "cutoff",
  mapTypeInput: null, // Reusing global input might be tricky if we want independent controls, but for now let's just show the plot
  mapTypeValues: maptype
}))}

<div class="grid grid-cols-1">
  <div class="card">
    raw
    ${Inputs.table(steps.raw)}
  </div> 
</div>

