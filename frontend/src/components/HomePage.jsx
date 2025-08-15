import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Star, Clock, MapPin, Phone, Users, Utensils, Award } from 'lucide-react';
import { restaurantInfo } from '../mock';

const HomePage = () => {
  const features = [
    {
      icon: <Utensils className="w-8 h-8 text-amber-400" />,
      title: "Authentic Flavors",
      description: "Traditional Indo-Arabian cuisine crafted with finest spices and ingredients"
    },
    {
      icon: <Users className="w-8 h-8 text-amber-400" />,
      title: "Fine Dining Experience",
      description: "Elegant ambiance perfect for family gatherings and special occasions"
    },
    {
      icon: <Award className="w-8 h-8 text-amber-400" />,
      title: "Award Winning",
      description: "Recognized for excellence in culinary arts and customer service"
    }
  ];

  const testimonials = [
    {
      name: "Arjun Patel",
      rating: 5,
      comment: "Outstanding food quality and service. The biryani here is absolutely phenomenal!",
      location: "Mumbai"
    },
    {
      name: "Fatima Khan",
      rating: 5,
      comment: "Perfect blend of traditional and modern dining. The ambiance is simply magical.",
      location: "Delhi"
    },
    {
      name: "Rahul Sharma",
      rating: 5,
      comment: "Best Indo-Arabian restaurant in the city. Every dish tells a story of authentic flavors.",
      location: "Bangalore"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1920&h=1080&fit=crop')] bg-cover bg-center bg-no-repeat opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-slate-100">Welcome to </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 animate-pulse">
              {restaurantInfo.name}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-300 mb-4 font-light tracking-wide animate-fade-in-delay-1">
            {restaurantInfo.tagline}
          </p>
          
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto animate-fade-in-delay-2">
            {restaurantInfo.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-delay-3">
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold px-12 py-4 text-lg rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/order" className="flex items-center space-x-2">
                <Utensils className="w-5 h-5" />
                <span>Book a Table</span>
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-amber-400/50 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400 font-semibold px-12 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/menu" className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>View Menu</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Why Choose KK's Empire</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Experience the perfect blend of traditional flavors and modern luxury
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/80 border-slate-700/50 hover:bg-slate-800 transition-all duration-300 hover:border-amber-500/30 group">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Location</h3>
              <p className="text-slate-400 leading-relaxed">{restaurantInfo.address}</p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Hours</h3>
              <p className="text-slate-400 leading-relaxed">
                Mon-Thu: {restaurantInfo.hours.monday}<br />
                Fri-Sat: {restaurantInfo.hours.friday}<br />
                Sunday: {restaurantInfo.hours.sunday}
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Contact</h3>
              <p className="text-slate-400 leading-relaxed">
                {restaurantInfo.phone}<br />
                {restaurantInfo.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">What Our Guests Say</h2>
            <p className="text-xl text-slate-400">Discover why we're the preferred choice for fine dining</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/80 border-slate-700/50 hover:bg-slate-800 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-400">{testimonial.name}</span>
                    <span className="text-sm text-slate-500">{testimonial.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;