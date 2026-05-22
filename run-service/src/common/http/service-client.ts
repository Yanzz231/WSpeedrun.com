import { BadGatewayException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import type { AxiosResponse } from 'axios';

export async function fetchServiceJson<T>(
  url: string,
  notFoundMessage: string,
): Promise<T> {
  let response: AxiosResponse<T>;

  try {
    response = await axios.get<T>(url, {
      timeout: Number(process.env.SERVICE_REQUEST_TIMEOUT_MS ?? 10000),
      validateStatus: () => true,
    });
  } catch {
    throw new BadGatewayException(`Unable to reach service at ${url}`);
  }

  if (response.status === 404) {
    throw new NotFoundException(notFoundMessage);
  }

  if (response.status < 200 || response.status >= 300) {
    throw new BadGatewayException(
      `Service request failed with status ${response.status}`,
    );
  }

  return response.data;
}
