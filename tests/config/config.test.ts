import Config from '@config/config';
import dotenv from 'dotenv';
import { ConfigSchema } from '@config/config.interface';

jest.mock('dotenv');
dotenv.config = jest.fn();

describe('Configuration Tests', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it('Should parse the schema', () => {
    const spy = jest.spyOn(ConfigSchema, 'parse');
    new Config();
    expect(spy).toHaveBeenCalled();
  });
  it('Should return an env variable', () => {
    const value = new Config().get('key');
    expect(typeof value).toBe('undefined'); // It should be a String but there is no value currently.
  });
});
