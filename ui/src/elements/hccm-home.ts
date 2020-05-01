import { LitElement, html, property } from 'lit-element';

import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-top-app-bar-fixed';
import { sharedStyles } from './sharedStyles';

export class CMHome extends LitElement {
  @property({ type: Number })
  selectedTabIndex: number = 0;

  static get styles() {
    return sharedStyles;
  }

  renderContent() {
    if (this.selectedTabIndex === 0) {
      return html` <hcmc-transaction-list></hcmc-transaction-list>`;
    } else if (this.selectedTabIndex === 2) {
      return html`<hcst-agent-list></hcst-agent-list>`;
    }
  }

  render() {
    return html`
      <div class="column">
        <mwc-top-app-bar-fixed>
          <span slot="title">Holochain community currency</span>
        </mwc-top-app-bar-fixed>

        <mwc-tab-bar
          @MDCTabBar:activated=${(e) =>
            (this.selectedTabIndex = e.detail.index)}
        >
          <mwc-tab label="Home"> </mwc-tab>
          <mwc-tab label="Offers"></mwc-tab>
          <mwc-tab label="Members"> </mwc-tab>
        </mwc-tab-bar>

        <div class="content">
          ${this.renderContent()}
        </div>
      </div>
    `;
  }
}
