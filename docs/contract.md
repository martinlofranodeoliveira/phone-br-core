# Contract — phone-br-core

Pure ESM in `src/phone.mjs`, zero runtime dependencies, Node >= 22.
Optional `+55`/`0055` prefix stripped; all 67 ANATEL DDD codes allowlisted.

| Export | Result |
| --- | --- |
| `normalize(input)` | Digits with country prefix removed. |
| `parse(input)` | `{ kind, ddd, subscriber, e164, formatted }`. Mobile: DDD + `9[5-9]` + 7 digits. Landline: DDD + `[2-5]` + 7 digits. |
| `check(input)` | `{ ok:true, ... }` or `{ ok:false, code }`. |

A 10-digit number starting with 9 fails as `BAD_LANDLINE` (truncated
mobile), never silently repaired. Formatting is national `(DD) NNNNN-NNNN`
/ `(DD) NNNN-NNNN` plus `+55` E.164.

Errors: `NOT_STRING` · `EMPTY` · `BAD_CHARS` · `BAD_LENGTH` · `BAD_DDD` ·
`BAD_MOBILE` · `BAD_LANDLINE`.
