import ARIMA from 'arima';
import map from 'lodash/map';

import logger from '../common/logger';

import getTimeline from './get-timeline';
import pickTag from './pick-tag';
// import saveModel from './save-model';

const PREDICTION_SIZE = 10;

/* function normalizeSequence(
  dataset: number[],
): [number[], (normalizedItem: number) => number] {
  logger.debug(`normalizeSequence(${dataset})`);
  const minValue = Math.min(...dataset);
  // const minValue = 0;
  const rangeSize = Math.max(...dataset) - minValue;
  // console.info('rangeSize', rangeSize);
  const normalizedDataset = map(
    dataset,
    (value) => (value - minValue) / rangeSize,
  );
  // eslint-disable-next-line no-console
  console.info('normalizedDataset', normalizedDataset);
  function denormalizeValue(normalizedValue: number) {
    logger.debug(`denormalizeValue(${normalizedValue})`);
    if (!normalizedValue) {
      throw new Error('Wrong data item');
    }
    return normalizedValue * rangeSize + minValue;
  }
  return [normalizedDataset, denormalizeValue];
} */
export default async function trainModel() {
  logger.debug('trainModel');
  const tag = await pickTag();
  if (!tag) {
    logger.warn('No tag found');
    return;
  }
  logger.debug(`tag: ${tag.name}`);
  const timeline = await getTimeline(tag.name);

  // const [normalizedDataset, denormalizeValue] = normalizeSequence(
  //   map(timeline, 'result'),
  // );
  const sequence = map(timeline, 'result');

  // create a simple feed forward neural network with backpropagation
  const arima = new ARIMA({ p: 20, d: 0, q: 4 });
  // arima.train(normalizedDataset);
  arima.train(sequence);
  const [prediction, errors] = arima.predict(PREDICTION_SIZE);
  // logger.info(
  //   `test forecast: ${map(
  //     // eslint-disable-next-line no-magic-numbers
  //     prediction,
  //     denormalizeValue,
  //   )}`,
  // );
  logger.info(`test forecast: ${prediction}`);
  logger.info(`test errors: ${errors}`);
  // await saveModel(tag.name, net.toJSON());
  logger.debug(`trainModel success for ${tag.name}`);
}
