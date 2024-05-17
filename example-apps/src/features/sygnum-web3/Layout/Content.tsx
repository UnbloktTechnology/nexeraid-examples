import Image from "next/image";
import React from "react";

export const Content = ({ onClickLogOn }: { onClickLogOn: () => void }) => {
  return (
    <main>
      <section className="banner " style={{ backgroundImage: 'url(https://www.sygnum.com/wp-content/uploads/2022/06/Sygnum-sphere-scarce-altcoins-016-1.jpg)' }}>
        <div className="banner__wrapper">
          <h1 className="banner__title">Invest in crypto with a regulated Swiss bank</h1>
          <p className="banner__description">Welcome to the world’s first digital asset bank, founded on Swiss and
            Singapore heritage. Our mission is to empower everyone, everywhere, to own crypto with complete
            trust. Onboard with Sygnum today to buy, trade and earn crypto to future-proof your investment
            strategy.</p>
          <a href="#" className="btn banner__btn btn--large btn--red" target="_self" onClick={onClickLogOn}>
            Become a client </a>
        </div>
      </section>
      <section className="charts ">
        <div className="charts__wrapper">
          <div className="charts__inner">
            <div className="swiper chart-swiper swiper-initialized swiper-horizontal swiper-pointer-events">
              <div className="swiper-wrapper chart-swiper-wrapper"><div id="bitcoin" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={0} style={{marginRight: '32px'}}>
                  <a href="https://www.sygnum.com/digital-asset-banking/bitcoin-btc/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={76} height={76} src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1696501400" className="chart__ico wp-post-image" alt="Bitcoin" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">Bitcoin</span>
                          <span className="chart__token-title">BTC</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">$28,367.62</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_down.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(236, 76, 109)'}}>-0.11%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div><div id="ethereum" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={1} style={{marginRight: '32px'}}>
                  <a href="https://www.sygnum.com/digital-asset-banking/ethereum-eth/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={76} height={76} src="https://assets.coingecko.com/coins/images/279/small/ethereum.png?1696501628" className="chart__ico wp-post-image" alt="ETH" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">Ethereum</span>
                          <span className="chart__token-title">ETH</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">$1,571.82</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_down.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(236, 76, 109)'}}>-0.03%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div><div id="ripple" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={2} style={{marginRight: '32px'}}>
                  <a href="https://www.sygnum.com/digital-asset-banking/ripple-xrp/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={76} height={76} src="https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png?1696501442" className="chart__ico wp-post-image" alt="XRP" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">XRP</span>
                          <span className="chart__token-title">XRP</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">$0.49</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_up.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(64, 206, 121)'}}>0.20%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div><div id="usd-coin" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={3} style={{marginRight: '32px'}}>
                  <a href="https://www.sygnum.com/digital-asset-banking/usd-coin-usdc/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={76} height={76} src="https://assets.coingecko.com/coins/images/6319/small/usdc.png?1696506694" className="chart__ico wp-post-image" alt="USDC" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">USDC</span>
                          <span className="chart__token-title">USDC</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">$1</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_up.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(64, 206, 121)'}}>0.07%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div><div id="cardano" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={4} style={{marginRight: '32px'}}>
                  <a href="https://www.sygnum.com/digital-asset-banking/cardano-ada/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={76} height={76} src="https://assets.coingecko.com/coins/images/975/small/cardano.png?1696502090" className="chart__ico wp-post-image" alt="Cardano" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">Cardano</span>
                          <span className="chart__token-title">ADA</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">$0.25</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_up.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(64, 206, 121)'}}>0.07%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div><div id="solana" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={5} style={{marginRight: '32px'}}>
                  <a href="https://www.sygnum.com/digital-asset-banking/solana/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={24} height={24} src="https://assets.coingecko.com/coins/images/4128/small/solana.png?1696504756" className="chart__ico wp-post-image" alt="" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">Solana</span>
                          <span className="chart__token-title">SOL</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">$23.65</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_down.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(236, 76, 109)'}}>-0.12%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div><div id="polkadot" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={6} style={{marginRight: '32px'}}>
                  <a href="https://www.sygnum.com/digital-asset-banking/polkadot/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={24} height={24} src="https://assets.coingecko.com/coins/images/12171/small/polkadot.png?1696512008" className="chart__ico wp-post-image" alt="" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">Polkadot</span>
                          <span className="chart__token-title">DOT</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">$3.67</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_down.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(236, 76, 109)'}}>-0.22%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div><div id="matic-network" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={7} style={{marginRight: '32px'}}>
                  <a href="https://www.sygnum.com/digital-asset-banking/polygon-matic/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={76} height={76} src="https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1696505277" className="chart__ico wp-post-image" alt="MATIC" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">Polygon</span>
                          <span className="chart__token-title">MATIC</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">$0.51</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_down.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(236, 76, 109)'}}>-0.30%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div><div id="litecoin" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={8} style={{marginRight: '32px'}}>
                  <a href="https://www.sygnum.com/digital-asset-banking/litecoin-ltc/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={76} height={76} src="https://assets.coingecko.com/coins/images/2/small/litecoin.png?1696501400" className="chart__ico wp-post-image" alt="LTC" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">Litecoin</span>
                          <span className="chart__token-title">LTC</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">$61.55</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_down.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(236, 76, 109)'}}>-0.15%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div><div id="bitcoin-cash" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={9} style={{marginRight: '32px'}}>
                  <a href="https://www.sygnum.com/digital-asset-banking/bitcoin-cash-bch/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={76} height={76} src="https://assets.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png?1696501932" className="chart__ico wp-post-image" alt="BCH" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">Bitcoin Cash</span>
                          <span className="chart__token-title">BCH</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">$228.21</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_down.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(236, 76, 109)'}}>-0.59%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div id="digital-swis-franc" className="chart-swiper-slide chart swiper-slide swiper-slide-duplicate" data-swiper-slide-index={27} style={{marginRight: '32px'}}> 
                  <a href="https://www.sygnum.com/digital-asset-banking/digital-swiss-franc-dchf/" className="link--absolute chart__coin-link">
                    <div className="chart__price">
                      <div className="chart__title-wrapper">
                        <div className="chart__ico-wrapper">
                          <img decoding="async" loading="lazy" width={76} height={76} src="https://www.sygnum.com/wp-content/uploads/2022/02/DCHF.svg" className="chart__ico wp-post-image" alt="DCHF" /> </div>
                        <div className="chart__title-inner">
                          <span className="chart__token-name">Digital Swiss Franc</span>
                          <span className="chart__token-title">DCHF</span>
                        </div>
                      </div>
                      <div className="chart__price-wrapper">
                        <span className="chart__price-title">₣1.00</span>
                        <div className="chart__change-wrapper">
                          <span className="chart__change" style={{background: 'url("/icons/price_change_up.svg") center center no-repeat'}} />
                          <span className="chart__changes-percent--hour" style={{color: 'rgb(64, 206, 121)'}}>0.00%</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div></div>
              <div className="chart-swiper__arrows-wrapper">
                <div className="chart-swiper__arrows">
                  <div className="swiper-button-prev chart-swiper__swiper-button-prev">
                    <svg width={56} height={56} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx={28} cy={28} r="27.5" transform="rotate(-180 28 28)" stroke="#A6A4B3" />
                      <path d="M24.5234 28.8331L28.9934 33.3031L27.815 34.4814L21.3334 27.9998L27.815 21.5181L28.9934 22.6964L24.5234 27.1664L34.6667 27.1664L34.6667 28.8331L24.5234 28.8331Z" fill="#737180" />
                    </svg>
                  </div>
                  <div className="swiper-button-next chart-swiper__swiper-button-next">
                    <svg width={56} height={56} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx={28} cy={28} r="27.5" transform="rotate(-180 28 28)" stroke="#A6A4B3" />
                      <path d="M24.5234 28.8331L28.9934 33.3031L27.815 34.4814L21.3334 27.9998L27.815 21.5181L28.9934 22.6964L24.5234 27.1664L34.6667 27.1664L34.6667 28.8331L24.5234 28.8331Z" fill="#737180" />
                    </svg>
                  </div>
                </div>
                <div className="chart__link-wrapper">
                  <a href="https://www.sygnum.com/market-prices/" className="link charts__link link--btn">Go to market prices</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
