import { NotFoundError } from '@utils/errors';

describe('NotFoundError', () => {
  it('should create an error with a specific message', () => {
    const message = 'Resource not found';
    const error = new NotFoundError(message);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.message).toBe(message);
  });

  it('should set the name property to "NotFoundError"', () => {
    const message = 'Resource not found';
    const error = new NotFoundError(message);

    expect(error.name).toBe('NotFoundError');
  });

  it('should capture the stack trace', () => {
    const message = 'Resource not found';
    const error = new NotFoundError(message);

    expect(error.stack).toBeDefined();
  });

  it('should work with try-catch blocks', () => {
    const message = 'Resource not found';

    try {
      throw new NotFoundError(message);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect((error as NotFoundError).message).toBe(message);
      expect((error as NotFoundError).name).toBe('NotFoundError');
    }
  });
});
