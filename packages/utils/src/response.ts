export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export const StatusCodeDescription: Record<StatusCode, string> = {
  [StatusCode.OK]: "OK",
  [StatusCode.CREATED]: "Created",
  [StatusCode.NO_CONTENT]: "No Content",
  [StatusCode.BAD_REQUEST]: "Bad Request",
  [StatusCode.UNAUTHORIZED]: "Unauthorized",
  [StatusCode.FORBIDDEN]: "Forbidden",
  [StatusCode.NOT_FOUND]: "Not Found",
  [StatusCode.CONFLICT]: "Conflict",
  [StatusCode.UNPROCESSABLE_ENTITY]: "Unprocessable Entity",
  [StatusCode.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};

export enum ApiSuccessCode {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  VERIFY_SUCCESS = "VERIFY_SUCCESS",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  // Add more as needed
}

export enum ApiErrorCode {
  LOGIN_FAILED = "LOGIN_FAILED",
  VERIFY_FAILED = "VERIFY_FAILED",
  REGISTER_FAILED = "REGISTER_FAILED",
  // Add more as needed
}

export interface ApiResponse<T = any> {
  status: {
    code: StatusCode;
    description: string;
  };
  message: string;
  data?: T;
  error?: {
    code?: string | number;
    message?: string;
    details?: any;
  };
}

export interface CreateResponseParams<T = any> {
  code: StatusCode;
  message: string;
  data?: T;
  description?: string;
  error?: {
    code?: string | number;
    message?: string;
    details?: any;
  };
}

export function createResponse<T = any>(
  params: CreateResponseParams<T>
): ApiResponse<T> {
  const { code, message, data, description, error } = params;
  const response: ApiResponse<T> = {
    status: {
      code: code || StatusCode.INTERNAL_SERVER_ERROR,
      description: description || StatusCodeDescription[code] || "Unknown",
    },
    message,
    ...(data !== undefined ? { data } : {}),
  };
  if (error) {
    response.error = error;
  }
  return response;
}
