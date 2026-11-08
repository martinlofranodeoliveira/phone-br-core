#!/usr/bin/env node
// Demo: fixed numbers, asserts expectations. --assert exits non-zero on mismatch.
import { check } from '../src/phone.mjs';

const CASES = [
  ['(11) 98765-4321', true, 'mobile'],
  ['+55 21 3456-7890', true, 'landline'],
  ['1198765432', false, 'BAD_LANDLINE'],
  ['(00) 98765-4321', false, 'BAD_DDD'],
];

let failed = 0;
for (const [input, expected, extra] of CASES) {
  const r = check(input);
  const pass = r.ok === expected && (expected ? r.kind === extra : r.code === extra);
  if (!pass) failed++;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${input} -> ${r.ok ? r.kind + ' ' + r.formatted : r.code}`);
}
if (process.argv.includes('--assert') && failed > 0) process.exit(1);
if (failed > 0) process.exitCode = 1;
console.log(failed === 0 ? 'demo: all cases as expected' : `demo: ${failed} mismatch(es)`);
