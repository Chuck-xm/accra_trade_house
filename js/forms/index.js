import { onAction } from "../core/events.js";
import { showProducer } from "./producer.js";
import { showStall } from "./stall.js";
import { showSourcing } from "./sourcing.js";
import { showContact } from "./contact.js";
import { showMarket } from "./market.js";
import { showPrivacy } from "./privacy.js";

const flows = {
  producer: showProducer,
  stall: showStall,
  sourcing: showSourcing,
  contact: showContact,
  market: showMarket,
  privacy: showPrivacy,
};
export function initFlows() {
  onAction("[data-modal]", (target) => flows[target.dataset.modal]?.());
}
