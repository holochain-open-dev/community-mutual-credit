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
    devEnv: {
      templateDnasPaths: {
        QmXAfJ2kWkP191V3CRmonKpJRpqHvUVGa7CbL4F8jiojTy:
          '../../dnas/community-currency/dist/community-currency.dna.json',
      },
    },
  });

  const orchestrator = new MicroOrchestrator();

  await orchestrator.loadModules([
    new HolochainConnectionModule(connection),
    new i18nextBaseModule(),
    new ApolloClientModule(),
    new SocialTriangulationModule(
      {
        instance: 'mutual-credit-instance',
        dnaId: 'mutual-credit-dna',
        properties: {
          initial_members: [
            'HcSciEq88wZuM35y7kGCGD5MKDIddrk445PGkA54twy67x5t5jmXcdg9rgk4b5z',
            'HcSCJe7gAAdboumfp3ozByh5H9xdym3juGPcsysG7yxhh58ivUuKNzVtofcd7hr',
            'HcScIBT43BGxfz6ehifdWC8bi4Uu8awkwHAhZgXm8izefuxqTPaoqdnbqb3raor',
            'HcScigUzSbX9ebpo73yr8TqiWN9Cfwkvx65NCZO7tS7GNtr8Rf3YyY6XxPtyvia',
            'HcSCiKEIwHhb7nteiiYTeczvYvvj7ztzynpEB6qGQwohqpf9m4drDb5DH4sgs8i',
          ],
          necessary_vouches: 2,
        },
        templateDnaAddress: 'QmXAfJ2kWkP191V3CRmonKpJRpqHvUVGa7CbL4F8jiojTy',
      },
      'lobby-instance',
      'remote-bridge'
    ),
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
