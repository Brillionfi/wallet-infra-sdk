import { ExampleSchema, IExample, ExampleKeys } from '@models/example.models';

describe('ExampleSchema', () => {
  it('should validate a correct example', () => {
    const example: IExample = {
      [ExampleKeys.ID]: '1',
      [ExampleKeys.NAME]: 'Example Name',
    };

    expect(() => ExampleSchema.parse(example)).not.toThrow();
  });

  it('should allow id to be optional', () => {
    const example: IExample = {
      [ExampleKeys.NAME]: 'Example Name',
    };

    expect(() => ExampleSchema.parse(example)).not.toThrow();
  });

  it('should throw an error if name is missing', () => {
    const example = {
      [ExampleKeys.ID]: '1',
    };

    expect(() => ExampleSchema.parse(example)).toThrow();
  });

  it('should throw an error if name is not a string', () => {
    const example = {
      [ExampleKeys.ID]: '1',
      [ExampleKeys.NAME]: 123,
    };

    expect(() => ExampleSchema.parse(example)).toThrow();
  });

  it('should throw an error if id is not a string', () => {
    const example = {
      [ExampleKeys.ID]: 123,
      [ExampleKeys.NAME]: 'Example Name',
    };

    expect(() => ExampleSchema.parse(example)).toThrow();
  });
});
