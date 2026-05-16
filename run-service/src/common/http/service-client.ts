import { BadGatewayException, NotFoundException } from '@nestjs/common';

export async function fetchServiceJson<T>(
  url: string,
  notFoundMessage: string,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new BadGatewayException(`Unable to reach service at ${url}`);
  }

  if (response.status === 404) {
    throw new NotFoundException(notFoundMessage);
  }

  if (!response.ok) {
    throw new BadGatewayException(
      `Service request failed with status ${response.status}`,
    );
  }

  return (await response.json()) as T;
}
