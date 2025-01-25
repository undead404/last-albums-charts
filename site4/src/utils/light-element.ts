import { LitElement } from 'lit';

export default class LightElement extends LitElement {
  protected override createRenderRoot(): Element | ShadowRoot {
    return this;
  }
}
