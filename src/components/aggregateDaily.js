import {
  //group,
  rollup,
  sum,
  mean,
  max,
  min,
  count
} from 'd3-array';

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




