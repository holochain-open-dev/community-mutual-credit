import { LitElement, html } from 'lit-element';

import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-top-app-bar-fixed';
import { sharedStyles } from './sharedStyles';

export class CMHome extends LitElement {
  static get styles() {
    return sharedStyles;
  }

  render() {
    return html`
      <div class="column">
        <mwc-top-app-bar-fixed>
          <span slot="title">Holochain community currency</span>
        </mwc-top-app-bar-fixed>

        <mwc-tab-bar>
          <mwc-tab label="Home"> </mwc-tab>
          <mwc-tab label="Offers"></mwc-tab>
          <mwc-tab label="Members">
            <hcst-agent-list></hcst-agent-list>
          </mwc-tab>
        </mwc-tab-bar>

        <div class="content">
          <hcmc-transaction-list></hcmc-transaction-list>
        </div>
      </div>
    `;
  }
}
