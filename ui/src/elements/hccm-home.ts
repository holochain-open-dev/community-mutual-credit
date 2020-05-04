import { LitElement, html, property, css } from 'lit-element';

import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-top-app-bar-fixed';
import { sharedStyles } from './sharedStyles';
import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { ApolloClientModule } from '@uprtcl/graphql';
import { ApolloClient, gql } from 'apollo-boost';

export class CMHome extends moduleConnect(LitElement) {
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
        mwc-top-app-bar-fixed mwc-button {
          --mdc-theme-primary: white;
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
  }

  isAllowed() {
    return (
      this.minVouches !== undefined &&
      (this.vouchesCount >= this.minVouches || this.initialMember)
    );
  }

  renderPlaceholder() {
    return html` <span>
      You only have ${this.vouchesCount}, but you need N to enter the network
    </span>`;
  }

  renderContent() {
    if (this.minVouches === undefined)
      return html`<mwc-circular-progress></mwc-circular-progress>`;

    if (this.selectedTabIndex === 3) {
      return html`<hcst-agent-list></hcst-agent-list>`;
    }

    if (!this.isAllowed()) return this.renderPlaceholder();

    if (this.selectedTabIndex === 2) {
      return html`<hcmc-agent-list></hcmc-agent-list>`;
    }

    if (this.selectedTabIndex === 0) {
      return html` <hccm-balance></hccm-balance>`;
    } else {
      return html`<hccm-offers></hccm-offers>`;
    }
  }

  render() {
    return html`
      <div class="column">
        <mwc-top-app-bar-fixed>
          <span slot="title">Holochain community currency</span>
        </mwc-top-app-bar-fixed>

        <mwc-tab-bar
          @MDCTabBar:activated=${(e) =>
            (this.selectedTabIndex = e.detail.index)}
        >
          <mwc-tab label="Balance"> </mwc-tab>
          <mwc-tab label="Offers"></mwc-tab>
          <mwc-tab label="Members"> </mwc-tab>
          <mwc-tab label="Vouching"> </mwc-tab>
        </mwc-tab-bar>

        <div class="content">
          ${this.renderContent()}
        </div>
      </div>
    `;
  }
}
