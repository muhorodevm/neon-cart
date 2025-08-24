
import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  expiresIn: number; // minutes
}

const mockOffer: FloatingOffer = {
  id: 'flash-sale-1',
  title: 'Flash Sale Alert!',
  description: 'Limited time offer on Air Jordan collection',
  discount: '30% OFF',
  expiresIn: 15
};

const FloatingBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mockOffer.expiresIn * 60);

  useEffect(() => {
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem(`dismissed-${mockOffer.id}`);
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`dismissed-${mockOffer.id}`, 'true');
  };

  if (!isVisible || timeLeft <= 0) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-nike-orange to-red-500 text-white p-4 sm:p-6 rounded-2xl shadow-2xl max-w-xs sm:max-w-sm">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white hover:bg-white/20 h-6 w-6"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex items-start space-x-3">
          <Gift className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-lg sm:text-xl mb-1">{mockOffer.discount}</h3>
            <p className="font-semibold text-sm sm:text-base mb-1">{mockOffer.title}</p>
            <p className="text-xs sm:text-sm opacity-90 mb-3">{mockOffer.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm">
                <span className="opacity-75">Expires in: </span>
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </div>
              <Button 
                size="sm" 
                className="bg-white text-nike-orange hover:bg-white/90 text-xs sm:text-sm font-semibold px-3 py-1"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingBanner;
