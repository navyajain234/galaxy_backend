import { Unkey } from '@unkey/api';
type req = Parameters<Unkey['keys']['verifyKey']>[0];
type res = Awaited<ReturnType<Unkey['keys']['verifyKey']>>;
import * as fs from 'fs';
fs.writeFileSync('unkey-types.txt', 'Check types in IDE');
