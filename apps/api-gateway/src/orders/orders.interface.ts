export interface OrderSvc {
  CreateOrder(req: any): any;
  GetOrder(req: any): any;
  UpdateStatus(req: any): any;
}