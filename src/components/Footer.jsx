import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Company': [
      { label: 'About Us', path: '/about' },
      { label: 'How It Works', path: '/how-it-works' },
      { label: 'Careers', path: '/careers' },
      { label: 'Press', path: '/press' }
    ],
    'For Buyers': [
      { label: 'Search Cars', path: '/search' },
      { label: 'Reviews', path: '/reviews' },
      { label: 'Financing', path: '/financing' },
      { label: 'Insurance', path: '/insurance' }
    ],
    'Support': [
      { label: 'Help Center', path: '/help' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'Live Chat', path: '/chat' },
      { label: 'FAQ', path: '/faq' }
    ],
    'Legal': [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'Disclaimer', path: '/disclaimer' }
    ]
  };

  return (
    <footer className="bg-whipsly-navy text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-whipsly-blue p-2 rounded-lg">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="text-2xl font-display font-bold text-white">Whipsly</span>
              </div>
              <p className="text-blue-100 text-lg font-medium mb-4">
                Smart car search made simple
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Whipsly connects car buyers with trusted dealers nationwide, 
                providing the tools and insights needed to find your perfect vehicle 
                at the best price.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-whipsly-blue flex-shrink-0" />
                <a href="tel:(555) 123-4567" className="text-sm hover:text-whipsly-blue transition-colors">
                  (555) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-whipsly-blue flex-shrink-0" />
                <a href="mailto:support@whipsly.com" className="text-sm hover:text-whipsly-blue transition-colors">
                  support@whipsly.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-whipsly-blue flex-shrink-0" />
                <span className="text-sm">Available Nationwide</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="font-semibold text-white text-lg">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-white text-sm transition-colors duration-200 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm mr-2">Follow us:</span>
              <a 
                href="https://facebook.com/whipsly" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 hover:bg-whipsly-blue/20 rounded-lg"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/whipsly" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 hover:bg-whipsly-blue/20 rounded-lg"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/whipsly" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 hover:bg-whipsly-blue/20 rounded-lg"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/whipsly" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 hover:bg-whipsly-blue/20 rounded-lg"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Get car deals in your inbox"
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-whipsly-blue focus:border-transparent transition-all duration-200"
              />
              <button className="bg-whipsly-blue hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-gray-300 text-sm">
              © {currentYear} Whipsly. All rights reserved.
            </div>
            
            <div className="text-gray-400 text-xs text-center lg:text-left">
              <p className="mb-2">
                Whipsly is a vehicle search and comparison platform. We are not a dealer or lender.
              </p>
              <p>
                <strong>Affiliate Disclosure:</strong> We may earn commissions from qualifying purchases made through our partner links.
                This helps us keep our service free for users while maintaining editorial independence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;