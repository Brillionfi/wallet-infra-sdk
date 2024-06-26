import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
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

  private generateIdemPotency(): void {
    this.instance.defaults.headers['X-Idempotency-Key'] = uuidv4();
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.generateIdemPotency();
    const response = await this.instance.get<T>(url, config);
    return response;
  }

  public async post<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.generateIdemPotency();
    return await this.instance.post<T>(url, data, config);
  }

  public async put<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.generateIdemPotency();
    return await this.instance.put<T>(url, data, config);
  }

  public async patch<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.generateIdemPotency();
    return await this.instance.patch<T>(url, data, config);
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.generateIdemPotency();
    return await this.instance.delete<T>(url, config);
  }
}
