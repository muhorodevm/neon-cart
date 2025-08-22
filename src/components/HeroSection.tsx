
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden gradient-hero">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        <div className="space-y-8 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 bg-nike-orange/20 border border-nike-orange/30 rounded-full text-nike-orange backdrop-blur-sm">
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">New Collection Drop</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            Just Do{' '}
            <span className="text-gradient animate-float">
              It
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover the latest Nike collection featuring iconic designs 
            and cutting-edge technology for every athlete.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-nike-orange hover:bg-nike-orange/90 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-nike-orange/25 transition-all duration-300 border-0"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-nike-dark px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              View Collection
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
