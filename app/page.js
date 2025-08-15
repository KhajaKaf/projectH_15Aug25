'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, MapPin, Phone, Users, Utensils, Award } from 'lucide-react';

const HomePage = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "KK's Empire",
    tagline: "Indo-Arabian Fine Dining Experience",
    description: "Where tradition meets luxury in every bite",
    phone: "+91 9380005430",
    email: "reservations@kksempire.com",
    address: "Chittor Rd. Rayachoty, Andhra Pradesh-516269",
    hours: {
      monday: "11:00 AM - 11:00 PM",
      tuesday: "11:00 AM - 11:00 PM", 
      wednesday: "11:00 AM - 11:00 PM",
      thursday: "11:00 AM - 11:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "11:00 AM - 11:00 PM"
    }
  });

  const features = [
    { icon: <Utensils className="w-8 h-8 text-amber-400" />, title: "Authentic Flavors", description: "Traditional Indo-Arabian cuisine crafted with finest spices and ingredients" },
    { icon: <Users className="w-8 h-8 text-amber-400" />, title: "Fine Dining Experience", description: "Elegant ambiance perfect for family gatherings and special occasions" },
    { icon: <Award className="w-8 h-8 text-amber-400" />, title: "Award Winning", description: "Recognized for excellence in culinary arts and customer service" }
  ];

  const testimonials = [
    { name: "Arjun Patel", rating: 5, comment: "Outstanding food quality and service. The biryani here is absolutely phenomenal!", location: "Mumbai" },
    { name: "Fatima Khan", rating: 5, comment: "Perfect blend of traditional and modern dining. The ambiance is simply magical.", location: "Delhi" },
    { name: "Rahul Sharma", rating: 5, comment: "Best Indo-Arabian restaurant in the city. Every dish tells a story of authentic flavors.", location: "Bangalore" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <video
            src="/videos/KKsEmpire.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/60" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-slate-100">Welcome to </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
              {restaurantInfo.name}
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-4">{restaurantInfo.tagline}</p>
          <p className="text-lg text-slate-400 mb-12">{restaurantInfo.description}</p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600">
              <Link href="/order" className="flex items-center space-x-2">
                <Utensils className="w-5 h-5" />
                <span>Book a Table</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-amber-400 text-amber-400">
              <Link href="/menu" className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>View Menu</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <Card key={i} className="bg-slate-800/80 border-slate-700/50 hover:bg-slate-800 transition-all duration-300 hover:border-amber-500/30 group">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-4">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Location</h3>
              <p className="text-slate-400">{restaurantInfo.address}</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Hours</h3>
              <p className="text-slate-400">
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
              <p className="text-slate-400">
                {restaurantInfo.phone}<br />
                {restaurantInfo.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              ...testimonials.map((t, i) => (
                <Card key={i} className="bg-slate-800/80 border-slate-700/50 hover:bg-slate-800 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(t.rating)].map((_, idx) => (
                        <Star key={idx} className="w-5 h-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-4 italic">"{t.comment}"</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-amber-400">{t.name}</span>
                      <span className="text-sm text-slate-500">{t.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ]}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;