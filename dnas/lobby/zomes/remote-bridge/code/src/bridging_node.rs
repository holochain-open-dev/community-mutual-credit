use hdk::prelude::*;
use holochain_entry_utils::HolochainEntry;
use holochain_anchors;

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct BridgingNode {
    pub agent_address: Address,
    pub dna_handle: String,
}

impl HolochainEntry for BridgingNode {
    fn entry_type() -> String {
        String::from("bridging_node")
    }
}

pub fn definition() -> ValidatingEntryType {
    entry!(
        name: BridgingNode::entry_type(),
        description: "this is a same entry defintion",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | _validation_data: hdk::EntryValidationData<BridgingNode>| {
            Ok(())
        },
        links: [
            from!(
                holochain_anchors::ANCHOR_TYPE,
                link_type: "anchor->bridging_node",
                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },
                validation: | _validation_data: hdk::LinkValidationData | {
                    Ok(())
                }
            )
        ]
    )
}
