export interface OrderService {
  createOrder(req: any): any;
  getOrder(req: any): any;
  updateStatus(req: any): any;
  getCart(req: { userId: string }): any;
  addCartItem(req: {
    userId: string;
    menuItemId: string;
    restaurantId?: string;
    quantity: number;
  }): any;
  updateCartItem(req: { userId: string; itemId: string; quantity: number }): any;
  removeCartItem(req: { userId: string; itemId: string }): any;
  clearCart(req: { userId: string }): any;
  checkoutCart(req: { userId: string }): any;
}
