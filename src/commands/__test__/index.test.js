import index from '../index';

describe('Exposes the correct keys to the expeced functions', function includeAllKeys() {
  test('it contains a build key', function hasBuildKey() {
    expect(index).toHaveProperty('build');
  });
});
