import { padStart, padEnd } from '../src/utils';

describe('#padStart', () => {
  it('should works.', () => {
    expect(padStart('abc', 5, '0')).toEqual('00abc');
    expect(padStart('abcdef', 4, '0')).toEqual('abcdef');
    expect(padStart('abc', 10, '123')).toEqual('1231231abc');
  });
});

describe('#padEnd', () => {
  it('should works.', () => {
    expect(padEnd('abc', 5, '0')).toEqual('abc00');
    expect(padEnd('abcdef', 4, '0')).toEqual('abcdef');
    expect(padEnd('abc', 10, '123')).toEqual('abc1231231');
  });
});
