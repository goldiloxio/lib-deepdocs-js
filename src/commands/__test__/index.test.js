import index from '../index';

describe('Exposes the correct keys to the expeced functions', () => {
  test('it contains only one key', () => {
    const totalKeys = Object.keys(index);
    expect(totalKeys).toHaveLength(1);
  });

  test('it contains a build key', () => {
    expect(index).toHaveProperty('build');
  });
});
