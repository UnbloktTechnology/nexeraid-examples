import { Trans } from '@lingui/macro';
import { Button } from '@mui/material';

type SupplyButtonprops = {
  disableSupply: boolean;
  isAuthenticated: boolean;
  whitelistStatusLoading: boolean;
  isWhitelisted: boolean;
  handleListButton: () => void;
};
export const SupplyButton = (props: SupplyButtonprops) => (
  <Button
    disabled={props.disableSupply}
    variant="contained"
    id={props.isAuthenticated ? `identity-btn-verify` : undefined}
    onClick={props.handleListButton}
  >
    {props.isAuthenticated ? (
      props.whitelistStatusLoading ? (
        <Trans>Loading Whitelist...</Trans>
      ) : props.isWhitelisted ? (
        <Trans>Supply</Trans>
      ) : (
        <Trans>Not whitelisted</Trans>
      )
    ) : (
      <Trans>Need Auth</Trans>
    )}
  </Button>
);
