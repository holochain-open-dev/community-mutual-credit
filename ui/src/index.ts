import { MicroOrchestrator } from '@uprtcl/micro-orchestrator';
import { ApolloClientModule } from '@uprtcl/graphql';
import {
  HolochainConnection,
  HolochainConnectionModule,
} from '@uprtcl/holochain-provider';
import { MutualCreditModule } from 'holochain-mutual-credit';
import { SocialTriangulationModule } from 'holochain-social-triangulation';
import { ProfilesModule } from 'holochain-profiles';

import { CommunityCurrencyApp } from './elements/hccm-app';

(async function () {
  const connection = new HolochainConnection({ host: 'ws://localhost:8888' });

  const orchestrator = new MicroOrchestrator();

  await orchestrator.loadModules([
    new HolochainConnectionModule(connection),
    new ApolloClientModule(),
    new SocialTriangulationModule('mutual-credit-instance'),
    new MutualCreditModule('mutual-credit-instance'),
    new ProfilesModule('lobby-instance'),
  ]);

  customElements.define('hccm-app', CommunityCurrencyApp);
})();
