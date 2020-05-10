import { LitElement, html, property, css, query } from 'lit-element';

import '@material/mwc-drawer';
import '@material/mwc-top-app-bar-fixed';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-icon-button';
import { Snackbar } from '@material/mwc-snackbar';
import { Dialog } from '@material/mwc-dialog';
import { sharedStyles } from './sharedStyles';
import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { ApolloClientModule } from '@uprtcl/graphql';
import { ApolloClient, gql } from 'apollo-boost';
import {
  HolochainConnection,
  HolochainConnectionModule,
} from '@uprtcl/holochain-provider';

export class CMHome extends moduleConnect(LitElement) {
  @query('#help')
  help: Dialog;

  @query('#snackbar')
  snackbar: Snackbar;

  @property({ type: String })
  snackMessage: string;
  @property()
  snackCallback: () => any;

  sections = ['Balance', 'Offers', 'Creditors', 'Membrane'];

  @property({ type: Number })
  selectedSectionIndex: number = 2;

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
    const connection: HolochainConnection = this.request(
      HolochainConnectionModule.bindings.HolochainConnection
    );
    connection.onSignal('offer-received', ({ transaction_address }) => {
      this.showSnackbar(`New offer received!`, () => {
        this.selectedSectionIndex = 0;
        setTimeout(() => (this.selectedSectionIndex = 1));
      });
    });

    connection.onSignal('offer-canceled', ({ transaction_address }) => {
      this.showSnackbar(`Offer was canceled`, () => {
        this.selectedSectionIndex = 0;
        setTimeout(() => (this.selectedSectionIndex = 1));
      });
    });

    connection.onSignal('offer-completed', ({ transaction_address }) => {
      this.showSnackbar(`Offer accepted and transaction completed`, () => {
        this.selectedSectionIndex = 1;
        setTimeout(() => (this.selectedSectionIndex = 0));
      });
    });

    const client: ApolloClient<any> = await this.request(
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
            balance
          }
          minVouches
        }
      `,
    });

    this.vouchesCount = result.data.me.agent.vouchesCount;
    this.initialMember = result.data.me.agent.isInitialMember;
    this.minVouches = result.data.minVouches;

    if (result.data.me.balance != 0) this.selectedSectionIndex = 0;
    else this.selectedSectionIndex = 2;

    this.addEventListener('offer-accepted', (e) => {
      this.showSnackbar('Transaction completed', () => {
        this.selectedSectionIndex = 0;
      });
    });
  }

  isAllowed() {
    return (
      this.minVouches !== undefined &&
      (this.vouchesCount >= this.minVouches || this.initialMember)
    );
  }

  renderContent() {
    if (this.selectedSectionIndex === 3) {
      return html`<hcst-agent-list
        agentFilter="only-non-joined"
        @vouched-for-agent=${(e) =>
          this.showSnackbar(
            `Successfully vouched for @${e.detail.agent.username}`,
            null
          )}
      ></hcst-agent-list>`;
    } else if (this.selectedSectionIndex === 2) {
      return html`
        <hcmc-allowed-creditor-list
          @offer-created=${() =>
            this.showSnackbar(`Succesfully created offer`, () => {
              this.selectedSectionIndex = 1;
            })}
        ></hcmc-allowed-creditor-list>
      `;
    } else if (this.selectedSectionIndex === 0) {
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
          <strong>
            receive ${this.minVouches} vouches from members who are already in
            the network.
          </strong>
          <br /><br />
          When you have received the vouches, go to the "Creditors" tab and make
          and offer!
        </span>
      </mwc-dialog>
    `;
  }

  showSnackbar(message: string, callback: () => any) {
    this.snackMessage = message;
    this.snackCallback = callback;

    this.snackbar.show();
  }

  renderSnackbar() {
    return html`<mwc-snackbar id="snackbar" .labelText=${this.snackMessage}>
      ${this.snackCallback
        ? html`
            <mwc-button slot="action" @click=${() => this.snackCallback()}>
              SEE
            </mwc-button>
          `
        : html``}
      <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
    </mwc-snackbar> `;
  }

  render() {
    return html`
      ${this.renderSnackbar()} ${this.renderHelp()}
      <div class="column shell-container">
        <mwc-top-app-bar-fixed>
          <span slot="title">Holochain community currency</span>

          <mwc-icon-button
            slot="actionItems"
            icon="help"
            @click=${() => (this.help.open = true)}
          ></mwc-icon-button>
        </mwc-top-app-bar-fixed>

        <mwc-drawer>
          <mwc-list>
            ${this.sections.map(
              (section, index) => html`
                <mwc-list-item
                  .selected=${this.selectedSectionIndex === index}
                  .activated=${this.selectedSectionIndex === index}
                  @click=${() => (this.selectedSectionIndex = index)}
                  >${section}</mwc-list-item
                >
              `
            )}
          </mwc-list>
          <div slot="appContent">
            <div class="content column padding" style="flex: 1;">
              ${this.minVouches === undefined
                ? html`<div class="fill row center-content">
                    <mwc-circular-progress></mwc-circular-progress>
                  </div> `
                : html`
                    <mwc-card
                      style="width: 100%;"
                      class=${this.selectedSectionIndex === 0 ? 'fill' : ''}
                    >
                      <div class="padding fill column">
                        ${this.renderContent()}
                      </div>
                    </mwc-card>
                  `}
            </div>
          </div>
        </mwc-drawer>

      </div>
    `;
  }
}
