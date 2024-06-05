import { ExampleEndpoint } from '@api/example.api';
import { HttpClient } from '@utils/http-client';
import { IExample } from '@models/example.models';
import logger from '@utils/logger';

// Mock the HttpClient class
jest.mock('@utils/http-client');

// Mock the logger
jest.mock('@utils/logger', () => ({
  info: jest.fn(),
}));

describe('ExampleEndpoint', () => {
  let exampleEndpoint: ExampleEndpoint;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = new HttpClient('') as jest.Mocked<HttpClient>;
    exampleEndpoint = new ExampleEndpoint(httpClientMock);
  });

  it('should call post on HttpClient when createExample is called', async () => {
    const example: IExample = { name: 'name' };
    httpClientMock.post = jest
      .fn()
      .mockResolvedValue({ data: { ...example, id: '1' } });

    const result = await exampleEndpoint.createExample(example);

    expect(logger.info).toHaveBeenCalledWith('Creating example');
    expect(httpClientMock.post).toHaveBeenCalledWith('/examples', example);
    expect(result).toEqual({ ...example, id: '1' });
  });

  it('should call get on HttpClient when getExample is called', async () => {
    const example: IExample = { id: '1', name: 'name' };
    httpClientMock.get = jest.fn().mockResolvedValue({ data: example });

    const result = await exampleEndpoint.getExample('1');

    expect(logger.info).toHaveBeenCalledWith('Getting example');
    expect(httpClientMock.get).toHaveBeenCalledWith('/examples/1');
    expect(result).toEqual(example);
  });
});
