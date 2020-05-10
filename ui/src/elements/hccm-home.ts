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
import { VouchedAgent } from 'holochain-social-triangulation';
import { classMap } from 'lit-html/directives/class-map';

export class CMHome extends moduleConnect(LitElement) {
  @query('#help')
  help: Dialog;

  @query('#snackbar')
  snackbar: Snackbar;

  @property({ type: String })
  snackMessage: string;
  @property()
  snackCallback: () => any;

  sections = [
    { name: 'Balance', icon: 'account_balance_wallet' },
    { name: 'Offers', icon: 'ballot' },
    { name: 'Creditors', icon: 'contacts' },
    { name: 'Membrane', icon: 'group_work' },
  ];

  @property({ type: Number })
  selectedSectionIndex: number = 2;

  @property({ type: Object })
  me: { agent: VouchedAgent };
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
        mwc-top-app-bar-fixed {
          --mdc-theme-primary: #E64A19;
        }

        .big-content {
          margin: 24px;
          align-self: center;
        }
        .small-content {
          margin: 24px;
          width: 1000px;
          align-self: center;
        }

        .content > hccm-balance {
          display: flex;
          flex: 1;
        }

        .drawer-list {
          position: fixed;
          width: 320px;
          background: white;
          height: 100%;
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

    this.me = result.data.me;
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
      return html` <mwc-card>
        <hcst-agent-list
          class="padding"
          agentFilter="only-non-joined"
          @vouched-for-agent=${(e) =>
            this.showSnackbar(
              `Successfully vouched for @${e.detail.agent.username}`,
              null
            )}
        ></hcst-agent-list>
      </mwc-card>`;
    } else if (this.selectedSectionIndex === 2) {
      return html`
        <mwc-card>
          <hcmc-allowed-creditor-list
            class="padding"
            @offer-created=${() =>
              this.showSnackbar(`Succesfully created offer`, () => {
                this.selectedSectionIndex = 1;
              })}
          ></hcmc-allowed-creditor-list>
        </mwc-card>
      `;
    } else if (this.selectedSectionIndex === 0) {
      return html` <hccm-balance class="fill column"></hccm-balance>`;
    } else {
      return html`<hccm-offers class="fill column"></hccm-offers>`;
    }
  }

  renderHelp() {
    return html`
      <mwc-dialog
        id="help"
        heading="Welcome to the Holochain Community Currency Experiment!"
      >
        <span>
          These are the sections available in this experiment:
        </span>

        <ul>
          <li>
            <strong>Balance</strong>: here you can see your overall credit
            balance and your transaction history.
          </li>
          <br />
          <li>
            <strong>Offers</strong>: here you can see all pending offers from/to
            other creditors.
          </li>
          <br />
          <li>
            <strong>Creditors</strong>: here you can see a list of agents with
            which you can begin an offer.
          </li>
          <br />
          <li>
            <strong>Membrane</strong>: here you can see the list of agents who
            have not joined the network yet, but want to. If you vouch for them,
            they will be one step closer to joining.
          </li>
        </ul>
        <mwc-button
          label="Got it!"
          dialogAction="ok"
          slot="primaryAction"
        ></mwc-button>
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
      ${
        this.minVouches === undefined
          ? html`<div class="fill row center-content">
              <mwc-circular-progress></mwc-circular-progress>
            </div>`
          : html`
              <mwc-top-app-bar-fixed class="shell-container">
                <span slot="title">Holochain community currency</span>

                <mwc-icon-button
                  slot="actionItems"
                  icon="help"
                  @click=${() => (this.help.open = true)}
                ></mwc-icon-button>

                <mwc-drawer style="width: 100vw; --mdc-theme-primary: #536DFE;">
                  <mwc-list class="drawer-list" style="box-shadow: 1px 1px 3px 0px rgba(0,0,0,0.2);">
                    <mwc-list-item twoline noninteractive>
                      <span>@${this.me.agent.username}</span>
                      <span slot="secondary">${this.me.agent.id}</span>
                    </mwc-list-item>
                    <li
                      divider
                      role="separator"
                      style="margin-bottom: 8px;"
                    ></li>

                    ${this.sections.map(
                      (section, index) => html`
                        <mwc-list-item
                          graphic="avatar"
                          .selected=${this.selectedSectionIndex === index}
                          .activated=${this.selectedSectionIndex === index}
                          @click=${() => (this.selectedSectionIndex = index)}
                        >
                          <span>${section.name}</span>
                          <mwc-icon slot="graphic">${section.icon}</mwc-icon>
                        </mwc-list-item>
                      `
                    )}
                  </mwc-list>
                  <div slot="appContent" class="column center-content">
                    <div
                      class=${classMap({
                        column: true,
                        padding: true,
                        'small-content': this.selectedSectionIndex > 1,
                        'big-content': this.selectedSectionIndex <= 1,
                      })}
                    >
                      ${this.renderContent()}
                    </div>
                  </div>
                </mwc-drawer>
              </mwc-top-app-bar-fixed>
            `
      }
      </div>
    `;
  }
}
