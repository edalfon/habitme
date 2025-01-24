import * as Plot from "npm:@observablehq/plot";

import { fillMissingDates } from "../components/wrangling.js";

export function trackPlot(
  data,
  { width } = {},
  timevar,
  donevar,
  cutoffvar,
  title,
  xLabel,
  yLabel
) {

  data.forEach(d => d[timevar] = new Date(d[timevar]));

  return Plot.plot({
    title: title,
    width,
    height: 300,
    x: { label: xLabel || timevar },
    y: { label: yLabel || donevar },
    marks: [
      Plot.areaY(
        data,
        { x: timevar, y: cutoffvar, fillOpacity: 0.3, fill: "darkred", tip: true }
      ),
      Plot.line(
        data,
        { x: timevar, y: donevar, stroke: "skyblue", tip: true, marker: true }
      )
    ]
  });
}

export function habitStreakHeatMap(
  data,
  { width } = {},
  timevar,
  donevar,
  cutoffvar,
  streak = true,
  heat = false,
  title = "Words Read Calendar Heatmap"
) {

  const expanded = fillMissingDates(data, timevar);
  expanded.forEach(d => d[timevar] = new Date(d[timevar]));

  const theplot = Plot.plot({
    width,
    padding: 0,
    y: { type: "band" },
    x: { type: "band" },
    marks: [
      ...(heat ? [Plot.cell(expanded, Plot.group({ fill: "max" }, {
        x: (d) => d[timevar].getUTCDate(),
        y: (d) => new Date(d[timevar].getUTCFullYear(), d[timevar].getUTCMonth()),
        fill: donevar,
        inset: 0.5,
        tip: true
      }))] : []),
      ...(streak ? [Plot.text(expanded, {
        x: (d) => d[timevar].getUTCDate(),
        y: (d) => new Date(d[timevar].getUTCFullYear(), d[timevar].getUTCMonth()),
        text: (d) => (d[donevar] != null && d[cutoffvar] != null) ? (d[donevar] > d[cutoffvar] ? '✅' : '❌') : '',
        dy: 0,
        tip: false
      })] : [])
    ],
    color: {
      domain: [
        Math.min(...data.map(d => d[donevar])),
        Math.max(...data.map(d => d[donevar]))
      ],
      range: ["darkred", "green"],
      legend: false
    }
  });

  return theplot;
}






/*
function habitHeatmap(data, {width} = {}, title = "Words Read Calendar Heatmap") {
  return Plot.plot({
    width,
    padding: 0,
    //y: {tickFormat: Plot.formatMonth("en", "short")},
    y: {type: "band"},
    marks: [
      Plot.cell(fillMissingDates(aggregateDaily(data)), Plot.group({fill: "max"}, {
        x: (d) => d.timestamp.getUTCDate(),
        y: (d) => new Date(d.timestamp.getUTCFullYear(), d.timestamp.getUTCMonth()),
        fill: "done",
        inset: 0.5,
        tip: true
      }))
    ],
    color: {
      // Define the color scale here
      domain: [Math.min(...data.map(d => d.done)), Math.max(...data.map(d => d.done))], 
      range: ["darkred", "green"], 
      legend: false 
    }
  });
}
*/

