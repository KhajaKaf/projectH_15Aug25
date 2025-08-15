import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Clock } from 'lucide-react';
import { restaurantInfo } from '../mock';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg">
                <Crown className="w-7 h-7 text-slate-900" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-400">KK's Empire</h3>
                <p className="text-slate-400 text-sm">Indo-Arabian Fine Dining</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
              Experience the finest Indo-Arabian cuisine in an atmosphere of luxury and tradition. 
              Every dish tells a story of authentic flavors and culinary excellence.
            </p>
            <div className="flex space-x-4">
              <a 
                href={restaurantInfo.socialMedia.instagram}
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href={restaurantInfo.socialMedia.facebook}
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={restaurantInfo.socialMedia.twitter}
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-slate-100 mb-6">Quick Links</h4>
            <nav className="space-y-3">
              {['Home', 'Menu', 'Order', 'Contact'].map((link) => (
                <Link
                  key={link}
                  to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                  className="block text-slate-400 hover:text-amber-400 transition-colors duration-200"
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-slate-100 mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400 text-sm leading-relaxed">
                  {restaurantInfo.address}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <a 
                  href={`tel:${restaurantInfo.phone}`}
                  className="text-slate-400 hover:text-amber-400 transition-colors duration-200"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <a 
                  href={`mailto:${restaurantInfo.email}`}
                  className="text-slate-400 hover:text-amber-400 transition-colors duration-200"
                >
                  {restaurantInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours Section */}
        <div className="py-8 border-t border-slate-800">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-5 h-5 text-amber-400" />
            <h4 className="text-lg font-semibold text-slate-100">Opening Hours</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Monday:</span>
              <span className="text-slate-300">{restaurantInfo.hours.monday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tuesday:</span>
              <span className="text-slate-300">{restaurantInfo.hours.tuesday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Wednesday:</span>
              <span className="text-slate-300">{restaurantInfo.hours.wednesday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Thursday:</span>
              <span className="text-slate-300">{restaurantInfo.hours.thursday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Friday:</span>
              <span className="text-slate-300 font-medium text-amber-400">{restaurantInfo.hours.friday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Saturday:</span>
              <span className="text-slate-300 font-medium text-amber-400">{restaurantInfo.hours.saturday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sunday:</span>
              <span className="text-slate-300">{restaurantInfo.hours.sunday}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © 2024 KK's Empire. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm mt-2 sm:mt-0">
            Crafted with passion for culinary excellence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;