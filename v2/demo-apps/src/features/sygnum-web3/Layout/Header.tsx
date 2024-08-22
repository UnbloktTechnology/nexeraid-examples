import React from "react";
import Link from "next/link";

export const Header = ({ onClickLogOn }: { onClickLogOn: () => void }) => {
  return (
    <header className="header">
      {/* TODO */}
      <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        {/* <meta name="_0ua0bwv8bewit7qcrmxpjcab6hqrrbfk" signature="_c8j7syqkpbh66mkt5v95mgnzriwkhdjf" /> */}
        <link
          rel="icon"
          href="https://www.sygnum.com/wp-content/themes/sygnum/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="shortcut icon"
          href="https://www.sygnum.com/wp-content/themes/sygnum/favicon.ico"
          type="image/x-icon"
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <title>
          Home | Sygnum Bank - Invest in crypto with a regulated Swiss bank
        </title>
        <meta
          name="description"
          content="Start investing in crypto with Sygnum Bank: the world's first digital asset bank. Apply to become a client now."
        />
        <link rel="canonical" href="https://www.sygnum.com/" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Home | Sygnum Bank - Invest in crypto with a regulated Swiss bank"
        />
        <meta
          property="og:description"
          content="https://vimeo.com/780780966/204e6bb790"
        />
        <meta property="og:url" content="https://www.sygnum.com/" />
        <meta property="og:site_name" content="Sygnum Bank" />
        <meta
          property="article:publisher"
          content="https://www.facebook.com/SygnumAG/"
        />
        <meta
          property="article:modified_time"
          content="2023-10-03T16:45:59+00:00"
        />
        <meta
          property="og:image"
          content="https://www.sygnum.com/wp-content/uploads/2022/07/Home-page-featured-image.png"
        />
        <meta property="og:image:width" content={"300"} />
        <meta property="og:image:height" content={"300"} />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sygnumofficial" />
        <meta name="msvalidate.01" content="B135593CE40E020AF8857DFE146126B8" />
        <link rel="dns-prefetch" href="//cdn.iubenda.com" />
        <link rel="dns-prefetch" href="//www.google.com" />
        <link
          rel="stylesheet"
          id="mo_wpns_shortcode_style-css"
          href="https://www.sygnum.com/wp-content/plugins/miniorange-2-factor-authentication_old/includes/css/style_settings.css?ver=16eb5a12dea941fddf3b5be9a72162ce"
          type="text/css"
          media="all"
        />
        <link
          rel="stylesheet"
          id="my_main-css"
          href="https://www.sygnum.com/wp-content/themes/sygnum/css/style.min.css?ver=1697136039"
          type="text/css"
        />
        <link rel="https://api.w.org/" href="https://www.sygnum.com/wp-json/" />
        <link
          rel="alternate"
          type="application/json"
          href="https://www.sygnum.com/wp-json/wp/v2/pages/8"
        />
        <link
          rel="EditURI"
          type="application/rsd+xml"
          title="RSD"
          href="https://www.sygnum.com/xmlrpc.php?rsd"
        />
        <link rel="shortlink" href="https://www.sygnum.com/" />
        <link
          rel="alternate"
          type="application/json+oembed"
          href="https://www.sygnum.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.sygnum.com%2F"
        />
        <link
          rel="alternate"
          type="text/xml+oembed"
          href="https://www.sygnum.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.sygnum.com%2F&format=xml"
        />
        <meta name="cdp-version" content="1.4.3" />
      </div>

      {/* TODO */}

      <nav className="header__wrapper header__wrapper--desktop">
        <div className="header__inner header__inner--desktop">
          <div className="header__logo-wrapper">
            <a
              href="https://www.sygnum.com"
              className="header__logo-link"
              title="Home | Sygnum Bank - Invest in crypto with a regulated Swiss bank"
            >
              <img
                src="https://www.sygnum.com/wp-content/uploads/2022/02/main_logo.svg"
                alt="Sygnum logo"
                className="header__logo"
              />{" "}
            </a>
          </div>
          <ul className="header__list">
            <li className="header__list-item">
              <span className="header__list-link">Offering</span>
            </li>
            <li className="header__list-item">
              <span className="header__list-link">About</span>
            </li>
            <li className="header__list-item">
              <span className="header__list-link">Careers</span>
            </li>
            <li className="header__list-item">
              <span className="header__list-link">Learn</span>
            </li>
            <li className="header__list-item">
              <span className="header__list-link">Contact</span>
            </li>
          </ul>
          <ul className="header__list header__list--login">
            <li className="header__list-item">
              <a
                href="#"
                className="header__list-link header__list-link--login"
                target="_self"
                onClick={onClickLogOn}
              >
                <span className="header__list-link--login-text">Login</span>
              </a>
            </li>
            <li className="header__list-item" onClick={onClickLogOn}>
              <a
                href="#"
                className="header__list-link btn btn--red btn--large"
                target="_self"
                onClick={onClickLogOn}
              >
                Become a client{" "}
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <nav className="header__wrapper header__wrapper--mobile">
        <div className="header__inner header__inner--mobile">
          <div className="header__logo-wrapper">
            <a href="https://www.sygnum.com" className="header__logo-link">
              <img
                src="https://www.sygnum.com/wp-content/uploads/2022/02/main_logo.svg"
                alt="Sygnum logo"
                className="header__logo"
              />{" "}
            </a>
          </div>
          <div className="burger-menu">
            <div className="burger" />
          </div>
        </div>
      </nav>
    </header>
  );
};
