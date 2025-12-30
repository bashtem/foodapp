import { OrderStatus } from "@foodapp/utils/src/enums";

export const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.CREATED]: [
    OrderStatus.PAYMENT_AUTHORIZED,
    OrderStatus.PAYMENT_FAILED,
    OrderStatus.CANCELLED_BY_USER,
  ],
  [OrderStatus.PAYMENT_AUTHORIZED]: [OrderStatus.SENT_TO_RESTAURANT, OrderStatus.CANCELLED_BY_USER],
  [OrderStatus.SENT_TO_RESTAURANT]: [OrderStatus.ACCEPTED, OrderStatus.REJECTED],
  [OrderStatus.ACCEPTED]: [OrderStatus.PREPARING],
  [OrderStatus.REJECTED]: [],
  [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_PICKUP],
  [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.COURIER_ASSIGNED],
  [OrderStatus.COURIER_ASSIGNED]: [OrderStatus.PICKED_UP],
  [OrderStatus.PICKED_UP]: [OrderStatus.EN_ROUTE, OrderStatus.DELIVERY_FAILED],
  [OrderStatus.EN_ROUTE]: [OrderStatus.DELIVERED, OrderStatus.DELIVERY_FAILED],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.REFUNDED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.PAYMENT_FAILED]: [],
  [OrderStatus.CANCELLED_BY_USER]: [],
  [OrderStatus.CANCELLED_BY_RESTAURANT]: [],
  [OrderStatus.DELIVERY_FAILED]: [],
  [OrderStatus.REFUNDED]: [],
};

export function isValidTransition(current: OrderStatus, next: OrderStatus) {
  if (current === next) return true;
  const allowed = allowedTransitions[current] || [];
  return allowed.includes(next);
}
