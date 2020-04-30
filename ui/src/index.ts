import { MicroOrchestrator } from '@uprtcl/micro-orchestrator'
import { ApolloClientModule } from '@uprtcl/graphql';
import { HolochainConnection, HolochainConnectionModule } from '@uprtcl/holochain-provider';
import { MutualCreditModule } from 'holochain-mutual-credit';
import { ProfilesModule } from 'holochain-profiles';

(async function () {

    const connection = new HolochainConnection({ host: 'ws://localhost:8888' });

    const orchestrator = new MicroOrchestrator();

    await orchestrator.loadModules([
        new HolochainConnectionModule(connection),
        new ApolloClientModule(),
        new MutualCreditModule('mutual-credit-instance'),
        new ProfilesModule('lobby-instance')
    ]);
})()