import { Observable } from "rxjs";
import {
  CreateRestaurantGrpcDto,
  RestaurantResponseDto,
  UpdateRestaurantGrpcDto,
  CreateMenuItemGrpcDto,
  MenuItemResponseDto,
  UpdateMenuItemGrpcDto,
  GetMenuItemGrpcDto,
  DeleteMenuItemGrpcDto,
} from "../dto";

export interface RestaurantService {
  createRestaurant(dto: CreateRestaurantGrpcDto): Observable<RestaurantResponseDto>;
  listRestaurants(dto: any): Observable<{ records: RestaurantResponseDto[] }>;
  findRestaurantById(dto: { id: string }): Observable<RestaurantResponseDto>;
  updateRestaurant(dto: UpdateRestaurantGrpcDto): Observable<RestaurantResponseDto>;
  createMenuItem(dto: CreateMenuItemGrpcDto): Observable<MenuItemResponseDto>;
  getMenu(dto: { restaurantId: string }): Observable<{ records: MenuItemResponseDto[] }>;
  getMenuItem(dto: GetMenuItemGrpcDto): Observable<MenuItemResponseDto>;
  updateMenuItem(dto: Partial<UpdateMenuItemGrpcDto>): Observable<MenuItemResponseDto>;
  deleteMenuItem(dto: DeleteMenuItemGrpcDto): Observable<boolean>;
}
