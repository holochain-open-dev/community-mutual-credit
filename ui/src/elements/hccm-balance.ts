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
          me {
            id
            balance
          }
        }
      `,
      fetchPolicy: 'network-only',
    });

    this.balance = result.data.me.balance;
  }

  render() {
    if (this.balance === undefined)
      return html`<div class="row fill padding center-content">
        <mwc-circular-progress></mwc-circular-progress>
      </div>`;

    return html` <div class="column fill padding">
      <div style="flex-basis: 150px;" class="column center-content">
        <div class="column">
          <span class="title" style="margin-bottom: 8px;">Your balance</span>
          <span class="balance"
            >${`${this.balance > 0 ? '+' : ''}${this.balance.toFixed(1)}`}
            credits</span
          >
        </div>
      </div>
      <span
        style="width: 1px; background-color: rgba(0, 0, 0, 0.38); opacity: 0.4; margin: 32px 16px;"
      ></span>

      <mwc-card class="fill" style="width: 1000px; align-self: center;">
        <div class="column fill padding">
          <span class="title" style="margin-bottom: 8px;"
            >Transaction history</span
          >
          <hcmc-transaction-list></hcmc-transaction-list>
        </div>
      </mwc-card>
    </div>`;
  }
}
