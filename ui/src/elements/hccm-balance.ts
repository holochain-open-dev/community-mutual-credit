import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html, property } from 'lit-element';
import { ApolloClient, gql } from 'apollo-boost';
import { ApolloClientModule } from '@uprtcl/graphql';
import { sharedStyles } from './sharedStyles';

export class CMBalance extends moduleConnect(LitElement) {
  @property({ type: Number })
  balance: number;

  static get styles() {
    return sharedStyles;
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

    return html` <div class="column">
      <span>${this.balance}</span>
      <hcmc-transaction-list></hcmc-transaction-list>
    </div>`;
  }
}
