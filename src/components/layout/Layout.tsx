
import { ReactNode } from 'react';
import Navbar from '@/components/navigation/Navbar';
import BannerManager from '@/components/banners/BannerManager';
import FloatingBanner from '@/components/banners/FloatingBanner';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <BannerManager />
      <Navbar />
      <main>{children}</main>
      <FloatingBanner />
    </div>
  );
};

export default Layout;
