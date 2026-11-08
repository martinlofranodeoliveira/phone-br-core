# phone-br-core

Brazilian phone validation and formatting: DDD allowlist, mobile/landline
shapes, E.164. Zero runtime dependencies, Node >= 22.

Part of the LOFRANO TECNOLOGIA open-source lab. MIT.

```js
import { parse } from './src/phone.mjs';
parse('(11) 98765-4321');
// { kind: 'mobile', ddd: '11', subscriber: '987654321',
//   e164: '+5511987654321', formatted: '(11) 98765-4321' }
```

```sh
npm test          # 5 tests, node:test, no dependencies
npm run demo
```

Syntactic validity only — no carrier lookup. MIT — see `LICENSE`.
Full contract in `docs/contract.md`. [Versão em português](README.pt-BR.md).
