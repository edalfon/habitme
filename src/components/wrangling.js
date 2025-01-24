// import * as d3 from "npm:d3";

import {
  groups,
  rollup,
  ascending,
  sum,
  mean,
  max,
  min,
  count
} from 'd3-array';

import {
  timeDay,
  timeDays
} from 'd3-time';

export function aggregateDaily(data, timeVar, aggPairs) {

  const aggregationMap = {
    'sum': sum, 'avg': mean, 'max': max, 'min': min, 'count': count
  };

  // Group and aggregate data
  const aggregatedData = Array.from(
    rollup(
      data,
      group => {
        const result = { [timeVar]: new Date(group[0][timeVar]).toISOString().split('T')[0] };

        aggPairs.forEach(([variable, aggFunc]) => {

          const aggFunction = typeof aggFunc === 'string' ? aggregationMap[aggFunc] : aggFunc;

          result[`${variable}`] = aggFunction(
            group.map(item => item[variable])
          );
        });

        return result;
      },
      item => new Date(item[timeVar]).toISOString().split('T')[0]
    ).values()
  );

  return aggregatedData;
}

export function fillMissingDates(data, timevar = 'timestamp', daysBack = 365) {
  // Find the latest date in the data
  const latestDate = max(data, d => d[timevar]);

  // Generate all dates for the year preceding the latest date
  const startDate = timeDay.offset(latestDate, -daysBack);
  const allDates = timeDays(startDate, latestDate);

  // Create a map of existing dates
  const dateMap = new Map(data.map(d => [timeDay(d[timevar]).getTime(), d]));

  // Fill missing dates with default values
  const filledData = allDates.map(date => {
    const ts = date.getTime();
    return dateMap.has(ts) ? dateMap.get(ts) : { [timevar]: date };
  });

  return filledData;
}

export function calculateStreaks(data, timevar, donevar, cutoffvar) {

  // using d3, make sure the data is sorted ascendedly by timevar
  data.sort((a, b) => ascending(a[timevar], b[timevar]));
  //data.sort((a, b) => b[timevar] - a[timevar]);

  data.forEach(d => {
    d.cuttoffexceeded = d[donevar] > d[cutoffvar] ? 1 : 0;
  });

  let streakId = 0;
  data.forEach((d, i) => {
    if (i === 0 || d.cuttoffexceeded !== data[i - 1].cuttoffexceeded) {
      streakId++;
    }
    d.streakId = streakId;
  });

  const groupedData = groups(data, d => d.streakId);
  const summarizedStreaks = groupedData.map(([key, group]) => {
    return {
      start_date: min(group, d => d[timevar]),
      end_date: max(group, d => d[timevar]),
      streak_length: group.length
    };
  });

  const latest = summarizedStreaks[summarizedStreaks.length - 1];

  const longest = summarizedStreaks.reduce((max, streak) => {
    if (streak.streak_length > max.streak_length) {
      return streak;
    } else if (streak.streak_length === max.streak_length) {
      return streak.end_date > max.end_date ? streak : max;
    } else {
      return max;
    }
  }, summarizedStreaks[0]);

  return {
    "latest": latest,
    "longest": longest
  };
}


