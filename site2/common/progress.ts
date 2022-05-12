import toInteger from 'lodash/toInteger';

const PERCENTS = 100;

export interface Logger {
  info(value: string): void;
}

export default class Progress {
  current = 0;

  currentPercent = 0;

  logger: Logger = console;

  operationName = 'Progress';

  total = Number.POSITIVE_INFINITY;

  constructor(
    total: number,
    start = 0,
    operationName = 'Progress',
    logger: Logger = console,
  ) {
    this.current = start;
    this.logger = logger;
    this.operationName = operationName;
    this.total = total;
  }

  increment(): void {
    this.current += 1;
    this.maybeLog();
  }

  maybeLog(): void {
    const previousPercent = this.currentPercent;
    this.currentPercent = toInteger((this.current / this.total) * PERCENTS);
    if (previousPercent !== this.currentPercent) {
      this.logger.info(`${this.operationName}: ${this.currentPercent}%`);
    }
  }
}
