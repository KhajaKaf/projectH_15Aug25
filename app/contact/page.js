"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { toast } from "sonner";
import { restaurantInfo } from "@/lib/mock"; // <-- move your data here

//export const metadata = { title: "Contact | KK's Empire" };

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-amber-400" />,
      title: "Address",
      content: restaurantInfo.address,
      action: `https://maps.google.com/?q=${encodeURIComponent(
        restaurantInfo.address
      )}`,
    },
    {
      icon: <Phone className="w-6 h-6 text-amber-400" />,
      title: "Phone",
      content: restaurantInfo.phone,
      action: `tel:${restaurantInfo.phone}`,
    },
    {
      icon: <Mail className="w-6 h-6 text-amber-400" />,
      title: "Email",
      content: restaurantInfo.email,
      action: `mailto:${restaurantInfo.email}`,
    },
  ];

  const socialLinks = [
    {
      icon: <Instagram className="w-6 h-6" />,
      name: "Instagram",
      url: restaurantInfo.socialMedia.instagram,
      color: "hover:text-pink-400",
    },
    {
      icon: <Facebook className="w-6 h-6" />,
      name: "Facebook",
      url: restaurantInfo.socialMedia.facebook,
      color: "hover:text-blue-400",
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      name: "Twitter",
      url: restaurantInfo.socialMedia.twitter,
      color: "hover:text-sky-400",
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-slate-100">Contact </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Us
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We'd love to hear from you. Get in touch with us for reservations,
            inquiries, or feedback.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-6">
                Get in Touch
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Whether you want to make a reservation, have questions about our
                menu, or need assistance with your order, we're here to help.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, i) => (
                <Card
                  key={i}
                  className="bg-slate-800/80 border-slate-700 hover:border-amber-500/30 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center group-hover:bg-amber-500/30 transition-colors duration-300">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">
                          {info.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          {info.content}
                        </p>
                        {info.action && (
                          <a
                            href={info.action}
                            className="inline-block mt-3 text-amber-400 hover:text-amber-300 transition-colors duration-200 text-sm font-medium"
                            target={
                              info.title === "Address" ? "_blank" : "_self"
                            }
                            rel={
                              info.title === "Address"
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            {info.title === "Address"
                              ? "View on Maps"
                              : info.title === "Phone"
                              ? "Call Now"
                              : "Email Now"}
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Hours */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-100">
                  <Clock className="w-6 h-6 text-amber-400 mr-3" />
                  Opening Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Row label="Monday - Saturday" value={restaurantInfo.hours.monday} />
                    <Row label="Friday - Saturday" value={restaurantInfo.hours.friday} accent />
                    <Row label="Sunday" value={restaurantInfo.hours.sunday} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social */}
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 transition-all duration-300 hover:bg-slate-700 transform hover:scale-110 ${s.color}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100 text-2xl">
                  Send us a Message
                </CardTitle>
                <p className="text-slate-400">We'll respond within 24 hours</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                    <Field
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                    />
                  </div>

                  <Field
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />

                  <Field
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What is this regarding?"
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-slate-700 border-slate-600 text-slate-100 focus:border-amber-500 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">
            Find Us
          </h2>
          <Card className="bg-slate-800/80 border-slate-700 overflow-hidden">
            <div className="aspect-video bg-slate-700 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-100 mb-2">
                  Interactive Map
                </h3>
                <p className="text-slate-400 mb-4">
                  Google Maps integration will be added here
                </p>
                <p className="text-slate-500 text-sm">{restaurantInfo.address}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent = false }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400">{label}</span>
      <span className={accent ? "text-amber-400 font-medium" : "text-slate-300"}>
        {value}
      </span>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-2">
        {label}
      </label>
      <Input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="bg-slate-700 border-slate-600 text-slate-100 focus:border-amber-500"
        placeholder={placeholder}
      />
    </div>
  );
}