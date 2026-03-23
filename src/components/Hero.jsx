export default function Hero({ hero }) {
  if (!hero) return null;
  return (
    <section className="hero slide-up">
      <div className="hero-content">
        <h1 className="fade-in" dangerouslySetInnerHTML={{ __html: hero.title || '' }}></h1>
        <p className="fade-in delay-1">{hero.subtitle}</p>
        <div className="fade-in delay-2">
          <a href="#collection" className="btn btn-primary">Shop Now</a>
        </div>
      </div>
      <div className="hero-image fade-in">
        <img id="hero-img-main" src={hero.image} alt="Lifestyle accessory" />
      </div>
    </section>
  );
}
