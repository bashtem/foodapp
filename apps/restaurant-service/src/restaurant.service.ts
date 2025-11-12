import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { MenuItem } from "./entities/menu_item.entity";

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);

  constructor(
    @InjectRepository(Restaurant) private restaurantRepo: Repository<Restaurant>,
    @InjectRepository(MenuItem) private menuRepo: Repository<MenuItem>
  ) {}

  list() {
    return this.restaurantRepo.find();
  }

  getMenu(restaurantId: string, isAvailable = true) {
    return this.menuRepo.find({ where: { restaurantId, isAvailable } });
  }

  create(restaurantData: Partial<Restaurant>) {
    const restaurant = this.restaurantRepo.create(restaurantData);

    this.logger.log(`Creating restaurant: ${restaurant.name}`);
    return this.restaurantRepo.save(restaurant);
  }

  findByName(name: string) {
    return this.restaurantRepo.findOne({ where: { name } });
  }

  findById(id: string) {
    return this.restaurantRepo.findOne({ where: { id } });
  }

  findByOwnerId(ownerId: string) {
    return this.restaurantRepo.find({ where: { ownerId } });
  }

  update(id: string, updateData: Partial<Restaurant>): Promise<Restaurant> {
    this.logger.log(`Updating restaurant ID: ${id} with data: ${JSON.stringify(updateData)}`);
    return this.restaurantRepo.save({ id, ...updateData });
  }

  delete(id: string) {
    return this.restaurantRepo.delete(id);
  }

  /* Menu item CRUD */
  async createMenuItem(menuData: Partial<MenuItem>) {
    const menuItem = this.menuRepo.create(menuData as any);
    this.logger.log(`Creating menu item: ${menuItem}`);
    return this.menuRepo.save(menuItem);
  }

  async getMenuItem(id: string) {
    return this.menuRepo.findOne({ where: { id } });
  }

  async updateMenuItem(id: string, updateData: Partial<MenuItem>) {
    this.logger.log(`Updating menu item ID: ${id}`);
    return this.menuRepo.save({ id, ...updateData } as any);
  }

  async deleteMenuItem(id: string) {
    return this.menuRepo.delete(id);
  }
}
