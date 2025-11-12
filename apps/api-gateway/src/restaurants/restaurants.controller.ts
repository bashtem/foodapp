import {
  CreateRestaurantDto,
  CreateRestaurantGrpcDto,
  UpdateRestaurantDto,
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
  UseGuards,
  Patch,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { AuthGuard } from "../auth/auth.guard";
import { ServiceEnum, ServiceGrpcEnum } from "@foodapp/utils/src/enums";
import { UpdateRestaurantGrpcDto } from "@foodapp/utils/src/dto/restaurant.dto";

@UseGuards(AuthGuard)
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
      const restaurant = await firstValueFrom(this.restaurantService.listRestaurants({}));

      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.LIST_RESTAURANTS_SUCCESS,
        data: restaurant.list,
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

  @Get(":id/menu")
  async menu(@Param("id", ParseUUIDPipe) id: string) {
    try {
      const menu = await firstValueFrom(this.restaurantService.getMenu({ restaurantId: id }));
      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.GET_RESTAURANT_SUCCESS,
        data: menu,
      });
    } catch (error: any) {
      this.logger.error(`Failed to get restaurant menu: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto, @Req() req: UserRequest) {
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
}
