#![feature(proc_macro_hygiene)]

extern crate holochain_anchors;

use hdk::prelude::*;
use hdk_proc_macros::zome;
use holochain_entry_utils::HolochainEntry;
use std::convert::TryInto;

pub mod bridging_node;
pub mod message;

#[zome]
mod remote_bridge {

    use crate::{bridging_node::BridgingNode, message::BridgeRequest};
    use hdk::{
        error::ZomeApiResult,
        holochain_core_types::{link::LinkMatch, time::Timeout},
        holochain_json_api::json::JsonString,
    };

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[entry_def]
    fn anchor_def() -> ValidatingEntryType {
        holochain_anchors::anchor_definition()
    }

    #[entry_def]
    fn bridging_node_entry_def() -> ValidatingEntryType {
        bridging_node::definition()
    }

    #[zome_fn("hc_public")]
    fn volunteer_to_bridge(dna_handle: String) -> ZomeApiResult<()> {
        let node = BridgingNode {
            dna_handle: dna_handle.clone(),
            agent_address: hdk::AGENT_ADDRESS.clone(),
        };

        let bridging_node_address = hdk::commit_entry(&node.entry())?;

        let anchor_address = holochain_anchors::anchor(String::from("dna_bridges"), dna_handle)?;

        hdk::link_entries(
            &anchor_address,
            &bridging_node_address,
            "anchor->bridging_node",
            hdk::AGENT_ADDRESS.clone().to_string().as_str(),
        )?;

        Ok(())
    }

    #[zome_fn("hc_public")]
    fn request_remote_bridge(
        dna_handle: String,
        zome_name: String,
        cap_token: Option<Address>,
        fn_name: String,
        fn_args: JsonString,
    ) -> ZomeApiResult<JsonString> {
        let token = match cap_token {
            Some(t) => t,
            None => hdk::PUBLIC_TOKEN.clone(),
        };

        let bridge_request = BridgeRequest {
            dna_handle: dna_handle.clone(),
            zome_name: zome_name.clone(),
            cap_token: token,
            fn_name: fn_name,
            fn_args: fn_args,
        };

        let anchor_address = holochain_anchors::anchor(
            String::from("dna_bridges"),
            bridge_request.clone().dna_handle,
        )?;
        let links = hdk::get_links(
            &anchor_address,
            LinkMatch::Exactly("anchor->bridging_node"),
            LinkMatch::Any,
        )?;

        let message = JsonString::from(bridge_request).to_string();

        for link in links.links() {
            let response = hdk::send(Address::from(link.tag), message.clone(), Timeout::default());

            match response {
                Ok(result) => {
                    let success: Result<ZomeApiResult<JsonString>, _> =
                        JsonString::from_json(&result).try_into();

                    match success {
                        Ok(Ok(result)) => {
                            return Ok(result);
                        }
                        _ => (),
                    };
                }
                _ => (),
            }
        }

        Err(ZomeApiError::from(String::from(
            "Could not invoke the remote bridge from any node",
        )))
    }

    #[receive]
    pub fn receive(_address: Address, message: JsonString) -> String {
        let bridge_request: Result<BridgeRequest, _> = JsonString::from_json(&message).try_into();

        match bridge_request {
            Ok(request) => {
                let result = hdk::call(
                    request.dna_handle,
                    request.zome_name,
                    request.cap_token,
                    request.fn_name,
                    request.fn_args,
                );

                JsonString::from(result).to_string()
            }
            _ => {
                let result: ZomeApiResult<JsonString> = Err(ZomeApiError::from(String::from(
                    "Error deserializing the bridge request",
                )));
                JsonString::from(result).to_string()
            }
        }
    }
}
