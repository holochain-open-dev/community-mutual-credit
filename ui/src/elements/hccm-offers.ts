import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html, property } from 'lit-element';
import { sharedStyles } from './sharedStyles';

import '@authentic/mwc-card';

export class CMOffers extends moduleConnect(LitElement) {
  @property({ type: String })
  selectedTransactionId: string | undefined = undefined;

  static get styles() {
    return sharedStyles;
  }

  render() {
    return html`
      <div class="row">
        <hcmc-pending-offer-list
          style="flex-basis: 40%;"
          @offer-selected=${(e) =>
            (this.selectedTransactionId = e.detail.transactionId)}
        ></hcmc-pending-offer-list>
        ${this.selectedTransactionId
          ? html`
              <mwc-card style="width: auto; flex: 1; margin: 16px;">
                <div class="padding">
                  <hcmc-offer-detail
                    .transactionId=${this.selectedTransactionId}
                  ></hcmc-offer-detail>
                </div>
              </mwc-card>
            `
          : html``}
      </div>
    `;
  }
}
