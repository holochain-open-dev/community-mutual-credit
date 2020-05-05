import { LitElement, html } from 'lit-element';
import { Router } from '@vaadin/router';
import { sharedStyles } from './sharedStyles';

export class CMLogin extends LitElement {
  static get styles() {
    return sharedStyles;
  }

/*   renderPlaceholder() {
    return html`<div class="fill row center-content">
      <span>
        You only have ${this.vouchesCount} vouches, but you need
        ${this.minVouches} to enter the network
      </span>
    </div>`;
  }
 */  
  render() {
    return html`
      <div class="column center-content">
        <span
          style="font-weight: bold; font-size: 48px; width: 600px; text-align: center; margin-bottom: 80px;"
          >Holochain Community Mutual-Credit Experiment</span
        >

        <hcpf-set-username
          style="width: 400px; margin-bottom: 80px;"
          @username-set=${() => Router.go('/home')}
        ></hcpf-set-username>
      </div>
    `;
  }
}
