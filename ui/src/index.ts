import {
  MicroOrchestrator,
  i18nextBaseModule,
} from '@uprtcl/micro-orchestrator';
import { ApolloClientModule } from '@uprtcl/graphql';
import {
  HolochainConnection,
  HolochainConnectionModule,
} from '@uprtcl/holochain-provider';
import { MutualCreditModule } from 'holochain-mutual-credit';
import { SocialTriangulationModule } from 'holochain-social-triangulation';
import { ProfilesModule } from 'holochain-profiles';

import { CMApp } from './elements/hccm-app';
import { CMLogin } from './elements/hccm-login';
import { CMHome } from './elements/hccm-home';
import { CMBalance } from './elements/hccm-balance';
import { getAllowedCreditors } from './get-allowed-creditors';
import { CMOffers } from './elements/hccm-offers';
import { CMDisallowed } from './elements/hccm-disallowed';

(async function () {
  const connection = new HolochainConnection({
    host: process.env.WS_INTERFACE,
  });

  const orchestrator = new MicroOrchestrator();

  await orchestrator.loadModules([
    new HolochainConnectionModule(connection),
    new i18nextBaseModule(),
    new ApolloClientModule(),
    new SocialTriangulationModule('mutual-credit-instance', 'lobby-instance'),
    new MutualCreditModule(
      'mutual-credit-instance',
      getAllowedCreditors as any
    ),
    new ProfilesModule('lobby-instance'),
  ]);

  customElements.define('hccm-app', CMApp);
  customElements.define('hccm-login', CMLogin);
  customElements.define('hccm-home', CMHome);
  customElements.define('hccm-balance', CMBalance);
  customElements.define('hccm-offers', CMOffers);
  customElements.define('hccm-disallowed', CMDisallowed);
})();
