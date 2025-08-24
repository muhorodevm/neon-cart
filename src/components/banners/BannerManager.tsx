
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Banner {
  id: string;
  type: 'offer' | 'announcement' | 'sale';
  title: string;
  description?: string;
  backgroundColor: string;
  textColor: string;
  link?: string;
  dismissible: boolean;
  priority: number;
}

// Mock banners - in real app this would come from an API
const mockBanners: Banner[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Black Friday Sale - Up to 50% Off!',
    description: 'Limited time offer on selected items',
    backgroundColor: 'bg-nike-dark',
    textColor: 'text-white',
    link: '/collections',
    dismissible: true,
    priority: 1
  },
  {
    id: '2',
    type: 'offer',
    title: 'Free Shipping on Orders Over $100',
    backgroundColor: 'bg-nike-orange',
    textColor: 'text-white',
    dismissible: true,
    priority: 2
  }
];

const BannerManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);

  useEffect(() => {
    // Load dismissed banners from localStorage
    const dismissed = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
    setDismissedBanners(dismissed);
    
    // Filter and sort banners - limit to 1 banner at a time for better responsiveness
    const activeBanners = mockBanners
      .filter(banner => !dismissed.includes(banner.id))
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 1); // Only show one banner at a time
    
    setBanners(activeBanners);
  }, []);

  const dismissBanner = (bannerId: string) => {
    const newDismissed = [...dismissedBanners, bannerId];
    setDismissedBanners(newDismissed);
    setBanners(banners.filter(banner => banner.id !== bannerId));
    localStorage.setItem('dismissedBanners', JSON.stringify(newDismissed));
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.link) {
      window.location.href = banner.link;
    }
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative z-40 w-full">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className={`${banner.backgroundColor} ${banner.textColor} py-2 sm:py-3 px-4 sm:px-6 relative ${
            banner.link ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
          } w-full`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-center pr-8">
                <p className="font-semibold text-xs sm:text-sm md:text-base truncate">{banner.title}</p>
                {banner.description && (
                  <p className="text-xs opacity-90 hidden sm:block">{banner.description}</p>
                )}
              </div>
              
              {banner.dismissible && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${banner.textColor} hover:bg-white/20 h-6 w-6 flex-shrink-0`}
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissBanner(banner.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerManager;
