import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html } from 'lit-element';
import { sharedStyles } from './sharedStyles';

export class CommunityCurrencyApp extends moduleConnect(LitElement) {
  static get styles() {
    return sharedStyles;
  }

  render() {
    return html` <hcpf-set-username></hcpf-set-username>
      <hcst-agent-list></hcst-agent-list>`;
  }
}
