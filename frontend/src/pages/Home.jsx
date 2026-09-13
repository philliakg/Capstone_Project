const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <img src="/images/Big_Card.png" alt="A modern villa at dusk" />
        <div className="hero-copy">
          {/* <h1>Not sure where to go? Perfect.</h1> */}
          {/* <h1>Not sure where to go? Perfect.</h1> */}
          <button type="button" className="hero-cta">I'm flexible</button>
        </div>
      </section>

      <section className="section inspiration-section">
        <img src="/images/Inspiration.png" alt="Inspiration for your next trip" className="inspiration-image" />
      </section>

      <section className="section discover-section">
        <div className="discover-media">
          <img src="/images/DiscoverAirbnb.png" alt="Discover Airbnb Experiences" className="discover-image" />
          <div className="discover-overlay">
            <button type="button" className="discover-btn discover-btn-left">Experiences</button>
            <button type="button" className="discover-btn discover-btn-right">Online Experiences</button>
          </div>
        </div>
      </section>

      <section className="section shop-section">
        <div className="shop-media">
          <img src="/images/ShopAirbnbGiftCards.png" alt="Shop Airbnb gift cards" className="shop-image" />
          <button type="button" className="dark-btn shop-btn">Learn more</button>
        </div>
      </section>

      <section className="hosting-section">
        <div className="hosting-media">
          <img src="/images/QuestionsAboutHosting.png" alt="Questions about hosting" className="hosting-image" />
          <button type="button" className="hosting-btn hosting-btn-overlay">Ask a Superhost</button>
        </div>
      </section>

      <section className="section prefooter-section">
        <img src="/images/Pre-Footer.png" alt="Inspiration for future getaways" className="prefooter-image" />
      </section>
    </div>
  )
}

export default Home
