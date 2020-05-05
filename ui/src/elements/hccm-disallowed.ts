import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html, property } from 'lit-element';
import { ApolloClientModule } from '@uprtcl/graphql';
import { ApolloClient, gql } from 'apollo-boost';
import { sharedStyles } from './sharedStyles';
import { VouchedAgent } from 'holochain-social-triangulation';

export class CMDisallowed extends moduleConnect(LitElement) {
  @property()
  minVouches: number;
  @property()
  me: VouchedAgent;

  static get styles() {
    return sharedStyles;
  }

  async firstUpdated() {
    const client: ApolloClient<any> = this.request(
      ApolloClientModule.bindings.Client
    );

    const result = await client.query({
      query: gql`
        {
          me {
            id
            username
            vouchesCount
          }
          minVouches
        }
      `,
    });

    this.minVouches = result.data.minVouches;
    this.me = result.data.me;
  }

  render() {
    return html`<div class="fill column center-content">
      ${this.minVouches
        ? html`
            <span style="font-size: 24px; margin-bottom: 18px;">
              <strong>
                Welcome, @${this.me.username}!
              </strong>
            </span>
            <span style="font-size: 18px;">
              You only have ${this.me.vouchesCount} vouches, but you need ${this.minVouches} to enter the network. <br>
              Ask some agents already inside the network to vouch for you!
            </span>
          `
        : html`<mwc-circular-progress></mwc-circular-progress>`}
    </div>`;
  }
}
