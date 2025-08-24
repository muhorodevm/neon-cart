
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-nike-dark mb-4">Get in Touch</h1>
          <p className="text-xl text-nike-gray max-w-2xl mx-auto">
            Have questions? We're here to help you find the perfect Nike gear.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-nike-dark mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-nike-orange/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-nike-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-nike-dark">Phone</h3>
                  <p className="text-nike-gray">1-800-NIKE-AIR</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-nike-orange/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-nike-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-nike-dark">Email</h3>
                  <p className="text-nike-gray">support@nike.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-nike-orange/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-nike-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-nike-dark">Address</h3>
                  <p className="text-nike-gray">One Bowerman Drive<br />Beaverton, OR 97005</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-nike-light-gray/30 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-nike-dark mb-6">Send us a Message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nike-dark mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nike-dark mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nike-dark mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nike-dark mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent resize-none"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-nike-orange hover:bg-nike-orange/90 text-white py-3 text-lg font-semibold"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
