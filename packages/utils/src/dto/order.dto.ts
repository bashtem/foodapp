import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID, IsString, IsEnum } from "class-validator";
import { DeliveryMethod, PaymentMethod, PaymentProvider } from "../enums";

export interface OrderDetailsDto {
  orderId: string;
  amountPaid: number;
  currency?: string;
  deliveryFee?: number;
  taxAmount?: number;
  discountAmount?: number;
  serviceChargeAmount?: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: "Customer ID", example: "user_123", type: String })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ description: "Restaurant ID", example: "rest_456", type: String })
  @IsUUID()
  @IsNotEmpty()
  cartId!: string;

  @ApiProperty({
    description: "Payment provider",
    example: "stripe",
    enum: PaymentProvider,
    required: true,
  })
  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  paymentProvider!: string;

  @ApiProperty({ description: "Currency (ISO code)", example: "NGN", required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: "Delivery address", example: "123 Main St, City", required: true })
  @IsString()
  @IsNotEmpty()
  deliveryAddress!: string;

  @ApiProperty({
    description: "Delivery method",
    example: "delivery",
    enum: DeliveryMethod,
    required: true,
  })
  @IsEnum(DeliveryMethod)
  @IsNotEmpty()
  deliveryMethod!: string;

  @ApiProperty({
    description: "Delivery instructions",
    example: "Leave at the front door",
    required: false,
  })
  @IsString()
  @IsOptional()
  deliveryInstructions?: string;

  @ApiProperty({
    description: "Restaurant message",
    example: "Please call when arriving",
    required: false,
  })
  @IsString()
  @IsOptional()
  restaurantMessage?: string;

  @ApiProperty({
    description: "Courier message",
    example: "Courier will call upon arrival",
    required: false,
  })
  @IsString()
  @IsOptional()
  courierMessage?: string;

  @ApiProperty({
    description: "Payment method",
    example: "card",
    enum: PaymentMethod,
    required: true,
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: string;
}
