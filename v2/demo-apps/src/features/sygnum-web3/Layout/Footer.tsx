import React from "react";
import Link from "next/link";

export const Footer = ({ onClickLogOn }: { onClickLogOn: () => void }) => {
  return (
    <footer className="footer">
      <div className="footer__wrapper">
        <div className="footer__logo-wrapper">
          <a href="https://www.sygnum.com">
            <img
              src="https://www.sygnum.com/wp-content/uploads/2022/02/footer_logo.svg"
              alt="Sygnum logo"
              className="footer__logo"
            />{" "}
          </a>
          <a
            href="#"
            className="footer__list-link btn btn--red btn--large"
            target="_self"
            onClick={onClickLogOn}
          >
            Become a client{" "}
          </a>
        </div>
        <nav className="footer__nav footer__nav--primary">
          <div className="footer__list-wrapper">
            <ul className="footer__list-titles">
              <li className="footer__list-title-wrapper">
                <h4 className="footer__list-title">Offering</h4>
                <ul className="footer__list footer__list--primary">
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="https://www.sygnum.com/digital-asset-banking/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Digital asset banking
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="https://www.sygnum.com/asset-management/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Asset Management
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="https://www.sygnum.com/tokenisation/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Tokenisation
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="https://www.sygnum.com/b2b-banking/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      B2B Banking
                    </a>
                  </li>
                </ul>
              </li>
              <li className="footer__list-title-wrapper">
                <h4 className="footer__list-title">About</h4>
                <ul className="footer__list footer__list--primary">
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="https://www.sygnum.com/sygnum-bank/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Sygnum Bank
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="https://www.sygnum.com/sygnum-singapore/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Sygnum Singapore
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="https://www.sygnum.com/contact-us/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Sygnum Bank Middle East
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="/team/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Our Team
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="/news/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      News
                    </a>
                  </li>
                </ul>
              </li>
              <li className="footer__list-title-wrapper">
                <h4 className="footer__list-title">Contact</h4>
                <ul className="footer__list footer__list--primary">
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="https://www.sygnum.com/contact-us/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Contact us
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="#"
                      className="footer__list-link footer__list-link--primary"
                      onClick={onClickLogOn}
                    >
                      Become a client
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="/help/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Support Portal &amp; FAQs
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="/working-at-sygnum-careers/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </li>
              <li className="footer__list-title-wrapper">
                <h4 className="footer__list-title">Learn</h4>
                <ul className="footer__list footer__list--primary">
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="/future-finance/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Future Finance
                    </a>
                  </li>
                  <li className="footer__list-item footer__list-item--primary">
                    <a
                      href="/research/"
                      className="footer__list-link footer__list-link--primary"
                    >
                      Research &amp; education
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="footer__contact-us">
            <div className="footer__contact-us-wrapper"></div>
          </div>
        </nav>
        <nav className="footer__nav footer__nav--secondary">
          <ul className="footer__list footer__list--secondary">
            <li className="footer__list-item footer__list-item--primary">
              <a
                href="https://www.sygnum.com/privacy-notice/"
                className="footer__list-link footer__list-link--secondary"
              >
                Privacy notice
              </a>
            </li>
            <li className="footer__list-item footer__list-item--primary">
              <a
                href="https://www.sygnum.com/terms-of-use/"
                className="footer__list-link footer__list-link--secondary"
              >
                Terms of use
              </a>
            </li>
            <li className="footer__list-item footer__list-item--primary">
              <a
                href="https://www.sygnum.com/regulatory-disclosures/"
                className="footer__list-link footer__list-link--secondary"
              >
                Regulatory disclosures
              </a>
            </li>
            <li className="footer__list-item footer__list-item--primary">
              <a
                href="/main-register/"
                className="footer__list-link footer__list-link--secondary"
              >
                Main register
              </a>
            </li>
            <li className="footer__list-item footer__list-item--primary">
              <a
                href="/sygnex/"
                className="footer__list-link footer__list-link--secondary"
              >
                Secondary market tokenised assets
              </a>
            </li>
          </ul>
        </nav>
        <div className="footer__rights-socials">
          <div className="footer__rights">
            <span className="footer__rights-year">2023</span>
            <span className="footer__rights-text"></span>
          </div>
          <ul className="footer__socials">
            <li className="footer__socials-item">
              <a
                href="https://twitter.com/sygnumofficial"
                target="_blank"
                className="footer__socials-link"
              >
                <img
                  src="https://www.sygnum.com/wp-content/uploads/2023/09/twitter_footer.svg"
                  alt=""
                  className="footer__socials-logo"
                />{" "}
              </a>
            </li>
            <li className="footer__socials-item">
              <a
                href="https://www.linkedin.com/company/sygnumofficial/"
                target="_blank"
                className="footer__socials-link"
              >
                <img
                  src="https://www.sygnum.com/wp-content/uploads/2022/02/footer_linkedin.svg"
                  alt="Linkedin"
                  className="footer__socials-logo"
                />{" "}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
