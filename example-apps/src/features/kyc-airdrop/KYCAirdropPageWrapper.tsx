import { KYCAirdropPage } from "./KYCAirdropPage";
import { KYCProvider } from "./providers/KYCContext";

export const KYCAirdropPageWrapper = () => {
  return (
    <KYCProvider>
      <KYCAirdropPage />
    </KYCProvider>
  );
};
