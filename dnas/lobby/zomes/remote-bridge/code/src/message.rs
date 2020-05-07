use hdk::prelude::*;

#[derive(Serialize, Deserialize, Debug, self::DefaultJson, Clone)]
pub struct BridgeRequest {
  pub dna_handle: String,
  pub zome_name: String,
  pub cap_token: Address,
  pub fn_name: String,
  pub fn_args: JsonString
}