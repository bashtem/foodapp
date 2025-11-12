import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

// Background jobs, queues, event handlers
@Controller()
export class DispatchController {
  @EventPattern("order.created")
  async onOrderCreated(data: any) {
    // Here you would look up nearest courier, assign, then emit order.courier.assigned
    console.log("[dispatch] order.created", data);
  }

  @EventPattern("order.status.updated")
  async onStatus(data: any) {
    console.log("[dispatch] order.status.updated", data);
  }

  @EventPattern("payment.succeeded")
  async onPayment(data: any) {
    console.log("[dispatch] payment.succeeded", data);
  }
}
