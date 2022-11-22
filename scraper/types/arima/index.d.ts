declare module 'arima' {
  export interface ARIMAOptions {
    approximation: number;
    auto: boolean;
    D: number;
    d: number;
    method: number;
    optimizer: number;
    P: number;
    p: number;
    Q: number;
    q: number;
    s: number;
    search: number;
    transpose: boolean;
    verbose: boolean;
  }
  export default class ARIMA {
    constructor(options: Partial<ARIMAOptions>);

    exog?: Uint8Array;

    fit(ts: number[], exog?: number[] | [number][]): ARIMA;

    lin?: number;

    nexog?: number;

    options: ARIMAOptions;

    predict(l: number, exog?: number[] | [number][]): [number[], number[]];

    train(ts: number[], exog?: number[] | [number][]): ARIMA;

    ts?: Uint8Array;
  }
}
