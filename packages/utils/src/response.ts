import { HttpStatus } from "@nestjs/common";
import { status as GrpcStatus } from "@grpc/grpc-js";

export const StatusCodeDescription: Record<number, string> = {
  [HttpStatus.OK]: "OK",
  [HttpStatus.CREATED]: "Created",
  [HttpStatus.NO_CONTENT]: "No Content",
  [HttpStatus.BAD_REQUEST]: "Bad Request",
  [HttpStatus.UNAUTHORIZED]: "Unauthorized",
  [HttpStatus.FORBIDDEN]: "Forbidden",
  [HttpStatus.NOT_FOUND]: "Not Found",
  [HttpStatus.CONFLICT]: "Conflict",
  [HttpStatus.UNPROCESSABLE_ENTITY]: "Unprocessable Entity",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};

export interface ApiResponse<T = any> {
  statusCode: HttpStatus;
  description?: string;
  message: string | string[];
  data?: T;
  error?: string | number;
}

export interface CreateResponseParams<T = any> {
  statusCode: HttpStatus;
  message: string | string[];
  data?: T;
  description?: string;
  error?: string | number;
}

export function createResponse<T = any>(params: CreateResponseParams<T>): ApiResponse<T> {
  const { statusCode, message, data, description, error } = params;
  const response: ApiResponse<T> = {
    statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    description: description || StatusCodeDescription[statusCode] || "Unknown",
    message,
  };
  if (data) response.data = data;
  if (error) response.error = error;
  return response;
}

export const grpcToHttpStatusMap: Record<number, number> = {
  [GrpcStatus.OK]: HttpStatus.OK,
  [GrpcStatus.CANCELLED]: HttpStatus.BAD_REQUEST,
  [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
  [GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
  [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [GrpcStatus.ALREADY_EXISTS]: HttpStatus.BAD_REQUEST,
  [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
  [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
  [GrpcStatus.ABORTED]: HttpStatus.CONFLICT,
  [GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
  [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
  [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};

export enum ApiSuccessCode {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  VERIFY_SUCCESS = "VERIFY_SUCCESS",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  REFRESH_SUCCESS = "REFRESH_SUCCESS",
  GET_USER_SUCCESS = "GET_USER_SUCCESS",
  UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS",
  CREATE_RESTAURANT_SUCCESS = "CREATE_RESTAURANT_SUCCESS",
  UPDATE_RESTAURANT_SUCCESS = "UPDATE_RESTAURANT_SUCCESS",
  DELETE_RESTAURANT_SUCCESS = "DELETE_RESTAURANT_SUCCESS",
  LIST_RESTAURANTS_SUCCESS = "LIST_RESTAURANTS_SUCCESS",
  CREATE_MENU_ITEM_SUCCESS = "CREATE_MENU_ITEM_SUCCESS",
  GET_MENU_ITEM_SUCCESS = "GET_MENU_ITEM_SUCCESS",
  UPDATE_MENU_ITEM_SUCCESS = "UPDATE_MENU_ITEM_SUCCESS",
  DELETE_MENU_ITEM_SUCCESS = "DELETE_MENU_ITEM_SUCCESS",
  GET_RESTAURANT_SUCCESS = "GET_RESTAURANT_SUCCESS",
  GET_RESTAURANT_MENU_SUCCESS = "GET_RESTAURANT_MENU_SUCCESS",
  // Add more as needed
}

export enum ApiErrorCode {
  LOGIN_FAILED = "LOGIN_FAILED",
  VERIFY_FAILED = "VERIFY_FAILED",
  REGISTER_FAILED = "REGISTER_FAILED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  EMAIL_ALREADY_IN_USE = "EMAIL_ALREADY_IN_USE",
  PHONE_ALREADY_IN_USE = "PHONE_ALREADY_IN_USE",
  INVALID_TOKEN = "INVALID_TOKEN",
  INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN",
  MISSING_AUTH_TOKEN = "MISSING_AUTH_TOKEN",
  RESTAURANT_NAME_ALREADY_EXISTS = "RESTAURANT_NAME_ALREADY_EXISTS",
  RESTAURANT_NOT_FOUND = "RESTAURANT_NOT_FOUND",
  MENU_ITEM_NOT_FOUND = "MENU_ITEM_NOT_FOUND",
  INVALID_ID = "INVALID_ID",
  // Add more as needed
}
