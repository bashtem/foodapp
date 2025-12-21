import { Observable } from "rxjs";
import { UpdateCartGrpcDto, CartDto } from "../dto";

export interface OrderService {
  createOrder(req: any): any;
  getOrder(req: any): any;
  updateStatus(req: any): any;
  getCart(req: { userId: string }): Observable<{ records: CartDto[] }>;
  addCartItem(req: UpdateCartGrpcDto): Observable<CartDto>;
  updateCartItem(req: UpdateCartGrpcDto): Observable<CartDto>;
  removeCartItem(req: { userId: string; itemId: string }): any;
  clearCart(req: { userId: string }): any;
  checkoutCart(req: { userId: string }): any;
}
