import index from '../index';

describe('Exposes the correct keys to the expeced functions', () => {
  test('it contains a build key', () => {
    expect(index).toHaveProperty('build');
  });
});
