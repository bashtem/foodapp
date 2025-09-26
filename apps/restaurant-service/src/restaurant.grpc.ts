import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';

@Controller()
export class RestaurantGrpcController {
  constructor(private readonly svc: RestaurantService){}
  @GrpcMethod('RestaurantService','ListRestaurants') async list(data:any){ return { items: await this.svc.listOpen() } as any; }
  @GrpcMethod('RestaurantService','GetMenu') async menu(data:any){ return { items: await this.svc.getMenu(data.restaurant_id) } as any; }
}
