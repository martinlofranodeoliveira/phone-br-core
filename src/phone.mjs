// SPDX-License-Identifier: MIT
// Brazilian phone validation and formatting: DDD allowlist, landline
// (10 digits, [2-5] lead) and mobile (11 digits, 9 + [5-9] lead) shapes,
// E.164 and national formatting. No network, no I/O.

export class PhoneError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'PhoneError';
    this.code = code;
  }
}

// All 67 ANATEL DDD codes.
const DDD = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 98, 99,
]);

/** Strip to digits, removing an optional +55 / 0055 country prefix. */
export function normalize(input) {
  if (typeof input !== 'string') throw new PhoneError('NOT_STRING');
  let d = input.replace(/\D/g, '');
  if (d.length === 0) throw new PhoneError('EMPTY');
  if (d.startsWith('0055')) d = d.slice(4);
  else if (d.startsWith('55') && (d.length === 12 || d.length === 13)) d = d.slice(2);
  return d;
}

/**
 * Validate. Returns { kind: 'mobile'|'landline', ddd, subscriber, e164, formatted }.
 * Mobile: DDD + 9 + [5-9] + 7 digits. Landline: DDD + [2-5] + 7 digits.
 */
export function parse(input) {
  const d = normalize(input);
  if (!/^[0-9]+$/.test(d)) throw new PhoneError('BAD_CHARS');
  if (d.length !== 10 && d.length !== 11) throw new PhoneError('BAD_LENGTH');
  const ddd = Number(d.slice(0, 2));
  if (!DDD.has(ddd)) throw new PhoneError('BAD_DDD');
  const sub = d.slice(2);
  let kind;
  if (d.length === 11) {
    if (!/^9[5-9][0-9]{7}$/.test(sub)) throw new PhoneError('BAD_MOBILE');
    kind = 'mobile';
  } else {
    if (!/^[2-5][0-9]{7}$/.test(sub)) throw new PhoneError('BAD_LANDLINE');
    kind = 'landline';
  }
  const formatted = kind === 'mobile'
    ? `(${d.slice(0, 2)}) ${sub.slice(0, 5)}-${sub.slice(5)}`
    : `(${d.slice(0, 2)}) ${sub.slice(0, 4)}-${sub.slice(4)}`;
  return { kind, ddd: d.slice(0, 2), subscriber: sub, e164: `+55${d}`, formatted };
}

/** Non-throwing: { ok:true, ... } or { ok:false, code }. */
export function check(input) {
  try {
    return { ok: true, ...parse(input) };
  } catch (err) {
    if (err instanceof PhoneError) return { ok: false, code: err.code };
    throw err;
  }
}
