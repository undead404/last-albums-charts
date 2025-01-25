import type { ReactiveController, ReactiveControllerHost } from 'lit';

export default class DocumentEventListenerController
  implements ReactiveController
{
  host: ReactiveControllerHost;

  event: string;

  handler: EventListener;

  constructor(
    host: ReactiveControllerHost,
    event: string,
    handler: EventListener,
  ) {
    this.host = host;
    this.event = event;
    this.handler = handler;
    host.addController(this);
  }

  hostConnected() {
    document.addEventListener(this.event, this.handler);
  }

  hostDisconnected() {
    document.removeEventListener(this.event, this.handler);
  }
}
