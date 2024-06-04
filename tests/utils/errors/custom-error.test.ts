import { CustomError } from '@utils/errors';

describe('CustomError', () => {
  it('should create an error with a specific message', () => {
    const message = 'This is a custom error';
    const error = new CustomError(message);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe(message);
  });

  it('should set the name property to "CustomError"', () => {
    const message = 'This is a custom error';
    const error = new CustomError(message);

    expect(error.name).toBe('CustomError');
  });

  it('should capture the stack trace', () => {
    const message = 'This is a custom error';
    const error = new CustomError(message);

    expect(error.stack).toBeDefined();
  });

  it('should work with try-catch blocks', () => {
    const message = 'This is a custom error';

    try {
      throw new CustomError(message);
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
      expect((error as CustomError).message).toBe(message);
      expect((error as CustomError).name).toBe('CustomError');
    }
  });
});
