import { MicroOrchestrator } from '@uprtcl/micro-orchestrator'
import { ApolloClientModule } from '@uprtcl/graphql';
import { HolochainConnection, HolochainConnectionModule } from '@uprtcl/holochain-provider';
import { MutualCreditModule } from 'holochain-mutual-credit';

const connection = new HolochainConnection({ host: 'ws://localhost:8888' });

const orchestrator = new MicroOrchestrator();

await orchestrator.loadModules([
    new HolochainConnectionModule(connection),
    new ApolloClientModule(),
    new MutualCreditModule('test-instance')
]);