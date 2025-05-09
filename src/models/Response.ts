import { AxiosError, AxiosResponse } from "axios";

export interface APIRes {
  status: number;
  message: string;
}

export interface ResponseSuccess<T = undefined> extends APIRes {
  data: T;
}

export interface ResponseFail extends AxiosError {
  response?: AxiosResponse<APIRes>;
}
