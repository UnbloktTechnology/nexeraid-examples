import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { QRCode as QRCodeLogo } from "react-qrcode-logo";
import QRCodeStyling from "qr-code-styling";

/**
 *
 * URL: https://qr-code-styling.com/
 *
 */
const qrCode = new QRCodeStyling({
  width: 318,
  height: 318,
  image: "https://www.nexera.id/images/logo.svg",
  dotsOptions: {
    color: "#4267b2",
    type: "rounded",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 20,
  },
});

const QrCodeStyled = (props: { value: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    qrCode.append(ref.current!);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: props.value,
    });
  }, [props.value]);

  return <div ref={ref} />;
};

const QrCodeTest = () => {
  const [inputValue, setInputValue] = useState(
    "https://kyc.nexera.id/mobile/7e2bf6fe-96d9-468a-beee-d28359a5ed37",
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? qrCodes.length - 1 : prevIndex - 1,
    );
  };

  const handleNextClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === qrCodes.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const qrCodes = [
    {
      component: <QRCode value={inputValue} size={318} />,
      title: "React QR Code",
    },
    {
      component: <QRCodeLogo value={inputValue} size={318} />,
      title: "React QRCode Logo",
    },
    {
      component: <QRCodeLogo value={inputValue} size={318} qrStyle="dots" />,
      title: "React QRCode Logo Dots",
    },
    {
      component: (
        <QRCodeLogo
          value={inputValue}
          size={318}
          logoPadding={2}
          qrStyle="dots"
          eyeRadius={50}
          eyeColor={[
            {
              outer: "black",
              inner: "#0258FD",
            },
            {
              outer: "black",
              inner: "#0258FD",
            },
            {
              outer: "black",
              inner: "#0258FD",
            },
          ]}
          fgColor={"black"}
          bgColor="transparent"
          style={{ border: "none" }}
        />
      ),
      title: "React QRCode Logo Current KYC",
    },

    {
      component: (
        <QRCodeLogo
          value={inputValue}
          size={318}
          logoPadding={2}
          qrStyle="dots"
          eyeRadius={8}
          eyeColor={[
            {
              outer: "black",
              inner: "#0258FD",
            },
            {
              outer: "black",
              inner: "#0258FD",
            },
            {
              outer: "black",
              inner: "#0258FD",
            },
          ]}
          fgColor={"black"}
          bgColor="transparent"
          style={{ border: "none" }}
        />
      ),
      title: "React QRCode Logo Current KYC Radius 8",
    },
    {
      component: <QrCodeStyled value={inputValue} />,
      title: "QRCode Styling",
    },
  ];

  return (
    <main
      className={`scrollable relative mx-auto my-0 h-full min-h-screen w-full p-8`}
    >
      <div className="flex flex-col items-center">
        <h5>Enter the URL to probe</h5>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="mb-4 w-full rounded-md border border-gray-300 p-2 text-center"
          placeholder="Enter a string"
        />
        <div className="mb-8 mt-4 flex justify-center gap-8">
          <button
            onClick={handlePrevClick}
            className="rounded-full bg-blue-500 px-8 py-2 font-bold text-white"
          >
            Prev
          </button>
          <button
            onClick={handleNextClick}
            className="rounded-full bg-blue-500 px-8 py-2 font-bold text-white"
          >
            Next
          </button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h3>{qrCodes[activeIndex]?.title}</h3>
          {qrCodes[activeIndex]?.component}
        </div>
      </div>
    </main>
  );
};

export default QrCodeTest;
