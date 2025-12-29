import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min, IsUUID } from "class-validator";

export class AddCartItemDto {
  @ApiProperty({ description: "Menu item ID", example: "menu_456", type: String })
  @IsUUID()
  @IsNotEmpty()
  menuItemId!: string;

  @ApiProperty({ description: "Quantity to add", example: 2, type: Number, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class AddCartGrpcDto extends AddCartItemDto {
  @ApiProperty({ description: "User ID", example: "user_123", type: String })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}

export class UpdateCartItemDto {
  @ApiProperty({ description: "Quantity to add", example: 2, type: Number, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class UpdateCartGrpcDto extends AddCartGrpcDto {}

export class RemoveCartItemDto {
  @ApiProperty({ description: "User ID", example: "user_123", type: String })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ description: "Cart item ID to remove", example: "item_abc", type: String })
  @IsUUID()
  @IsNotEmpty()
  menuItemId!: string;
}

export class CheckoutDto {
  @ApiProperty({ description: "Restaurant ID", example: "rest_789", type: String, required: false })
  @IsUUID()
  @IsNotEmpty()
  restaurantId?: string;
}

export class CheckoutGrpcDto extends CheckoutDto {
  @ApiProperty({ description: "User ID", example: "user_123", type: String })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}

export interface CartItemDto {
  name: string;
  menuItemId: string;
  restaurantId: string;
  quantity: number;
  priceSnapshot: number;
  isAvailable: boolean;
}

export interface CartDto {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItemDto[];
  totalPrice: number;
  currency?: string;
  updatedAt?: Date;
}

export interface CheckoutResponseDto {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  currency?: string;
  isAvailable: boolean;
}

export interface CheckoutResultDto {
  orderItems: CheckoutResponseDto[];
  totalPrice: number;
  cartId: string;
}
