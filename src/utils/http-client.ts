import { Config, ConfigKeys } from '@config/index';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class HttpClient {
  private config: Config;
  private baseURL: string;
  private instance: AxiosInstance;

  constructor() {
    this.config = new Config();
    this.baseURL = this.config.get(ConfigKeys.BASE_URL);
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.initializeResponseInterceptor();
  }

  public authorize(jwt: string) {
    this.instance.defaults.headers.Authorization = `Bearer ${jwt}`;
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

  private renewIdemPotency(): void {
    this.instance.defaults.headers['X-Idempotency-Key'] = uuidv4();
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.renewIdemPotency();
    const response = await this.instance.get<T>(url, config);
    return response;
  }

  public async post<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.renewIdemPotency();
    return await this.instance.post<T>(url, data, config);
  }

  public async put<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.renewIdemPotency();
    return await this.instance.put<T>(url, data, config);
  }

  public async patch<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.renewIdemPotency();
    return await this.instance.patch<T>(url, data, config);
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.renewIdemPotency();
    return await this.instance.delete<T>(url, config);
  }
}
