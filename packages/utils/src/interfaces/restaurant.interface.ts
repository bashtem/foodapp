import { Observable } from "rxjs";
import { CreateRestaurantGrpcDto, RestaurantResponseDto, UpdateRestaurantGrpcDto } from "../dto";

export interface RestaurantService {
  createRestaurant(dto: CreateRestaurantGrpcDto): Observable<RestaurantResponseDto>;
  listRestaurants(data: any): Observable<{ list: RestaurantResponseDto[] }>;
  findRestaurantById(data: { id: string }): Observable<RestaurantResponseDto>;
  getMenu(data: { restaurantId: string }): Observable<any>;
  updateRestaurant(dto: UpdateRestaurantGrpcDto): Observable<RestaurantResponseDto>;
}
