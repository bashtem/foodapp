import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { MenuItem } from './entities/menu_item.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) private restRepo: Repository<Restaurant>,
    @InjectRepository(MenuItem) private menuRepo: Repository<MenuItem>,
  ){}
  listOpen(){ return this.restRepo.find({ where:{ status:'open' }}); }
  getMenu(restaurant_id: string){ return this.menuRepo.find({ where:{ restaurant_id, is_available: true }}); }
}
