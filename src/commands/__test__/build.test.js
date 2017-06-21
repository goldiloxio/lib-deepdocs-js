import build from '../build';

const { handler } = build;

describe('Executing handler', () => {
  test('throws an error when a path is not provided', () => {
    expect(handler).toThrowError('Please provide source path for deepdocs');
  })

  test('it executes correctly when providing a path variable', () => {
    expect(handler({path: './src'})).toBe(undefined);
  })
});
