---
theme: dashboard
title: Dashboard
toc: false
---

# Rocket launches 🚀

```js
const readbooks = FileAttachment("data/readbooks.json").json();
```

<div class="card">
  ${Inputs.table(readbooks.raw)}
</div> 
<div class="card">
  ${Inputs.table(readbooks.daily)}
</div> 
<div class="card">
  
</div> 


