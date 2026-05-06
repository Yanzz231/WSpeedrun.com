import { BadGatewayException, HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, Method } from 'axios';

@Injectable()
export class GatewayHttpService {
  async request<T = unknown>(
    baseUrl: string,
    path: string,
    method: Method = 'GET',
    data?: unknown,
    authorization?: string,
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url: `${baseUrl}${path}`,
      data,
      headers: authorization ? { authorization } : undefined,
    };

    try {
      const response = await axios.request<T>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }

      throw new BadGatewayException(`Unable to reach service at ${baseUrl}`);
    }
  }
}
