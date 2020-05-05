import { Agent } from 'holochain-profiles';
import { ApolloClient, gql } from 'apollo-boost';
import { GetAllowedCreditors } from 'holochain-mutual-credit';
import { VouchedAgent } from 'holochain-social-triangulation';

export const getAllowedCreditors = async (
  client: ApolloClient<any>
): Promise<Agent[]> => {
  const result = await client.query({
    query: gql`
      {
        allAgents {
          id
          username
          vouchesCount
          isInitialMember
        }
        minVouches
      }
    `,

    fetchPolicy: 'network-only',
  });

  const allAgents: VouchedAgent[] = result.data.allAgents;
  const minVouches = result.data.minVouches;

  return allAgents.filter(
    (a) => a.isInitialMember || a.vouchesCount >= minVouches
  );
};
