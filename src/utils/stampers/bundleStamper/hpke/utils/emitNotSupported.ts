import { NotSupportedError } from '../errors';

export function emitNotSupported<T>(): Promise<T> {
  return new Promise((_resolve, reject) => {
    reject(new NotSupportedError('Not supported'));
  });
}
