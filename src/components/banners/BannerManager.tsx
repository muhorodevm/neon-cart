
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
  },
  {
    id: '3',
    type: 'announcement',
    title: 'New Air Jordan Collection Now Available',
    description: 'Explore the latest designs',
    backgroundColor: 'bg-gradient-to-r from-nike-dark to-nike-gray',
    textColor: 'text-white',
    link: '/men',
    dismissible: false,
    priority: 3
  }
];

const BannerManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);

  useEffect(() => {
    // Load dismissed banners from localStorage
    const dismissed = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
    setDismissedBanners(dismissed);
    
    // Filter and sort banners
    const activeBanners = mockBanners
      .filter(banner => !dismissed.includes(banner.id))
      .sort((a, b) => a.priority - b.priority);
    
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
    <div className="relative z-40">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className={`${banner.backgroundColor} ${banner.textColor} py-3 px-4 sm:px-6 relative ${
            banner.link ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
          }`}
          onClick={() => handleBannerClick(banner)}
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2">
              <div>
                <p className="font-semibold text-sm sm:text-base">{banner.title}</p>
                {banner.description && (
                  <p className="text-xs sm:text-sm opacity-90">{banner.description}</p>
                )}
              </div>
            </div>
          </div>
          
          {banner.dismissible && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 ${banner.textColor} hover:bg-white/20 h-6 w-6 sm:h-8 sm:w-8`}
              onClick={(e) => {
                e.stopPropagation();
                dismissBanner(banner.id);
              }}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default BannerManager;
