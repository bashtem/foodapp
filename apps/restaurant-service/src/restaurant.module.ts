import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { MenuItem } from './entities/menu_item.entity';
import { RestaurantService } from './restaurant.service';
import { RestaurantGrpcController } from './restaurant.grpc';
@Module({
  imports:[TypeOrmModule.forFeature([Restaurant, MenuItem])],
  providers:[RestaurantService],
  controllers:[RestaurantGrpcController]
})
export class RestaurantModule {}
