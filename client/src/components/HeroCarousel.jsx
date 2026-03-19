import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const slides = [
  {
    id: 1,
    tag: '🔥 Flash Sale',
    title: 'Up to 40% Off Electronics',
    subtitle: 'Headphones, smartwatches, keyboards & more — limited time only.',
    cta: 'Shop Electronics',
    category: 'Electronics',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    accent: '#7c3aed',
    emoji: '🎧',
  },
  {
    id: 2,
    tag: '💪 New Arrivals',
    title: 'Level Up Your Fitness',
    subtitle: 'Yoga mats, resistance bands, protein powders & running gear.',
    cta: 'Shop Sports',
    category: 'Sports',
    bg: 'linear-gradient(135deg, #0f1923 0%, #1a2f1a 40%, #0a3d0a 100%)',
    accent: '#10b981',
    emoji: '🏃',
  },
  {
    id: 3,
    tag: '🍳 Kitchen Deals',
    title: 'Cook Smarter, Not Harder',
    subtitle: 'Air fryers, blenders & coffee makers at unbeatable prices.',
    cta: 'Shop Kitchen',
    category: 'Kitchen',
    bg: 'linear-gradient(135deg, #1f1200 0%, #2d1b00 40%, #3d2600 100%)',
    accent: '#f59e0b',
    emoji: '🍕',
  },
  {
    id: 4,
    tag: '✨ Beauty Edit',
    title: 'Glow Up This Season',
    subtitle: 'Skincare sets, fragrances & premium beauty essentials.',
    cta: 'Shop Beauty',
    category: 'Beauty',
    bg: 'linear-gradient(135deg, #1f0a1f 0%, #2d0a2d 40%, #3d0d3d 100%)',
    accent: '#ec4899',
    emoji: '💄',
  },
];

function HeroCarousel({ onCategoryFilter }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <div className="hero-carousel" style={{ background: slide.bg }} id="hero-carousel">
      <div className={`hero-content ${animating ? 'hero-fade' : ''}`}>
        <span className="hero-tag" style={{ backgroundColor: `${slide.accent}22`, color: slide.accent, border: `1px solid ${slide.accent}44` }}>
          {slide.tag}
        </span>
        <div className="hero-emoji">{slide.emoji}</div>
        <h1 className="hero-title">{slide.title}</h1>
        <p className="hero-subtitle">{slide.subtitle}</p>
        <button
          className="hero-cta"
          style={{ background: slide.accent }}
          onClick={() => onCategoryFilter(slide.category)}
          id={`hero-cta-${slide.id}`}
        >
          {slide.cta} →
        </button>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            style={i === current ? { backgroundColor: slide.accent } : {}}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button className="hero-arrow left" onClick={() => goTo((current - 1 + slides.length) % slides.length)} aria-label="Previous slide">‹</button>
      <button className="hero-arrow right" onClick={() => goTo((current + 1) % slides.length)} aria-label="Next slide">›</button>
    </div>
  );
}

HeroCarousel.propTypes = {
  onCategoryFilter: PropTypes.func.isRequired,
};

export default HeroCarousel;
