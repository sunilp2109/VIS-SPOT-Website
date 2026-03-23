export default function Hero() {
  return (
    <section className="hero slide-up">
      <div className="hero-content">
        <h1 className="fade-in">Small details.<br/>Big style.</h1>
        <p className="fade-in delay-1">Premium handmade aesthetic accessories for your everyday look.</p>
        <div className="fade-in delay-2">
          <a href="#collection" className="btn btn-primary">Shop Now</a>
        </div>
      </div>
      <div className="hero-image fade-in">
        <img id="hero-img-main" src="/assets/hero.jpg" alt="Lifestyle accessory" />
      </div>
    </section>
  );
}
