export default function Gallery() {
  return (
    <section id="gallery" className="section-no-pad fade-in">
      <div className="gallery-grid">
        <div className="gallery-item"><img src="/assets/g1.jpg" className="g-img" alt="Gallery 1" /></div>
        <div className="gallery-item"><img src="/assets/g2.jpg" className="g-img" alt="Gallery 2" /></div>
        <div className="gallery-item"><img src="/assets/g3.jpg" className="g-img" alt="Gallery 3" /></div>
        <div className="gallery-item"><img src="/assets/g4.jpg" className="g-img" alt="Gallery 4" /></div>
      </div>
    </section>
  );
}
