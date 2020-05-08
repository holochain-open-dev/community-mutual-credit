import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html, property, query, css } from 'lit-element';
import { sharedStyles } from './sharedStyles';
import { setupRouter } from '../router';
import { ApolloClientModule } from '@uprtcl/graphql';
import { ApolloClient, gql } from 'apollo-boost';
import { Router } from '@vaadin/router';

export class CMApp extends moduleConnect(LitElement) {
  @query('#outlet')
  outlet: HTMLElement;

  @property()
  loading: boolean = true;

  static get styles() {
    return [
      sharedStyles,
      css`
        .shell-container > * {
          flex: 1;
          display: flex;
        }

        .hidden {
          display: none;
        }

        .shell-container > hccm-login {
          justify-content: center;
          align-items: center;
        }
      `,
    ];
  }

  async firstUpdated() {
    const router = setupRouter(this.outlet);

    const client: ApolloClient<any> = this.request(
      ApolloClientModule.bindings.Client
    );

    const result = await client.query({
      query: gql`
        {
          me {
            id
            agent {
              id
              username
              vouchesCount
              isInitialMember
            }
            hasJoined
          }
          minVouches
        }
      `,
    });

    const isLogin = router.location.getUrl().includes('login');
    const hasUsername = result.data.me.agent.username != undefined;
    const hasJoined = result.data.me.hasJoined;

    if (!isLogin && !hasUsername) {
      Router.go('/login');
    } else if (hasUsername && !hasJoined) {
      Router.go('/disallowed');
    } else if (hasUsername) {
      Router.go('/home');
    }

    this.loading = false;
  }

  render() {
    return html`
      <div
        id="outlet"
        class=${'shell-container ' + (this.loading ? 'hidden' : '')}
      ></div>
      ${this.loading
        ? html`<div class="fill column center-content">
            <mwc-circular-progress></mwc-circular-progress>
          </div>`
        : html``}
    `;
  }
}
