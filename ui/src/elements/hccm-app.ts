import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html } from 'lit-element';
import { sharedStyles } from './sharedStyles';
import { router } from 'lit-element-router';

@router
export class CommunityCurrencyApp extends moduleConnect(LitElement) {
  static get styles() {
    return sharedStyles;
  }

  render() {
    return html` <module-container>
      <hcpf-set-username></hcpf-set-username>
      <hcst-agent-list></hcst-agent-list>
    </module-container>`;
  }
}
