import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import logger from './logger';
import { v4 as uuidv4 } from 'uuid';

export class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string, jwt?: string) {
    logger.debug(`BASE_URL: ${baseURL}`);

    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
        'X-Idempotency-Key': uuidv4(),
      },
    });

    this.initializeResponseInterceptor();
  }

  private initializeResponseInterceptor() {
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError,
    );
  }

  private handleResponse(response: AxiosResponse) {
    return response;
  }

  private handleError(error: AxiosError) {
    return Promise.reject(error);
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const response = await this.instance.get<T>(url, config);
    return response;
  }

  public post<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public put<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}
