import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html, property, query, css } from 'lit-element';
import { sharedStyles } from './sharedStyles';
import { setupRouter } from '../router';
import { ApolloClientModule } from '@uprtcl/graphql';
import { ApolloClient, gql } from 'apollo-boost';
import { Router } from '@vaadin/router';
import {
  HolochainConnection,
  HolochainConnectionModule,
} from '@uprtcl/holochain-provider';

export class CMApp extends moduleConnect(LitElement) {
  @query('#outlet')
  outlet: HTMLElement;

  @property()
  loading: boolean = true;
  @property()
  adminInterface: boolean = false;

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
    const connection: HolochainConnection = this.request(
      HolochainConnectionModule.bindings.HolochainConnection
    );

    this.adminInterface = await connection.isAdminInterface();

    if (this.adminInterface) {
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
    }

    this.loading = false;
  }

  render() {
    return html`
      <div
        id="outlet"
        class=${'shell-container ' +
        (this.loading || !this.adminInterface ? 'hidden' : '')}
      ></div>
      ${this.loading
        ? html`<div class="fill column center-content">
            <mwc-circular-progress></mwc-circular-progress>
          </div>`
        : this.adminInterface
        ? html``
        : html` <div class="background"></div>
            <div class="fill column center-content">
              <div style="width: 1000px; text-align: center;">
                <span style="font-size: 26px; font-weight: bold;"
                  >Wait! You didn't install the happ with the admin interface
                  activated: uninstall and install again the happ with the admin
                  interface activated.<br /><br /></span
                ><span style="font-size: 22px;">
                  The admin interface is necessary since this happ needs to
                  clone the Comunity-Currency DNA when joining its network.
                </span>
              </div>
            </div>`}
    `;
  }
}
