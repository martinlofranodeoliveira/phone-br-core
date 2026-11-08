import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parse, check, normalize, PhoneError } from '../src/phone.mjs';

describe('mobile', () => {
  it('accepts formatted, international and plain mobile', () => {
    assert.deepEqual(parse('(11) 98765-4321'), {
      kind: 'mobile', ddd: '11', subscriber: '987654321',
      e164: '+5511987654321', formatted: '(11) 98765-4321',
    });
    assert.equal(parse('+55 21 97654-3210').e164, '+5521976543210');
    assert.equal(parse('005531987654321').kind, 'mobile');
  });
  it('rejects bad mobile lead and short numbers', () => {
    assert.equal(check('1198765432').code, 'BAD_LANDLINE'); // 10 digits starting with 9
    assert.equal(check('(11) 94765-4321').code, 'BAD_MOBILE');
    assert.equal(check('(11) 98765-432').code, 'BAD_LANDLINE'); // 10 digits, mobile lead
  });
});

describe('landline', () => {
  it('accepts 10-digit numbers', () => {
    const r = parse('(21) 3456-7890');
    assert.equal(r.kind, 'landline');
    assert.equal(r.formatted, '(21) 3456-7890');
    assert.equal(r.e164, '+552134567890');
  });
  it('rejects wrong lead digits', () => {
    assert.equal(check('(21) 1456-7890').code, 'BAD_LANDLINE');
    assert.equal(check('(21) 9456-7890').code, 'BAD_LANDLINE');
  });
});

describe('bounds', () => {
  it('rejects bad DDD, empties and non-strings', () => {
    assert.equal(check('(00) 98765-4321').code, 'BAD_DDD');
    assert.equal(check('(10) 3456-7890').code, 'BAD_DDD');
    assert.equal(check('   ').code, 'EMPTY');
    assert.throws(() => parse(42), (e) => e.code === 'NOT_STRING');
    assert.equal(normalize('+55 (11) 98765-4321'), '11987654321');
    assert.ok(new PhoneError('X') instanceof Error);
  });
});
