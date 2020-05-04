import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html, property } from 'lit-element';
import { sharedStyles } from './sharedStyles';

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
          @offer-selected=${(e) =>
            (this.selectedTransactionId = e.detail.transactionId)}
        ></hcmc-pending-offer-list>
        ${this.selectedTransactionId
          ? html`
              <hcmc-offer-detail
                .transactionId=${this.selectedTransactionId}
              ></hcmc-offer-detail>
            `
          : html``}
      </div>
    `;
  }
}
