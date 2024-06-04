import dotenv from 'dotenv';
import { ConfigKeys, Config } from '@config/index';

jest.mock('dotenv');
dotenv.config = jest.fn();

describe('Configuration Tests', () => {
  let config: Config;

  beforeEach(() => {
    jest.resetModules();
  });

  it('should load the base URL from environment variables', async () => {
    process.env[ConfigKeys.BASE_URL] = 'https://api.test.com';
    config = new Config();
    expect(config.get(ConfigKeys.BASE_URL)).toBe('https://api.test.com');
  });

  it('should throw an error if BASE_URL is not set', async () => {
    delete process.env[ConfigKeys.BASE_URL];
    expect(() => {
      config = new Config();
    }).toThrowError(/Environment variable BASE_URL is not set/);
  });

  it('should throw an error if BASE_URL is not a valid URL', () => {
    process.env[ConfigKeys.BASE_URL] = 'invalid-url';
    expect(() => {
      config = new Config();
    }).toThrowError(/Invalid url/);
  });
});
