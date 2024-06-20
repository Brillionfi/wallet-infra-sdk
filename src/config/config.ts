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
    return ConfigSchema.parse({
      [ConfigKeys.BASE_URL]: this.getEnvVariable(ConfigKeys.BASE_URL),
      [ConfigKeys.MAX_RETRIES]: parseInt(
        this.getEnvVariable(ConfigKeys.MAX_RETRIES),
      ),
      [ConfigKeys.RETRY_DELAY]: parseInt(
        this.getEnvVariable(ConfigKeys.RETRY_DELAY),
      ),
    });
  }

  public get(key: ConfigKeys): string | number | undefined {
    return this.config[key];
  }
}

export default Config;
