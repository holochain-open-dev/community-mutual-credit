import { LitElement, html, css } from 'lit-element';
import { ApolloClient, gql } from 'apollo-boost';
import { sharedStyles } from './sharedStyles';
import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { ApolloClientModule } from '@uprtcl/graphql';
import { JOIN_NETWORK } from 'holochain-social-triangulation';
import { Router } from '@vaadin/router';

export class CMLogin extends moduleConnect(LitElement) {
  client!: ApolloClient<any>;

  static get styles() {
    return sharedStyles;
  }

  firstUpdated() {
    this.client = this.request(ApolloClientModule.bindings.Client);
  }

  async joinNetwork() {
    const result = await this.client.query({
      query: gql`
        {
          me {
            id
            hasJoined
          }
        }
      `,
    });

    if (result.data.me.hasJoined) {
      await this.client.mutate({
        mutation: JOIN_NETWORK,
        variables: {
          agentId: result.data.me.id,
        },
      });

      Router.go('/home');
    } else {
      Router.go('/disallowed');
    }
  }

  render() {
    return html`
      <div class="background"></div>

      <div
        class="column center-content"
        style="z-index: 1;"
      >
        <span
          style="font-weight: bold; font-size: 48px; width: 600px; text-align: center; margin-bottom: 64px;"
          >Holochain Community Mutual-Credit Experiment</span
        >

        <hcpf-set-username
          style="width: 400px; margin-bottom: 80px; --mdc-theme-primary: #536DFE;"
          @username-set=${() => this.joinNetwork()}
        ></hcpf-set-username>
      </div>
    `;
  }
}
