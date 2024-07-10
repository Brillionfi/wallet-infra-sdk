import dotenv from 'dotenv';
import { ConfigKeys, ConfigSchema, IConfig } from './config.interface';

dotenv.config();

class Config {
  private config: IConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private getEnvVariable(key: ConfigKeys): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
  }

  private loadConfig(): IConfig {
    const variablesList = Object.keys(ConfigSchema.shape);
    return ConfigSchema.parse({
      ...variablesList.map((key) => ({
        [key]: this.getEnvVariable(key as unknown as ConfigKeys),
      })),
    });
  }

  // The type of 'key' should be 'ConfigKeys' here, however
  // it creates a TS issue because we don't have a value there now.
  public get(key: string): string {
    return (this.config as never)[key];
  }
}

export default Config;
