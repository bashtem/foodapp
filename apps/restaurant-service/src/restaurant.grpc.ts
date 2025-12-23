import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { RestaurantService } from "./restaurant.service";
import {
  CreateRestaurantGrpcDto,
  GetMenuItemGrpcDto,
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
import { MenuItem } from "./entities/menu_item.entity";

@Controller()
export class RestaurantGrpcController {
  private readonly logger = new Logger(RestaurantGrpcController.name);

  constructor(private readonly restaurantService: RestaurantService) {}

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "ListRestaurants")
  async list() {
    this.logger.log("Listing restaurants");
    const restaurants = await this.restaurantService.list();
    return { records: restaurants };
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
    this.logger.log(`Updating restaurant ID: ${data.id} }`);

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
    const restaurantId = data.restaurantId;
    this.logger.log(`Creating menu item for restaurant ID: ${restaurantId}`);

    const restaurant = await this.restaurantService.findById(restaurantId);
    if (!restaurant) {
      this.logger.warn(`Restaurant not found with ID: ${restaurantId}`);
      throw new RpcException({
        code: status.NOT_FOUND,
        message: ApiErrorCode.RESTAURANT_NOT_FOUND,
      });
    }

    const menuItem = await this.restaurantService.createMenuItem(data);
    const menuItemResponse: MenuItemResponseDto = menuItem;

    this.logger.log(`Menu item created with ID: ${menuItem.id}`);
    return menuItemResponse;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "GetMenu")
  async menu(data: { restaurantId: string }) {
    this.logger.log(`Getting menu for restaurant ID: ${data.restaurantId}`);

    const menu = await this.restaurantService.getMenu(data.restaurantId);
    return { records: menu };
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "GetMenuItem")
  async getMenuItem(data: GetMenuItemGrpcDto) {
    const { id, restaurantId } = data;
    this.logger.log(`Getting menu item ID: ${id} for restaurant ID: ${restaurantId}`);

    let menuItem: MenuItem | null;
    if (!restaurantId) menuItem = await this.restaurantService.getMenuItem(id);
    else menuItem = await this.restaurantService.getMenuItemByRestaurant(restaurantId, id);

    if (!menuItem) {
      this.logger.warn(`Menu item not found with ID: ${id} for restaurant ${restaurantId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.MENU_ITEM_NOT_FOUND });
    }
    return menuItem;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "UpdateMenuItem")
  async updateMenuItem(data: UpdateMenuItemGrpcDto) {
    const { id, restaurantId } = data;
    this.logger.log(`Updating menu item ID: ${id} for restaurant ID: ${restaurantId}`);

    const menuItem = await this.restaurantService.getMenuItemByRestaurant(restaurantId, id);
    if (!menuItem) {
      this.logger.warn(`Menu item not found with ID: ${id} for restaurant ${restaurantId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.MENU_ITEM_NOT_FOUND });
    }

    const updateData: Omit<UpdateMenuItemGrpcDto, "id" | "restaurantId"> = data;
    const updatedMenuItem = await this.restaurantService.updateMenuItem(id, updateData);

    this.logger.log(
      `Menu item updated with ID: ${updatedMenuItem.id} for restaurant ID: ${restaurantId} data: ${JSON.stringify(updateData)}`
    );
    return updatedMenuItem;
  }

  @GrpcMethod(ServiceEnum.RESTAURANT_SERVICE, "DeleteMenuItem")
  async deleteMenuItem(data: GetMenuItemGrpcDto) {
    const { id, restaurantId } = data;
    this.logger.log(`Deleting menu item ID: ${id}`);

    const menuItem = await this.restaurantService.getMenuItemByRestaurant(
      restaurantId as string,
      id
    );
    if (!menuItem) {
      this.logger.warn(`Menu item not found with ID: ${id} for restaurant ${restaurantId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.MENU_ITEM_NOT_FOUND });
    }

    await this.restaurantService.deleteMenuItem(id);
    return true;
  }
}
