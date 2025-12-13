---
theme: dashboard
title: Words read from selected books
toc: false
---

# Words read from selected books 🚀

```js
import { HabitSection } from "./components/habitsUI.js";
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

<div class="grid grid-cols-1">
  ${resize((width) => HabitSection(readbooks.daily, {
  width, 
  timeVar: "fetched_at", 
  valueVar: "words_read", 
  cutoffVar: "cutoff",
  mapTypeInput: maptypeInput,
  mapTypeValues: maptype,
  resize
}))}
</div>

<div class="grid grid-cols-1">
  <div class="card">
    raw
    ${Inputs.table(readbooks.raw)}
  </div> 
  <div class="card">
    daily
    ${Inputs.table(readbooks.daily)}
  </div> 
</div>

