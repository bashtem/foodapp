import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { RestaurantService } from "./restaurant.service";
import {
  CreateRestaurantGrpcDto,
  RestaurantResponseDto,
  UpdateRestaurantGrpcDto,
} from "@foodapp/utils/src/dto";
import {
  CreateMenuItemGrpcDto,
  UpdateMenuItemGrpcDto,
  MenuItemResponseDto,
} from "@foodapp/utils/src/dto";
import { status } from "@grpc/grpc-js";
import { ApiErrorCode } from "@foodapp/utils/src/response";
import { ServiceEnum } from "@foodapp/utils/src/enums";

@Controller()
export class RestaurantGrpcController {
  private readonly logger = new Logger(RestaurantGrpcController.name);

  constructor(private readonly restaurantService: RestaurantService) {}

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "ListRestaurants")
  async list() {
    this.logger.log("Listing restaurants");
    const restaurants = await this.restaurantService.list();
    return { list: restaurants } as any;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "GetMenu")
  async menu(data: any) {
    const restaurantId = data.restaurant_id || data.restaurantId;
    this.logger.log(`Getting menu for restaurant ID: ${restaurantId}`);

    return { items: await this.restaurantService.getMenu(restaurantId) } as any;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "FindRestaurantById")
  async findById(data: { id: string }) {
    this.logger.log(`Finding restaurant by ID: ${data.id}`);

    const restaurant = await this.restaurantService.findById(data.id);

    if (!restaurant) {
      this.logger.warn(`Restaurant not found with ID: ${data.id}`);
      throw new RpcException({
        code: status.NOT_FOUND,
        message: ApiErrorCode.RESTAURANT_NOT_FOUND,
      });
    }

    const restaurantResponse: RestaurantResponseDto = restaurant;
    return restaurantResponse;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "CreateRestaurant")
  async create(data: CreateRestaurantGrpcDto) {
    this.logger.log(`Creating restaurant: ${JSON.stringify(data)}`);

    const restaurantExist = await this.restaurantService.findByName(data.name);
    if (restaurantExist) {
      this.logger.warn(`Restaurant name already exists: ${data.name}`);
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: ApiErrorCode.RESTAURANT_NAME_ALREADY_EXISTS,
      });
    }

    const restaurant = await this.restaurantService.create(data);
    const restaurantResponse: RestaurantResponseDto = restaurant;

    this.logger.log(`Restaurant created with ID: ${restaurant.id}`);
    return restaurantResponse;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "UpdateRestaurant")
  async update(data: UpdateRestaurantGrpcDto) {
    this.logger.log(`Updating restaurant ID: ${data.id} with data: ${JSON.stringify(data)}`);

    const restaurant = await this.restaurantService.findById(data.id);
    if (!restaurant) {
      this.logger.warn(`Restaurant not found with ID: ${data.id}`);
      throw new RpcException({
        code: status.NOT_FOUND,
        message: ApiErrorCode.RESTAURANT_NOT_FOUND,
      });
    }

    if (data.name && data.name !== restaurant.name) {
      const restaurantExist = await this.restaurantService.findByName(data.name);
      if (restaurantExist) {
        this.logger.warn(`Restaurant name already exists: ${data.name}`);
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: ApiErrorCode.RESTAURANT_NAME_ALREADY_EXISTS,
        });
      }
    }

    const updatedRestaurant = await this.restaurantService.update(data.id, data);
    const restaurantResponse: RestaurantResponseDto = updatedRestaurant;

    this.logger.log(`Restaurant updated with ID: ${updatedRestaurant.id}`);
    return restaurantResponse;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "CreateMenuItem")
  async createMenuItem(data: CreateMenuItemGrpcDto) {
    const restaurantId = (data as any).restaurant_id || data.restaurantId || data.restaurantId;
    this.logger.log(`Creating menu item for restaurant ID: ${restaurantId}`);

    const restaurant = await this.restaurantService.findById(restaurantId);
    if (!restaurant) {
      this.logger.warn(`Restaurant not found with ID: ${restaurantId}`);
      throw new RpcException({
        code: status.NOT_FOUND,
        message: ApiErrorCode.RESTAURANT_NOT_FOUND,
      });
    }

    const menuItem = await this.restaurantService.createMenuItem({
      restaurantId,
      name: data.name,
      description: (data as any).description,
      price: data.price,
      isAvailable: (data as any).isAvailable,
      category: (data as any).category,
      imageUrl: (data as any).imageUrl,
      preparationTime: (data as any).preparationTime,
    } as any);

    const response: MenuItemResponseDto = menuItem as any;
    return { item: response } as any;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "GetMenuItem")
  async getMenuItem(data: { id: string }) {
    const id = (data as any).id || (data as any).menu_item_id || (data as any).menuItemId;
    this.logger.log(`Getting menu item ID: ${id}`);

    const menuItem = await this.restaurantService.getMenuItem(id);
    if (!menuItem) {
      this.logger.warn(`Menu item not found with ID: ${id}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.MENU_ITEM_NOT_FOUND });
    }
    return { item: menuItem } as any;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "UpdateMenuItem")
  async updateMenuItem(data: UpdateMenuItemGrpcDto) {
    const id = (data as any).id;
    this.logger.log(`Updating menu item ID: ${id}`);

    const menuItem = await this.restaurantService.getMenuItem(id);
    if (!menuItem) {
      this.logger.warn(`Menu item not found with ID: ${id}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.MENU_ITEM_NOT_FOUND });
    }

    const updated = await this.restaurantService.updateMenuItem(id, data as any);
    return { item: updated } as any;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "DeleteMenuItem")
  async deleteMenuItem(data: { id: string }) {
    const id = (data as any).id;
    this.logger.log(`Deleting menu item ID: ${id}`);

    const menuItem = await this.restaurantService.getMenuItem(id);
    if (!menuItem) {
      this.logger.warn(`Menu item not found with ID: ${id}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.MENU_ITEM_NOT_FOUND });
    }

    await this.restaurantService.deleteMenuItem(id);
    return { success: true } as any;
  }
}
