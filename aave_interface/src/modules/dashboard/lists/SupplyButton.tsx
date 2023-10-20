import { Trans } from '@lingui/macro';
import { Button } from '@mui/material';

type SupplyButtonInputs = {
  disableSupply: boolean;
  isAuthenticated: boolean;
  whitelistStatusLoading: boolean;
  isWhitelisted: boolean;
  handleListButton: () => void;
};
export const SupplyButton = (inputs: SupplyButtonInputs) => (
  <Button
    disabled={inputs.disableSupply}
    variant="contained"
    id={inputs.isAuthenticated ? `identity-btn-verify` : undefined}
    onClick={inputs.handleListButton}
  >
    {inputs.isAuthenticated ? (
      inputs.whitelistStatusLoading ? (
        <Trans>Loading Whitelist...</Trans>
      ) : inputs.isWhitelisted ? (
        <Trans>Supply</Trans>
      ) : (
        <Trans>Not whitelisted</Trans>
      )
    ) : (
      <Trans>Need Auth</Trans>
    )}
  </Button>
);
