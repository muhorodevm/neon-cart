
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
  title: 'Flash Sale!',
  description: 'Air Jordan collection',
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
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right max-w-[280px] sm:max-w-sm">
      <div className="bg-gradient-to-r from-nike-orange to-red-500 text-white p-3 sm:p-4 rounded-xl shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 text-white hover:bg-white/20 h-5 w-5"
          onClick={handleDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
        
        <div className="flex items-start space-x-2 pr-6">
          <Gift className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm mb-0.5 truncate">{mockOffer.discount}</h3>
            <p className="font-semibold text-xs mb-0.5 truncate">{mockOffer.title}</p>
            <p className="text-xs opacity-90 mb-2 truncate">{mockOffer.description}</p>
            
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs min-w-0">
                <span className="opacity-75">Expires: </span>
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </div>
              <Button 
                size="sm" 
                className="bg-white text-nike-orange hover:bg-white/90 text-xs font-semibold px-2 py-1 h-6 flex-shrink-0"
              >
                Shop
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingBanner;
