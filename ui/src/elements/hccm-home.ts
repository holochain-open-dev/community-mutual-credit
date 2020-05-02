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
  numVouches: number = 0;
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
            numVouches
            isInitialMember
          }
          minVouches
        }
      `,
    });

    this.numVouches = result.data.me.numVouches;
    this.initialMember = result.data.me.isInitialMember;
    this.minVouches = result.data.minVouches;
  }

  isAllowed() {
    return (
      this.minVouches !== undefined &&
      this.numVouches === 0 &&
      !this.initialMember
    );
  }

  renderPlaceholder() {
    return html` <span>
      You only have ${this.numVouches}, but you need N to enter the network
    </span>`;
  }

  renderContent() {
    if (this.minVouches === undefined)
      return html`<mwc-circular-progress></mwc-circular-progress>`;

    if (this.selectedTabIndex === 2) {
      return html`<hccm-agent-list></hccm-agent-list>`;
    }

    if (this.isAllowed()) return this.renderPlaceholder();

    if (this.selectedTabIndex === 0) {
      return html` <hccm-balance></hccm-balance>`;
    } else {
      return html`<hcmc-pending-offer-list></hcmc-pending-offer-list>`;
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
          <mwc-tab label="Home"> </mwc-tab>
          <mwc-tab label="Offers"></mwc-tab>
          <mwc-tab label="Members"> </mwc-tab>
        </mwc-tab-bar>

        <div class="content">
          ${this.renderContent()}
        </div>
      </div>
    `;
  }
}
