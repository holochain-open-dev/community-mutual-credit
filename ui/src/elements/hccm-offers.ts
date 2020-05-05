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
      <div class="row fill" style="min-height: 400px;">
        <hcmc-pending-offer-list
          style="flex-basis: 40%;"
          @offer-selected=${(e) =>
            (this.selectedTransactionId = e.detail.transactionId)}
        ></hcmc-pending-offer-list>
        ${this.selectedTransactionId
          ? html`
              <hcmc-offer-detail
                class="column fill padding"
                @offer-canceled=${() => (this.selectedTransactionId = null)}
                .transactionId=${this.selectedTransactionId}
              ></hcmc-offer-detail>
            `
          : html`<div class="fill center-content column">
              <span>Select an offer to see its details</span>
            </div>`}
      </div>
    `;
  }
}
