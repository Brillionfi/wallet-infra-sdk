import axios, { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { HttpClient } from '@utils/http-client';

describe('HttpClient', () => {
  let httpClient: HttpClient;
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    httpClient = new HttpClient('http://example.com');
  });

  afterEach(() => {
    mock.reset();
  });

  it('should make a GET request', async () => {
    const data = { message: 'success' };
    mock.onGet('http://example.com/test').reply(200, data);

    const response = await httpClient.get('/test');

    expect(response.status).toBe(200);
    expect(response.data).toEqual(data);
  });

  it('should make a POST request', async () => {
    const data = { message: 'success' };
    const postData = { name: 'example' };
    mock.onPost('http://example.com/test', postData).reply(200, data);

    const response = await httpClient.post('/test', postData);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(data);
  });

  it('should make a PUT request', async () => {
    const data = { message: 'success' };
    const putData = { name: 'example' };
    mock.onPut('http://example.com/test', putData).reply(200, data);

    const response = await httpClient.put('/test', putData);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(data);
  });

  it('should make a DELETE request', async () => {
    const data = { message: 'success' };
    mock.onDelete('http://example.com/test').reply(200, data);

    const response = await httpClient.delete('/test');

    expect(response.status).toBe(200);
    expect(response.data).toEqual(data);
  });

  it('should handle an error response', async () => {
    mock.onGet('http://example.com/test').reply(500);

    await expect(httpClient.get('/test')).rejects.toThrow(AxiosError);
  });
});
