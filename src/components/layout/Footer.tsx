import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-nike-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">About Nike Store</h3>
            <p className="text-gray-300 mb-4">
              Your premier destination for authentic Nike footwear in Kenya. Quality, style, and performance in every step.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-nike-orange transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-nike-orange transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-nike-orange transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/men" className="text-gray-300 hover:text-nike-orange transition-colors">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/women" className="text-gray-300 hover:text-nike-orange transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/kids" className="text-gray-300 hover:text-nike-orange transition-colors">
                  Kids' Collection
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-gray-300 hover:text-nike-orange transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-nike-orange transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-nike-orange transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-nike-orange transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-nike-orange transition-colors">
                  Returns & Exchanges
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone size={20} className="flex-shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail size={20} className="flex-shrink-0" />
                <span>info@nikestore.co.ke</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Nike Store Kenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
