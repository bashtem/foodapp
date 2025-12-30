import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { PaymentService } from "./payment.service";

@Controller()
export class PaymentGrpcController {
  constructor(private readonly svc: PaymentService) {}
  @GrpcMethod("PaymentService", "CreateIntent") intent(data: any) {
    return this.svc.createIntent({
      order_id: data.order_id,
      amount: data.amount,
      currency: data.currency,
      provider: data.provider,
      provider_payload: data.provider_payload,
    });
  }
}
