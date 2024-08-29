import { env } from "@/env.mjs";
import { _setInternalConfig as _setInternalConfigReact } from "@nexeraid/react-sdk";
import { _setInternalConfig as _setInternalConfigNode } from "@nexeraid/js-sdk";

// this is for internal nexeraid use only

console.log("_setInternalConfigReact", { env: env.NEXT_PUBLIC_ENVIRONMENT });
_setInternalConfigReact({ env: env.NEXT_PUBLIC_ENVIRONMENT });
console.log("_setInternalConfigNode", { env: env.NEXT_PUBLIC_ENVIRONMENT });
_setInternalConfigNode({ env: env.NEXT_PUBLIC_ENVIRONMENT });
