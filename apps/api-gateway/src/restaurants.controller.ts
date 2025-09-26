import { Controller, Get, Param, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
interface RestSvc { ListRestaurants(req:any): any; GetMenu(req:any): any; }
@Controller('restaurants')
export class RestaurantsController implements OnModuleInit {
  private svc: RestSvc;
  constructor(@Inject('RESTAURANT_GRPC') private readonly client: ClientGrpc){}
  onModuleInit(){ this.svc = this.client.getService<RestSvc>('RestaurantService'); }
  @Get() list(){ return firstValueFrom(this.svc.ListRestaurants({open_only:true}).pipe(timeout(4000))); }
  @Get(':id/menu') menu(@Param('id') id:string){ return firstValueFrom(this.svc.GetMenu({restaurant_id:id}).pipe(timeout(4000))); }
}
