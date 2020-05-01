import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { LitElement, html } from 'lit-element';
import { ApolloClient } from 'apollo-boost';
import { ApolloClientModule } from '@uprtcl/graphql';

export class CMBalance extends moduleConnect(LitElement) {
  async firstUpdated() {
    const client: ApolloClient<any> = await this.request(
      ApolloClientModule.bindings.Client
    );
  }

  render() {
    return html``
  }
}
