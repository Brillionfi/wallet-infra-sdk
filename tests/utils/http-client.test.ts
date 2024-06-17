import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { Config } from '@config/index';
import { HttpClient } from '@utils/index';

jest.mock('@config/index');
jest.mock('@utils/logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('HttpClient', () => {
  let mockAxios: AxiosMockAdapter;
  let httpClient: HttpClient;
  let config: jest.Mocked<Config>;

  beforeEach(() => {
    mockAxios = new AxiosMockAdapter(axios);

    config = new Config() as jest.Mocked<Config>;
    (Config as jest.Mock<Config>).mockImplementation(() => config);
    config.get = jest.fn().mockReturnValue('http://mocked_base_url');

    httpClient = new HttpClient('mocked_jwt_token');
  });

  afterEach(() => {
    mockAxios.restore();
    jest.clearAllMocks();
  });

  it('should make a GET request successfully', async () => {
    const url = '/test-get';
    const mockResponse = { data: 'test data' };

    mockAxios.onGet('http://mocked_base_url/test-get').reply(200, mockResponse);

    const response = await httpClient.get(url);

    expect(response.data).toEqual(mockResponse);
    expect(response.status).toBe(200);
  });

  it('should make a POST request successfully', async () => {
    const url = '/test-post';
    const mockData = { key: 'value' };
    const mockResponse = { data: 'test data' };

    mockAxios
      .onPost('http://mocked_base_url/test-post', mockData)
      .reply(200, mockResponse);

    const response = await httpClient.post(url, mockData);

    expect(response.data).toEqual(mockResponse);
    expect(response.status).toBe(200);
  });

  it('should make a PUT request successfully', async () => {
    const url = '/test-put';
    const mockData = { key: 'value' };
    const mockResponse = { data: 'test data' };

    mockAxios
      .onPut('http://mocked_base_url/test-put', mockData)
      .reply(200, mockResponse);

    const response = await httpClient.put(url, mockData);

    expect(response.data).toEqual(mockResponse);
    expect(response.status).toBe(200);
  });

  it('should make a PATCH request', async () => {
    const url = '/test-patch';
    const mockData = { name: 'example' };
    const mockResponse = { message: 'success' };

    mockAxios
      .onPatch('http://mocked_base_url/test-patch', mockData)
      .reply(200, mockResponse);

    const response = await httpClient.patch(url, mockData);

    expect(response.data).toEqual(mockResponse);
    expect(response.status).toBe(200);
  });

  it('should make a DELETE request successfully', async () => {
    const url = '/test-delete';
    const mockResponse = { data: 'test data' };

    mockAxios
      .onDelete('http://mocked_base_url/test-delete')
      .reply(200, mockResponse);

    const response = await httpClient.delete(url);

    expect(response.data).toEqual(mockResponse);
    expect(response.status).toBe(200);
  });

  it('should handle errors correctly', async () => {
    const url = '/test-error';
    mockAxios.onGet('http://mocked_base_url/test-error').reply(500);

    await expect(httpClient.get(url)).rejects.toThrow();
  });

  it('should include the JWT token in the Authorization header', async () => {
    const url = '/test-get';
    const mockResponse = { data: 'test data' };

    mockAxios.onGet('http://mocked_base_url/test-get').reply(200, mockResponse);

    const response = await httpClient.get(url);

    expect(response.config.headers.Authorization).toBe(
      'Bearer mocked_jwt_token',
    );
  });

  it('should include an idempotency key in the headers', async () => {
    const url = '/test-get';
    const mockResponse = { data: 'test data' };

    mockAxios.onGet('http://mocked_base_url/test-get').reply(200, mockResponse);

    const response = await httpClient.get(url);

    expect(response.config.headers['X-Idempotency-Key']).toBeDefined();
  });
});
