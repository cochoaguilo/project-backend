import { HttpResponse } from "./httpresponse.interface";

export function buildSuccessResponse<T>(data: T): HttpResponse {
  return {
    status: 'success',
    success: true,
    data,
  };
}
