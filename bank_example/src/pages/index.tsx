import React, { useContext, useEffect } from "react";
import { DisclaimerOverlay } from "@/features/Components/DisclaimerOverlay";
import { Dashboard } from "@/features/Dashboard";
import { useIsUserCompliant } from "@/features/Hooks/useIsUserCompliant";
import {
  useKycAuthentication,
  type AuthenticationData,
} from "@/features/Hooks/useKycAuthenticate";
import { type IUser } from "@/features/Interfaces";
import { Banner, Content, Header } from "@/features/Layout";
import { KYC_CLIENTS } from "@/features/Services/KycClient";
import { SimpleAuthContext } from "@/features/SimpleAuthProvider";
import { Layout } from "@/features/Layout";
import { useGlobalModals } from "@/features/Modals/useGlobalModals";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const Home = () => {
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
  }));
  const { isLogin, signIn, getUser } = useContext(SimpleAuthContext);
  const { authenticate, accessToken, signingMessage, signature } =
    useKycAuthentication();
  const user = getUser();
  const { data: isUserCompliant } = useIsUserCompliant();
  const kycClient = KYC_CLIENTS.verify;
  console.log("isUserCompliant", isUserCompliant);

  const buildSigner = (user: IUser) => {
    const provider = new ethers.JsonRpcProvider(
      "https://ava-testnet.public.blastapi.io/ext/bc/C/rpc",
      43113
    );
    return new ethers.Wallet(user.privateKey, provider);
  };

  useEffect(() => {
    console.log("isUserCompliant", isUserCompliant);
    if (isUserCompliant) {
      close();
      console.log("GO TO DASHBOARD because of isUserCompliant");
    }
  }, [close, isUserCompliant]);

  useEffect(() => {
    console.log("bank", {
      user,
      accessToken,
      signingMessage,
      signature,
      kycClient,
    });
    if (user && accessToken && signingMessage && signature && kycClient) {
      kycClient.onOffChainShareCompletition(() => {
        toast(`Off chain data sharing completed`);
      });
      kycClient.onSignPersonalData(async (data: string) => {
        console.log("on sign personal data");
        const signer = buildSigner(user);
        return await signer.signMessage(data);
      });
      kycClient.onKycCompletion(
        (idScanVerifiableCredential, id3VerifiableCredential) => {
          console.log(
            "id3VerifiableCredential from onKycCompletion",
            id3VerifiableCredential
          );
          console.log(
            "idScanVerifiableCredential from onKycCompletion",
            idScanVerifiableCredential
          );
        }
      );
      kycClient.init({
        auth: {
          accessToken,
          signingMessage,
          signature,
        },
        initOnFlow: "REQUEST",
      });
    }
  }, [user, accessToken, signingMessage, signature, kycClient]);

  const users: IUser[] = [
    {
      id: "1",
      name: "Alice",
      avatar: "alice-user",
      walletAddress: "0x9BE9B6032264D9Bc0605f4bBeA8F60A77F7b2bB8",
      privateKey:
        "eb88efb22ce3526dee6fbedb2057c5285199a36b9045d35404588eb9b7070365",
    },
    {
      id: "2",
      name: "Bob",
      avatar: "bob-user",
      walletAddress: "0xf7E7A46AB882D4d0986292d3BD7d2a40F75002E6",
      privateKey:
        "37ac909b525919f9787b6ccf78f2bc3c558855e9551426afb98cb106e68fae5c",
    },
    {
      id: "3",
      name: "Carol",
      avatar: "carol-user",
      walletAddress: "0x6cA64ec25DF05E6d0BDB689e95C7bd623a3d7919",
      privateKey:
        "62603af2208c6e28d95084bc5262cb41bdb0cac95c3cb3ab009e8bde96a08985",
    },
    {
      id: "4",
      name: "Dave",
      avatar: "dave-user",
      walletAddress: "0x63a1bD42436b7f97607Ba88DD9ea62C1e261e7F9",
      privateKey:
        "a609e0288af6bf3b1aa89a6ee7d809e423f7bf41b7b9c14759376df8d17d40ec",
    },
  ];

  const logOnSuccessfull = (user: IUser) => {
    close();
    console.log("GO TO DASHBOARD");
    console.log("USER", user);
  };

  const onAuthenticate = (user: IUser) => {
    if (signIn(user)) {
      const authenticationData: AuthenticationData = {
        address: user.walletAddress,
        privateKey: user.privateKey,
      };
      void authenticate.mutate(authenticationData);
      if (isUserCompliant) {
        logOnSuccessfull(user);
      }
    }
  };

  const onClickLogOn = () => {
    openModal(
      "LogOnModal",
      {
        modalType: "center",
        overlayType: "dark",
      },
      {
        basicData: {
          text: "",
          icon: "help",
          textButton: "Verify Identity",
        },
        userData: {
          users,
          onSuccess: logOnSuccessfull,
          onAuthenticate: onAuthenticate,
        },
      }
    );
  };

  return (
    <Layout
      header={
        !isLogin || !isUserCompliant ? (
          <Header onClickLogOn={onClickLogOn} />
        ) : (
          <></>
        )
      }
      className={!isLogin || !isUserCompliant ? "px-[105px]" : "bg-[#F2F2F2]"}
    >
      {!isLogin || !isUserCompliant ? (
        <>
          <Banner />
          <Content />
        </>
      ) : (
        <Dashboard />
      )}
      <DisclaimerOverlay
        content="This web application  is a simulated, mockup banking application developed solely for the purpose of demonstrating the functionalities and capabilities of the NexeraID product. It is not affiliated with, endorsed by, or in any way associated with any real-world banking or financial institution."
        textButton="I understood"
        className="bg-[#3E505D]"
        classNameButton="border-none !rounded-none !bg-[#DB0011] font-normal"
      />
    </Layout>
  );
};

export default Home;
