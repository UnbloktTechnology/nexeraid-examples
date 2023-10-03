import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { useMemo } from 'react';

import ABI from '../abis/SimpleWhitelist.json';

const address = '0x4BAcFD67F584b497823Da979ecCa4750f5fDC743';

const useSimpleWhitelistContract = (provider: JsonRpcProvider | undefined) => {
  return useMemo(() => provider && new Contract(address, ABI, provider), [provider]);
};

export default useSimpleWhitelistContract;
