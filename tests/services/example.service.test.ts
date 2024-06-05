import { ExampleService } from '@services/example.service';
import { ExampleEndpoint } from '@api/example.api';
import { ExampleKeys, IExample } from '@models/example.models';
import { HttpClient } from '@utils/http-client';

jest.mock('@api/example.api');
jest.mock('@utils/http-client');
jest.mock('@utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('ExampleService', () => {
  let httpClient: jest.Mocked<HttpClient>;
  let exampleEndpoint: jest.Mocked<ExampleEndpoint>;
  let exampleService: ExampleService;

  beforeEach(() => {
    httpClient = new HttpClient('') as jest.Mocked<HttpClient>;
    exampleEndpoint = new ExampleEndpoint(
      httpClient,
    ) as jest.Mocked<ExampleEndpoint>;

    (ExampleEndpoint as jest.Mock<ExampleEndpoint>).mockImplementation(
      () => exampleEndpoint,
    );

    exampleService = new ExampleService(httpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createExample', () => {
    it('should create a new Example', async () => {
      const example: IExample = {
        [ExampleKeys.ID]: '1',
        [ExampleKeys.NAME]: 'name',
      };

      exampleEndpoint.createExample.mockResolvedValueOnce(example);

      const result = await exampleService.createExample(example);

      expect(exampleEndpoint.createExample).toHaveBeenCalledWith(example);
      expect(result).toEqual(example);
    });
  });

  describe('getExample', () => {
    it('should get Example by exampleId', async () => {
      const exampleId = '1';
      const example: IExample = {
        [ExampleKeys.ID]: exampleId,
        [ExampleKeys.NAME]: 'name',
      };

      exampleEndpoint.getExample.mockResolvedValueOnce(example);

      const result = await exampleService.getExample(exampleId);

      expect(exampleEndpoint.getExample).toHaveBeenCalledWith(exampleId);
      expect(result).toEqual(example);
    });
  });
});
