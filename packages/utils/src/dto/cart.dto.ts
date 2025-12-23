import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, Min } from "class-validator";

export class AddCartItemDto {
  @ApiProperty({ description: "Menu item ID", example: "menu_456", type: String })
  @IsString()
  @IsNotEmpty()
  menuItemId!: string;

  @ApiProperty({ description: "Quantity to add", example: 2, type: Number, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class AddCartGrpcDto extends AddCartItemDto {
  @ApiProperty({ description: "User ID", example: "user_123", type: String })
  @IsString()
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
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ description: "Cart item ID to remove", example: "item_abc", type: String })
  @IsString()
  @IsNotEmpty()
  itemId!: string;
}

export interface CartItemDto {
  name?: string;
  menuItemId: string;
  restaurantId: string;
  quantity: number;
  priceSnapshot?: number;
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
  orderId: string;
  amountPaid: number;
  currency?: string;
}
