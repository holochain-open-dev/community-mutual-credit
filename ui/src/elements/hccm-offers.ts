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
      <div class="row fill" style="min-height: 350px;">
        <hcmc-pending-offer-list
          style="flex-basis: 40%;"
          @offer-selected=${(e) =>
            (this.selectedTransactionId = e.detail.transactionId)}
        ></hcmc-pending-offer-list>
        <span
          style="width: 1px; background-color: rgba(0, 0, 0, 0.38); opacity: 0.4; margin: 16px;"
        ></span>

        ${this.selectedTransactionId
          ? html`
              <hcmc-offer-detail
                style="align-self: center;"
                class="column fill padding"
                @offer-completed=${() => (this.selectedTransactionId = null)}
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
