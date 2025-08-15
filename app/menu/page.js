"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Star } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { menuItems } from "@/lib/mock";
import { useCart } from "@/providers/cart-provider";

export default function MenuPage() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // from global provider
  const { addToCart, itemCount, tableNumber } = useCart();

  const categories = useMemo(() => ["All", ...Object.keys(menuItems)], []);

  const filteredItems = useMemo(() => {
    let all = [];
    if (activeCategory === "All") {
      Object.values(menuItems).forEach((arr) => all.push(...arr));
    } else {
      all = menuItems[activeCategory] || [];
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      all = all.filter((i) => i.name.toLowerCase().includes(q));
    }
    return all;
  }, [activeCategory, searchTerm]);

  // Add from Menu, then take user to Order page (respect table if already chosen)
  const handleAdd = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
    if (tableNumber) {
      router.push(`/order/${tableNumber}`);
    } else {
      router.push("/order");
    }
  };

  const viewCartHref = tableNumber ? `/order/${tableNumber}` : "/order";

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-slate-100">Our </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Menu
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Discover authentic Indo-Arabian flavors crafted with the finest ingredients and traditional techniques
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center">
              <Filter className="w-6 h-6 text-amber-400 mr-2" />
              Categories
            </h2>
            {itemCount > 0 && (
              <Badge className="bg-amber-500 text-slate-900 px-3 py-1">
                {itemCount} items in cart
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <Button
                  key={category}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg"
                      : "border-slate-600 text-slate-300 hover:border-amber-500 hover:text-amber-400 hover:bg-slate-800/50"
                  }`}
                >
                {category}
                {category !== "All" && menuItems[category] && (
                  <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-300">
                    {menuItems[category].length}
                  </Badge>
                )}
              </Button>
            );
          })}
          </div>
        </div>

        {/* Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group bg-slate-800/80 border-slate-700/50 hover:bg-slate-800 hover:border-amber-500/30 transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <Button
                  size="sm"
                  onClick={() => handleAdd(item)}
                  className="absolute top-3 right-3 w-8 h-8 p-0 bg-amber-500/90 hover:bg-amber-500 text-slate-900 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors duration-200 leading-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center ml-2">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm text-slate-400 ml-1">4.5</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-amber-400">₹{item.price}</span>
                  <Button
                    size="sm"
                    onClick={() => handleAdd(item)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No dishes found</h3>
            <p className="text-slate-500">Try adjusting your search or browse different categories</p>
          </div>
        )}

        {/* CTA */}
        {itemCount > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-100 mb-4">Ready to Order?</h3>
              <p className="text-slate-400 mb-6">
                You have {itemCount} items in your cart.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold px-8 py-3 rounded-full shadow-xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Link href={viewCartHref}>
                  {tableNumber ? `View Cart for ${tableNumber}` : "Book Table & Order"}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}