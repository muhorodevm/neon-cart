
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Just Do It',
    subtitle: 'New Collection Drop',
    description: 'Cheki hizi latest kicks, ma-design ni kali na tech iko juu sana!',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&h=1080&fit=crop',
    cta: 'Shop Now'
  },
  {
    id: 2,
    title: 'Air Max Revolution',
    subtitle: 'Maximum Comfort',
    description: 'Experience unparalleled comfort with our revolutionary Air Max technology.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&h=1080&fit=crop',
    cta: 'Explore Air Max'
  },
  {
    id: 3,
    title: 'Born to Move',
    subtitle: 'Athletic Performance',
    description: 'Unleash your potential with gear designed for champions.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1920&h=1080&fit=crop',
    cta: 'View Collection'
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white h-full flex items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center px-4 py-2 bg-nike-orange/20 border border-nike-orange/30 rounded-full text-nike-orange backdrop-blur-sm">
                <span className="text-sm font-medium">{slide.subtitle}</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                {slide.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {slide.description}
              </p>
              
              <Button 
                size="lg" 
                className="bg-nike-orange hover:bg-nike-orange/90 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-nike-orange/25 transition-all duration-300"
              >
                {slide.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-nike-orange scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
