import type { ReactiveController, ReactiveControllerHost } from 'lit';
import forEach from 'lodash/forEach';

export default class ClientImportController implements ReactiveController {
  clientDependencies: string[];

  constructor(host: ReactiveControllerHost, ...clientDependencies: string[]) {
    this.clientDependencies = clientDependencies;
    host.addController(this);
  }

  hostConnected(): void {
    forEach(this.clientDependencies, (clientDependency) => {
      import(clientDependency);
    });
  }
}
