import build from '../build';

const { handler } = build;

describe('Executing handler', function executeHandler() {
  test('throws an error when a path is not provided', function noPathError() {
    expect(handler).toThrowError('Please provide source path for deepdocs');
  });

  test('it executes correctly when providing a path variable', function pathIsPresent() {
    expect(handler({ path: './src' })).toBe(undefined);
  });
});
