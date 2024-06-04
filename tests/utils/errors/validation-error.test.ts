import { ValidationError } from '@utils/errors';

describe('ValidationError', () => {
  it('should create an error with a specific message', () => {
    const message = 'This is a validation error';
    const error = new ValidationError(message);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe(message);
  });

  it('should set the name property to "ValidationError"', () => {
    const message = 'This is a validation error';
    const error = new ValidationError(message);

    expect(error.name).toBe('ValidationError');
  });

  it('should capture the stack trace', () => {
    const message = 'This is a validation error';
    const error = new ValidationError(message);

    expect(error.stack).toBeDefined();
  });

  it('should work with try-catch blocks', () => {
    const message = 'This is a validation error';

    try {
      throw new ValidationError(message);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).message).toBe(message);
      expect((error as ValidationError).name).toBe('ValidationError');
    }
  });
});
