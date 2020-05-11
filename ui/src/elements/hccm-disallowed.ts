import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html, property } from 'lit-element';
import { ApolloClientModule } from '@uprtcl/graphql';
import { ApolloClient, gql } from 'apollo-boost';
import { sharedStyles } from './sharedStyles';
import { VouchedAgent, JOIN_NETWORK } from 'holochain-social-triangulation';
import { Router } from '@vaadin/router';

export class CMDisallowed extends moduleConnect(LitElement) {
  @property()
  minVouches: number;
  @property()
  me: { id: string; agent: VouchedAgent; hasJoined: boolean };

  client: ApolloClient<any>;

  static get styles() {
    return sharedStyles;
  }

  async firstUpdated() {
    this.client = this.request(ApolloClientModule.bindings.Client);
    this.loadVouches();
  }

  async loadVouches() {
    this.me = undefined;
    const result = await this.client.query({
      query: gql`
        {
          me {
            id
            agent {
              id
              username
              vouchesCount
            }
            hasJoined
          }
          minVouches
        }
      `,
    });

    this.minVouches = result.data.minVouches;
    this.me = result.data.me;
  }

  async joinNetwork() {
    await this.client.mutate({
      mutation: JOIN_NETWORK,
      variables: {
        agentId: this.me.id,
      },
    });

    Router.go('/home');
  }

  isAllowed() {
    return this.minVouches > 0 && this.me.agent.vouchesCount >= this.minVouches;
  }

  getText() {
    if (this.me.agent.vouchesCount === undefined)
      return html`Could not retrieve how many vouches you have<br />since there
        are no online agents inside the network.`;
    if (this.isAllowed())
      return html`You already have ${this.me.agent.vouchesCount} vouches! Go
      ahead and join the network.`;
    return html`You only have ${this.me.agent.vouchesCount} vouches, but you
      need ${this.minVouches} to enter the network. <br />
      Ask some agents already inside the network to vouch for you!`;
  }

  render() {
    return html` <div class="background"></div>
      <div class="fill column center-content" style="z-index: 1;">
        ${this.me
          ? html`
              <span style="font-size: 42px; margin-bottom: 22px;">
                <strong>
                  Welcome, @${this.me.agent.username}!
                </strong>
              </span>

              <div class="row center-content" style="margin-bottom: 22px;">
                <span style="font-size: 18px; text-align: center;">
                  ${this.getText()}
                </span>

                <mwc-icon-button
                  icon="refresh"
                  @click=${() => this.loadVouches()}
                ></mwc-icon-button>
              </div>

              <mwc-button
                raised
                style="--mdc-theme-primary: #536DFE;"
                label="JOIN NETWORK"
                .disabled=${!this.isAllowed()}
                @click=${() => this.joinNetwork()}
              ></mwc-button>
            `
          : html`<mwc-circular-progress></mwc-circular-progress>`}
      </div>`;
  }
}
