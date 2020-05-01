import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html, property, query } from 'lit-element';
import { sharedStyles } from './sharedStyles';
import { setupRouter } from '../router';

export class CMApp extends moduleConnect(LitElement) {
  @query('#outlet')
  outlet: HTMLElement;

  static get styles() {
    return sharedStyles;
  }

  firstUpdated() {
    setupRouter(this.outlet);
  }

  render() {
    return html` <module-container>
      <div id="outlet"></div>
    </module-container>`;
  }
}
