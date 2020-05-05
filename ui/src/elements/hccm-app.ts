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

  static get styles() {
    return [
      sharedStyles,
      css`
        .shell-container > * {
          flex: 1;
          display: flex;
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
            username
            vouchesCount
            isInitialMember
          }
          minVouches
        }
      `,
    });

    const isLogin = router.location.getUrl().includes('login');
    const hasUsername = result.data.me.username != undefined;
    const isAllowed =
      result.data.me.isInitialMember ||
      result.data.me.vouchesCount >= result.data.minVouches;

    if (!isLogin && !hasUsername) {
      Router.go('/login');
    } else if (hasUsername && !isAllowed) {
      Router.go('/disallowed');
    } else if (hasUsername) {
      Router.go('/home');
    }
  }

  render() {
    return html` <div id="outlet" class="shell-container"></div> `;
  }
}
