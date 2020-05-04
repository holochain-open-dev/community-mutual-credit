import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html, property, css } from 'lit-element';
import { ApolloClient, gql } from 'apollo-boost';
import { ApolloClientModule } from '@uprtcl/graphql';
import { sharedStyles } from './sharedStyles';

export class CMBalance extends moduleConnect(LitElement) {
  @property({ type: Number })
  balance: number;

  static get styles() {
    return [
      sharedStyles,
      css`
        .balance {
          font-size: 60px;
        }
      `,
    ];
  }

  async firstUpdated() {
    const client: ApolloClient<any> = await this.request(
      ApolloClientModule.bindings.Client
    );

    const result = await client.query({
      query: gql`
        {
          myBalance
        }
      `,
    });

    this.balance = result.data.myBalance;
  }

  render() {
    if (this.balance === undefined)
      return html`<mwc-circular-progress></mwc-circular-progress>`;

    return html` <div class="row fill">
      <div style="flex-basis: 500px;" class="column center-content">
        <div class="column">
          <span class="title" style="margin-bottom: 8px;">Balance</span>
          <span class="balance"
            >${`${this.balance > 0 ? '+' : ''}${this.balance}`} credits</span
          >
        </div>
      </div>
      <div class="column fill">
        <span class="title">Transaction history</span>
        <mwc-card style="margin-top: 16px;">
          <hcmc-transaction-list></hcmc-transaction-list>
        </mwc-card>
      </div>
    </div>`;
  }
}
