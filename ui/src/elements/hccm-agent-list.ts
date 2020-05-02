import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html, property, css, query } from 'lit-element';
import { ApolloClient, gql } from 'apollo-boost';
import { ApolloClientModule } from '@uprtcl/graphql';

import '@authentic/mwc-circular-progress';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import { Dialog } from '@material/mwc-dialog';

import { Agent, VOUCH_FOR_AGENT } from 'holochain-social-triangulation';

export class CMAgentList extends moduleConnect(LitElement) {
  @query('#create-offer-dialog')
  createOfferDialog: Dialog;

  @property({ type: Array })
  agents: Agent[] | undefined = undefined;

  @property({ type: Number })
  minVouches: number;

  @property({ type: String })
  selectedCreditor: string | undefined = undefined;

  client!: ApolloClient<any>;

  static get styles() {
    return css`
      .row {
        display: flex;
        flex-direction: row;
      }
    `;
  }

  async firstUpdated() {
    this.client = this.request(ApolloClientModule.bindings.Client);

    const result = await this.client.query({
      query: gql`
        {
          allAgents {
            id
            username
            numVouches
            isInitialMember
          }
          minVouches
        }
      `,
    });

    this.agents = result.data.allAgents;
    this.minVouches = result.data.minVouches;
  }

  isAllowed(agent: Agent) {
    return agent.isInitialMember || agent.numVouches > this.minVouches;
  }

  vouchForAgent(agentId: string) {
    this.client.mutate({
      mutation: VOUCH_FOR_AGENT,
      variables: {
        agentId,
      },
    });
  }

  renderCreateOffer() {
    return html`<mwc-dialog id="create-offer-dialog">
      <hcmc-create-offer .creditor=${this.selectedCreditor}></hcmc-create-offer
    ></mwc-dialog>`;
  }

  renderAgent(agent: Agent) {
    return html`
      <div class="row" style="align-items: center;">
        <mwc-list-item style="flex: 1;" twoline noninteractive>
          <span>${agent.username}</span>
          <span slot="secondary">${agent.id}</span>
        </mwc-list-item>

        ${this.isAllowed(agent)
          ? html`<mwc-button
              label="Offer credits"
              @click=${() => {
                this.selectedCreditor = agent.id;
                this.createOfferDialog.open = true;
              }}
            ></mwc-button>`
          : html`
              <span style="margin-right: 8px;">${agent.numVouches}</span>
              <mwc-button
                label="VOUCH"
                @click=${() => this.vouchForAgent(agent.id)}
              ></mwc-button>
            `}
      </div>
    `;
  }

  render() {
    if (!this.agents)
      return html`<mwc-circular-progress></mwc-circular-progress>`;

    return html`
      ${this.renderCreateOffer()}
      <mwc-list>
        ${this.agents.map(
          (agent, i) => html`${this.renderAgent(agent)}
          ${this.agents && i < this.agents.length - 1
            ? html`<li divider padded role="separator"></li> `
            : html``} `
        )}
      </mwc-list>
    `;
  }
}
