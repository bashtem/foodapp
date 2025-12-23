import { Observable } from "rxjs";
import { UpdateCartGrpcDto, CartDto, RemoveCartItemDto, AddCartGrpcDto } from "../dto";

export interface OrderService {
  getCart(req: { userId: string }): Observable<{ records: CartDto[] }>;
  addCartItem(req: AddCartGrpcDto): Observable<CartDto>;
  updateCartItem(req: UpdateCartGrpcDto): Observable<CartDto>;
  removeCartItem(req: RemoveCartItemDto): Observable<CartDto>;
  clearCart(req: { userId: string }): Observable<void>;
  createOrder(req: any): any;
  getOrder(req: any): any;
  updateStatus(req: any): any;
  checkoutCart(req: { userId: string }): any;
}
