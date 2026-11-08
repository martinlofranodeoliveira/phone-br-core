# Design — phone-br-core

Length first (10 landline, 11 mobile), then DDD allowlist, then lead-digit
shape. Order matters: a truncated mobile reports `BAD_LANDLINE` because
that is the branch it entered — honest about what was checked. `0055` and
`+55` prefixes are stripped only when the remaining length is phone-like,
so a stray `55` inside the number is never eaten.

Oracle: real-format São Paulo/Rio numbers, every invalid branch pinned,
plus formatting round-trips. No carrier lookup: syntactic validity only.
