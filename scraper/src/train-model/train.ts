import { recurrent } from 'brain.js';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import logger from '../common/logger';

import getTimeline from './get-timeline';
import pickTag from './pick-tag';
import saveModel from './save-model';

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
  // eslint-disable-next-line no-console
  console.info('normalizedDataset', normalizedDataset);
  function denormalizeValue([, normalizedValue]: [number, number]) {
    if (!normalizedValue) {
      throw new Error('Wrong data item');
    }
    return normalizedValue * rangeSize + minValue;
  }
  return [normalizedDataset, denormalizeValue];
}
export default async function trainModel() {
  logger.debug('trainModel');
  const tag = await pickTag();
  if (!tag) {
    logger.warn('No tag found');
    return;
  }
  logger.debug(`tag: ${tag.name}`);
  const timeline = await getTimeline(tag.name);

  const [normalizedDataset, denormalizeValue] = normalizeSequence(
    map(timeline, 'result'),
  );

  // create a simple feed forward neural network with backpropagation
  const net = new recurrent.LSTMTimeStep(config);
  net.train(normalizedDataset, config);

  logger.info(
    `test forecast: ${map(
      // eslint-disable-next-line no-magic-numbers
      sortBy(net.forecast(normalizedDataset, 10), [0], ['asc']),
      denormalizeValue,
    )}`,
  );
  await saveModel(tag.name, net.toJSON());
  logger.debug(`trainModel success for ${tag.name}`);
}
