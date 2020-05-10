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
      <div class="row fill">
        <mwc-card style="margin-right: 24px; width: 450px;">
          <hcmc-pending-offer-list
            class="padding fill"
            @offer-selected=${(e) =>
              (this.selectedTransactionId = e.detail.transactionId)}
          ></hcmc-pending-offer-list>
        </mwc-card>

        <div style="width: 700px; position: sticky; top: 48px;">
          ${this.selectedTransactionId
            ? html`
                <mwc-card
                  style="min-height: 334px; position: sticky; width: 100%; top: 48px;"
                >
                  <hcmc-offer-detail
                    style="align-self: center; min-height: 286px;"
                    class="column fill padding"
                    @offer-accepted=${() =>
                      (this.selectedTransactionId = null)}
                    @offer-canceled=${() => (this.selectedTransactionId = null)}
                    .transactionId=${this.selectedTransactionId}
                  ></hcmc-offer-detail>
                </mwc-card>
              `
            : html`<div class="fill center-content column" style="height: 334px">
                <span>Select an offer to see its details</span>
              </div>`}
        </div>
      </div>
    `;
  }
}
