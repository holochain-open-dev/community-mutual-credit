import { LitElement, html } from 'lit-element';
import { Router } from '@vaadin/router';

export class CMLogin extends LitElement {
  render() {
    return html`
      <hcpf-set-username
        @username-set=${() => Router.go('/home')}
      ></hcpf-set-username>
    `;
  }
}
