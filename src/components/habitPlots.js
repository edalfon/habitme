import * as Plot from "npm:@observablehq/plot";
import * as d3 from 'd3';

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

  // Create a container to hold both plots
  const container = document.createElement('div');

  // Create a div for the main plot (so we can replace it)
  const mainPlotDiv = document.createElement('div');

  // Get date extent
  const extent = d3.extent(data, d => d[timevar]);

  // Function to render the main plot with a given domain
  function renderMainPlot(domain) {
    // Filter data to only include points within the domain
    const filteredData = data.filter(d =>
      d[timevar] >= domain[0] && d[timevar] <= domain[1]
    );

    const plot = Plot.plot({
      title: title,
      width,
      height: 300,
      x: {
        label: xLabel || timevar,
        domain: domain  // Also set domain for proper axis scaling
      },
      y: { label: yLabel || donevar },
      marks: [
        Plot.areaY(
          filteredData,  // Use filtered data
          { x: timevar, y: cutoffvar, fillOpacity: 0.3, fill: "darkred", tip: true }
        ),
        Plot.line(
          filteredData,  // Use filtered data
          { x: timevar, y: donevar, stroke: "skyblue", tip: true, marker: true }
        )
      ]
    });

    mainPlotDiv.innerHTML = '';
    mainPlotDiv.appendChild(plot);
  }

  // Initial render with full extent
  renderMainPlot(extent);

  // Context plot (small overview)
  const contextPlot = Plot.plot({
    width,
    height: 20,
    x: { label: null, axis: null },  // Remove tick labels
    y: { label: null, axis: null },
    marks: [
      Plot.areaY(data, {
        x: timevar,
        y: cutoffvar,
        fillOpacity: 0.3,
        fill: "darkred"
      }),
      Plot.line(data, {
        x: timevar,
        y: donevar,
        stroke: "skyblue",
        strokeWidth: 1
      })
    ]
  });

  // Add brush to context plot
  const svg = d3.select(contextPlot);
  const svgWidth = parseFloat(svg.attr('width'));
  const svgHeight = parseFloat(svg.attr('height'));

  // Use standard Plot margins (Plot typically uses ~40-60px left, ~20px right)
  const marginLeft = 50;
  const marginRight = 20;

  const xMin = marginLeft;
  const xMax = svgWidth - marginRight;

  console.log('Using X range:', xMin, 'to', xMax, 'out of', svgWidth);

  // Create x scale using these margins
  const xScale = d3.scaleTime()
    .domain(extent)
    .range([xMin, xMax]);

  const brush = d3.brushX()
    .extent([[xMin, 0], [xMax, svgHeight]])
    .on('brush end', brushed);

  svg.append('g')
    .attr('class', 'brush')
    .call(brush);
  //.call(brush.move, [xMin, xMax]);  // Initialize to full extent

  // Brush event handler
  function brushed(event) {
    if (!event.selection) return;

    const [x0, x1] = event.selection;
    const domain = [xScale.invert(x0), xScale.invert(x1)];

    renderMainPlot(domain);
  }

  container.appendChild(mainPlotDiv);
  container.appendChild(contextPlot);

  return container;
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

