import find from 'lodash/find';
import findLast from 'lodash/findLast';
import { linearRegression, linearRegressionLine } from 'simple-statistics';

export default function getTrend(
  points: [number, number][],
  domain: [number, number],
) {
  const lineFunction = linearRegressionLine(linearRegression(points));
  const firstYearInDomain = find(
    points,
    ([year]) =>
      lineFunction(year) >= domain[0] && lineFunction(year) <= domain[1],
  )?.[0];
  if (!firstYearInDomain) {
    return null;
  }
  const lastYearInDomain = findLast(
    points,
    ([year]) =>
      lineFunction(year) >= domain[0] && lineFunction(year) <= domain[1],
  )?.[0];
  if (!lastYearInDomain) {
    return null;
  }
  return [
    {
      x: firstYearInDomain,
      y: lineFunction(firstYearInDomain),
    },
    {
      x: lastYearInDomain,
      y: lineFunction(lastYearInDomain),
    },
  ];
}
