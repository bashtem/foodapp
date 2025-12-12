import {
  CreateRestaurantDto,
  CreateRestaurantGrpcDto,
  UpdateRestaurantDto,
} from "@foodapp/utils/src/dto";
import {
  CreateMenuItemDto,
  CreateMenuItemGrpcDto,
  UpdateMenuItemGrpcDto,
} from "@foodapp/utils/src/dto";
import { RestaurantService, UserRequest } from "@foodapp/utils/src/interfaces";
import { ApiSuccessCode, createResponse, grpcToHttpStatusMap } from "@foodapp/utils/src/response";
import {
  Controller,
  Get,
  Param,
  Inject,
  OnModuleInit,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
  Req,
  Patch,
  ParseUUIDPipe,
  Delete,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ServiceEnum, ServiceGrpcEnum } from "@foodapp/utils/src/enums";
import { UpdateRestaurantGrpcDto } from "@foodapp/utils/src/dto/restaurant.dto";

// @UseGuards(AuthGuard) FIXME:
@Controller("restaurants")
export class RestaurantsController implements OnModuleInit {
  private restaurantService!: RestaurantService;

  private readonly logger = new Logger(RestaurantsController.name);
  constructor(@Inject(ServiceGrpcEnum.RESTAURANT_GRPC) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.restaurantService = this.client.getService<RestaurantService>(
      ServiceEnum.RESTAURANT_SERVICE
    );
  }

  @Get("/")
  async list() {
    try {
      this.logger.log("Listing restaurants");
      const restaurants = await firstValueFrom(this.restaurantService.listRestaurants({}));

      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.LIST_RESTAURANTS_SUCCESS,
        data: restaurants,
      });
    } catch (error: any) {
      this.logger.error(`Failed to list restaurants: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    try {
      this.logger.log(`Finding restaurant by ID: ${id}`);
      const restaurant = await firstValueFrom(this.restaurantService.findRestaurantById({ id }));

      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.GET_RESTAURANT_SUCCESS,
        data: restaurant,
      });
    } catch (error: any) {
      this.logger.error(`Failed to find restaurant: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Post("/")
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() req: UserRequest
  ) {
    try {
      this.logger.log(`Creating restaurant: ${createRestaurantDto.name}`);
      const createRestaurantGrpcDto: CreateRestaurantGrpcDto = {
        ...createRestaurantDto,
        ownerId: req.user.sub,
      };

      const restaurant = await firstValueFrom(
        this.restaurantService.createRestaurant(createRestaurantGrpcDto)
      );

      this.logger.log(`Restaurant created with ID: ${restaurant.id}`);

      return createResponse({
        statusCode: HttpStatus.CREATED,
        message: ApiSuccessCode.CREATE_RESTAURANT_SUCCESS,
        data: restaurant,
      });
    } catch (error: any) {
      this.logger.error(`Failed to create restaurant: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Req() req: UserRequest
  ) {
    try {
      this.logger.log(`Updating restaurant ID: ${id}`);
      const updateRestaurantGrpcDto: UpdateRestaurantGrpcDto = {
        ...updateRestaurantDto,
        ownerId: req.user.sub,
        id,
      };

      const restaurant = await firstValueFrom(
        this.restaurantService.updateRestaurant(updateRestaurantGrpcDto)
      );

      this.logger.log(`Restaurant updated with ID: ${restaurant.id}`);

      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.UPDATE_RESTAURANT_SUCCESS,
        data: restaurant,
      });
    } catch (error: any) {
      this.logger.error(`Failed to update restaurant: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Post(":id/menu")
  async createMenuItem(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() createMenuItemDto: CreateMenuItemDto
  ) {
    try {
      const grpcDto: CreateMenuItemGrpcDto = { ...createMenuItemDto, restaurantId: id };

      this.logger.log(`Creating menu item for restaurant ID: ${id}`);
      const menuItem = await firstValueFrom(this.restaurantService.createMenuItem(grpcDto));

      this.logger.log(`Menu item created with ID: ${menuItem.id} for restaurant ID: ${id}`);
      return createResponse({
        statusCode: HttpStatus.CREATED,
        message: ApiSuccessCode.CREATE_MENU_ITEM_SUCCESS,
        data: menuItem,
      });
    } catch (error: any) {
      this.logger.error(`Failed to create menu item: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Get(":id/menu")
  async menu(@Param("id", ParseUUIDPipe) id: string) {
    try {
      const menus = await firstValueFrom(this.restaurantService.getMenu({ restaurantId: id }));
      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.GET_RESTAURANT_MENU_SUCCESS,
        data: menus,
      });
    } catch (error: any) {
      this.logger.error(`Failed to get restaurant menu: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Get(":id/menu/:menuId")
  async getMenuItem(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("menuId", ParseUUIDPipe) menuId: string
  ) {
    try {
      const menuItem = await firstValueFrom(
        this.restaurantService.getMenuItem({ id: menuId, restaurantId: id })
      );
      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.GET_MENU_ITEM_SUCCESS,
        data: menuItem,
      });
    } catch (error: any) {
      this.logger.error(`Failed to get menu item: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Patch(":id/menu/:menuId")
  async updateMenuItem(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("menuId", ParseUUIDPipe) menuId: string,
    @Body() updateMenuItemDto: Partial<CreateMenuItemDto>
  ) {
    try {
      const grpcDto: Partial<UpdateMenuItemGrpcDto> = {
        id: menuId,
        restaurantId: id,
        ...updateMenuItemDto,
      };
      this.logger.log(`Updating menu item ID: ${menuId} for restaurant ID: ${id}`);
      const menuItem = await firstValueFrom(this.restaurantService.updateMenuItem(grpcDto));

      this.logger.log(`Menu item updated with ID: ${menuItem.id} for restaurant ID: ${id}`);
      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.UPDATE_MENU_ITEM_SUCCESS,
        data: menuItem,
      });
    } catch (error: any) {
      this.logger.error(`Failed to update menu item: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Delete(":id/menu/:menuId")
  async deleteMenuItem(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("menuId", ParseUUIDPipe) menuId: string
  ) {
    try {
      this.logger.log(`Deleting menu item ID: ${menuId} from restaurant ID: ${id}`);
      await firstValueFrom(this.restaurantService.deleteMenuItem({ id: menuId, restaurantId: id }));

      this.logger.log(`Menu item deleted with ID: ${menuId} from restaurant ID: ${id}`);
      return createResponse({
        statusCode: HttpStatus.NO_CONTENT,
        message: ApiSuccessCode.DELETE_MENU_ITEM_SUCCESS,
      });
    } catch (error: any) {
      this.logger.error(`Failed to delete menu item: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }
}
