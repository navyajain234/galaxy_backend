import { Unkey } from '@unkey/api';
type _req = Parameters<Unkey['keys']['verifyKey']>[0];
type _res = Awaited<ReturnType<Unkey['keys']['verifyKey']>>;
import * as fs from 'fs';
fs.writeFileSync('unkey-types.txt', 'Check types in IDE');
