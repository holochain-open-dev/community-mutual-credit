import { LitElement, html, property, css, query } from 'lit-element';

import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-top-app-bar-fixed';
import { Dialog } from '@material/mwc-dialog';
import { sharedStyles } from './sharedStyles';
import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { ApolloClientModule } from '@uprtcl/graphql';
import { ApolloClient, gql } from 'apollo-boost';

export class CMHome extends moduleConnect(LitElement) {
  @query('#help')
  help: Dialog;

  @property({ type: Number })
  selectedTabIndex: number = 2;

  @property({ type: Number })
  minVouches: number = undefined;
  @property({ type: Number })
  vouchesCount: number = 0;
  @property({ type: Boolean })
  initialMember: boolean = false;

  static get styles() {
    return [
      sharedStyles,
      css`
        mwc-top-app-bar-fixed mwc-button,
        mwc-top-app-bar-fixed mwc-icon-button {
          --mdc-theme-primary: white;
        }

        .content {
          margin: 24px;
          width: 1200px;
          align-self: center;
        }

        .content > hccm-balance {
          display: flex;
          flex: 1;
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
            username
            vouchesCount
            isInitialMember
          }
          minVouches
        }
      `,
    });

    this.vouchesCount = result.data.me.vouchesCount;
    this.initialMember = result.data.me.isInitialMember;
    this.minVouches = result.data.minVouches;

    this.addEventListener('offer-accepted', (e) => {
      this.selectedTabIndex = 0;
    });
  }

  isAllowed() {
    return (
      this.minVouches !== undefined &&
      (this.vouchesCount >= this.minVouches || this.initialMember)
    );
  }

  renderContent() {
    if (this.selectedTabIndex === 3) {
      return html`<hcst-agent-list></hcst-agent-list>`;
    } else if (this.selectedTabIndex === 2) {
      return html`
        <hcmc-allowed-creditor-list
          @offer-created=${() => (this.selectedTabIndex = 1)}
        ></hcmc-allowed-creditor-list>
      `;
    } else if (this.selectedTabIndex === 0) {
      return html` <hccm-balance class="fill column"></hccm-balance>`;
    } else {
      return html`<hccm-offers class="fill column"></hccm-offers>`;
    }
  }

  renderHelp() {
    return html`
      <mwc-dialog id="help">
        <span>
          Welcome to the Holochain Community Currency Experiment!<br /><br />
          To join the network of creditors, you need to
          <strong
            >receive ${this.minVouches} vouches from members who are already in
            the network.</strong
          ><br /><br />
          When you have received the vouches, go to the "Creditors" tab and make
          and offer!
        </span>
      </mwc-dialog>
    `;
  }

  render() {
    return html`
      ${this.renderHelp()}
      <div class="column shell-container">
        <mwc-top-app-bar-fixed>
          <span slot="title">Holochain community currency</span>

          <mwc-icon-button
            icon="help"
            @click=${() => (this.help.open = true)}
          ></mwc-icon-button>
        </mwc-top-app-bar-fixed>

        <mwc-tab-bar
          .activeIndex=${this.selectedTabIndex}
          @MDCTabBar:activated=${(e) =>
            (this.selectedTabIndex = e.detail.index)}
        >
          <mwc-tab label="Balance"> </mwc-tab>
          <mwc-tab label="Offers"></mwc-tab>
          <mwc-tab label="Creditors"> </mwc-tab>
          <mwc-tab label="Membrane"> </mwc-tab>
        </mwc-tab-bar>

        <div class="content column padding" style="flex: 1;">
          ${this.minVouches === undefined
            ? html`<div class="fill row center-content">
                <mwc-circular-progress></mwc-circular-progress>
              </div> `
            : html`
                <mwc-card
                  style="width: 100%;"
                  class=${this.selectedTabIndex === 0 ? 'fill' : ''}
                >
                  <div class="padding fill column">
                    ${this.renderContent()}
                  </div>
                </mwc-card>
              `}
        </div>
      </div>
    `;
  }
}
