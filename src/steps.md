---
theme: dashboard
title: Steps per day
toc: false
---

# Steps per day

```js
import { HabitSection } from "./components/habitsUI.js";
import { createMapTypeInput } from "./components/habitsUI.js";
```
```js
const steps = FileAttachment("data/steps.json").json();
```

```js
const mapTypeInput = createMapTypeInput();
const mapType = Generators.input(mapTypeInput); // Need to keep generator at .md level
```

<div class="grid grid-cols-1">
${resize((width) => HabitSection(steps.daily, {
  width,
  timeVar: "date",
  valueVar: "value",
  cutoffVar: "cutoff",
  mapTypeInput: mapTypeInput,
  mapTypeValues: mapType,
  resize
}))}
</div>

<div class="grid grid-cols-1">
  <div class="card">
    raw
    ${Inputs.table(steps.raw)}
  </div> 
</div>

