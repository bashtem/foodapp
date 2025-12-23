import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from "class-validator";
import { CuisineType } from "../enums/cuisine.enum";

export class CreateRestaurantDto {
  @ApiProperty({
    description: "Restaurant name",
    example: "Mario's Italian Kitchen",
    type: String,
  })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    description: "Restaurant address",
    example: "123 Main Street, Downtown, City 12345",
    type: String,
  })
  @IsString()
  address!: string;

  @ApiProperty({
    description: "Restaurant phone number",
    example: "+1234567890",
    type: String,
  })
  @IsPhoneNumber()
  @MaxLength(15)
  phone!: string;

  @ApiProperty({
    description: "Restaurant latitude coordinate",
    example: 40.7128,
    type: Number,
  })
  @IsLatitude()
  lat!: number;

  @ApiProperty({
    description: "Restaurant longitude coordinate",
    example: -74.006,
    type: Number,
  })
  @IsLongitude()
  lng!: number;

  @ApiProperty({
    description: "Types of cuisines served",
    example: [CuisineType.ITALIAN, CuisineType.MEDITERRANEAN],
    enum: CuisineType,
    isArray: true,
    type: [String],
  })
  @IsArray()
  @IsEnum(CuisineType, { each: true })
  cuisines!: CuisineType[];

  @ApiProperty({
    description: "Restaurant operating hours",
    example: ["Monday: 9:00 AM - 10:00 PM", "Tuesday: 9:00 AM - 10:00 PM"],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  hours!: string[];

  @ApiProperty({
    description: "Restaurant website URL",
    example: "https://www.marios-kitchen.com",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  website?: string;

  @ApiProperty({
    description: "Restaurant description",
    example: "Authentic Italian cuisine with fresh ingredients.",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Restaurant email address",
    example: "contact@marios-kitchen.com",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: "Restaurant image URL",
    example: "https://images.example.com/restaurant.jpg",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({
    description: "Delivery area polygon coordinates (GeoJSON)",
    example: "{'type':'Polygon','coordinates':[[[0,0],[0,1],[1,1],[1,0],[0,0]]]}",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  deliveryPolygon?: string;
}

export class CreateRestaurantGrpcDto extends CreateRestaurantDto {
  @IsUUID()
  ownerId!: string;
}

export interface RestaurantResponseDto {
  id: string;
  name: string;
  address: string;
  phone: string;
  website?: string;
  description?: string;
  email?: string;
  lat: number;
  lng: number;
  ownerId: string;
  cuisines: CuisineType[];
  hours: string[];
  imageUrl?: string;
  deliveryPolygon?: string;
  isOpen: boolean;
  isActivated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateRestaurantDto {
  @ApiProperty({
    description: "Restaurant name",
    example: "Mario's Italian Kitchen",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: "Restaurant address",
    example: "123 Main Street, Downtown, City 12345",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: "Restaurant phone number",
    example: "+1234567890",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(15)
  phone?: string;

  @ApiProperty({
    description: "Restaurant latitude coordinate",
    example: 40.7128,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsLatitude()
  lat?: number;

  @ApiProperty({
    description: "Restaurant longitude coordinate",
    example: -74.006,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsLongitude()
  lng?: number;

  @ApiProperty({
    description: "Types of cuisines served",
    example: [CuisineType.ITALIAN, CuisineType.MEDITERRANEAN],
    enum: CuisineType,
    isArray: true,
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CuisineType, { each: true })
  cuisines?: CuisineType[];

  @ApiProperty({
    description: "Restaurant operating hours",
    example: ["Monday: 9:00 AM - 10:00 PM", "Tuesday: 9:00 AM - 10:00 PM"],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hours?: string[];

  @ApiProperty({
    description: "Restaurant website URL",
    example: "https://www.marios-kitchen.com",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  website?: string;

  @ApiProperty({
    description: "Restaurant description",
    example: "Authentic Italian cuisine with fresh ingredients.",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Restaurant email address",
    example: "contact@marios-kitchen.com",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: "Restaurant image URL",
    example: "https://images.example.com/restaurant.jpg",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({
    description: "Delivery area polygon coordinates (GeoJSON)",
    example: "{'type':'Polygon','coordinates':[[[0,0],[0,1],[1,1],[1,0],[0,0]]]}",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  deliveryPolygon?: string;

  @ApiProperty({
    description: "Whether the restaurant is currently open for orders",
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}

export class UpdateRestaurantGrpcDto extends UpdateRestaurantDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  ownerId!: string;
}

export class CreateMenuItemDto {
  @ApiProperty({ description: "Menu item name", example: "Margherita Pizza" })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ description: "Menu item description", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Price in main currency unit", example: 9.99 })
  @IsNumber()
  price!: number;

  @ApiProperty({ description: "Is the item available", required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({ description: "Category name", required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: "Image URL", required: false })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ description: "Preparation time in minutes", required: false })
  @IsOptional()
  preparationTime?: number;
}

export class CreateMenuItemGrpcDto extends CreateMenuItemDto {
  @IsUUID()
  restaurantId!: string;
}

export class GetMenuItemGrpcDto {
  @ApiProperty({ description: "Menu item ID", example: "550e8400-e29b-41d4-a716-446655440000" })
  @IsUUID()
  id!: string;

  @ApiProperty({ description: "Restaurant ID", example: "660e8400-e29b-41d4-a716-446655440000" })
  @IsUUID()
  restaurantId?: string;
}

export class UpdateMenuItemGrpcDto extends CreateMenuItemGrpcDto {
  @IsUUID()
  id!: string;
}

export class DeleteMenuItemGrpcDto extends GetMenuItemGrpcDto {}

export interface MenuItemResponseDto {
  id: string;
  restaurantId: string;
  name: string;
  description?: string | null;
  price: number;
  isAvailable: boolean;
  category?: string | null;
  imageUrl?: string | null;
  preparationTime: number;
  createdAt: Date;
  updatedAt: Date;
}
