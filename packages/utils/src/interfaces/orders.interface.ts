import { Observable } from "rxjs";
import {
  UpdateCartGrpcDto,
  CartDto,
  RemoveCartItemDto,
  AddCartGrpcDto,
  CheckoutGrpcDto,
  CheckoutResultDto,
} from "../dto";

export interface OrderService {
  getCart(req: { userId: string }): Observable<{ records: CartDto[] }>;
  addCartItem(req: AddCartGrpcDto): Observable<CartDto>;
  updateCartItem(req: UpdateCartGrpcDto): Observable<CartDto>;
  removeCartItem(req: RemoveCartItemDto): Observable<CartDto>;
  clearCart(req: { userId: string }): Observable<void>;
  checkoutCart(req: CheckoutGrpcDto): Observable<CheckoutResultDto>;
  createOrder(req: any): any;
  getOrder(req: any): any;
  updateStatus(req: any): any;
}
