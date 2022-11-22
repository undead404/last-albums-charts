import * as brain from 'brain.js';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import logger from '../services/logger';

const NUMBER_OF_HIDDEN_LAYERS = 30;

const config = {
  errorThresh: 0.1,
  hiddenLayers: [NUMBER_OF_HIDDEN_LAYERS],
  inputSize: 2,
  outputSize: 2,
  iterations: 100_000,
  log: true,
  logPeriod: 100,
};
function normalizeSequence(
  dataset: number[],
): [[number, number][], (normalizedItem: [number, number]) => number] {
  logger.debug(`normalizeSequence(${dataset})`);
  const minValue = Math.min(...dataset);
  // const minValue = 0;
  const rangeSize = Math.max(...dataset) - minValue;
  // console.info('rangeSize', rangeSize);
  const normalizedDataset = map<number, [number, number]>(
    dataset,
    (value, index) => [index + 1, (value - minValue) / rangeSize],
  );
  function denormalizeValue([, normalizedValue]: number[]) {
    if (!normalizedValue) {
      throw new Error('Wrong data item');
    }
    const result = normalizedValue * rangeSize + minValue;
    if (result < 0) {
      return 0;
    }
    return result;
  }
  return [normalizedDataset, denormalizeValue];
}
export default async function predictNext(
  trainingModel: unknown,
  dataset: number[],
  numberOfYears: number,
): Promise<number[]> {
  const [normalizedDataset, denormalizeValue] = normalizeSequence(dataset);

  // create a simple feed forward neural network with backpropagation
  const net = new brain.recurrent.LSTMTimeStep(config);
  net.fromJSON(trainingModel as any);

  // const nextX = Math.max(...map(dataset, 0)) + 1;
  // if (!isFinite(nextX)) {
  //   throw new TypeError('Next x not found');
  // }

  const prediction = net.forecast(normalizedDataset, numberOfYears);
  logger.debug(`PREDICTION: ${prediction}`);
  return map(sortBy(prediction, [0], ['asc']), denormalizeValue);
}
