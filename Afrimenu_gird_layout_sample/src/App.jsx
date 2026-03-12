import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Plus, Minus, X, Utensils, ChevronLeft } from 'lucide-react';

// --- MOCK DATA ---
// Mirrors the data structure from Menu.js / menu-manager-app.jsx
const mockMenuData = {
  name: "Lumina Botanica",
  description: "<p>Experience a fusion of <strong>global flavors</strong> in a radiant, nature-inspired atmosphere.</p>",
  styling: {
    colorAccent1: "#0f172a", // Deep Slate (Primary Header/Text)
    colorAccent2: "#10b981", // Emerald (Secondary accents)
    colorAccent3: "#f59e0b", // Amber (Call to action / Add buttons)
    backgroundUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874&auto=format&fit=crop",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=LB&backgroundColor=0f172a&textColor=10b981",
  },
  sections: [
    {
      id: "sec_1",
      name: "Signature Cocktails",
      description: "Handcrafted with premium spirits and fresh, local botanicals.",
      items: [
        {
          id: "item_101",
          name: "Midnight Orchid",
          description: "Butterfly pea infused gin, elderflower, fresh lemon, and a touch of magic.",
          price: 18,
          image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=2866&auto=format&fit=crop",
          category: "drink",
          available: true
        },
        {
          id: "item_102",
          name: "Smoked Ember Old Fashioned",
          description: "Aged bourbon, maple cedar smoke, angostura, and brandied cherry.",
          price: 22,
          image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2940&auto=format&fit=crop",
          category: "drink",
          available: true
        },
        {
          id: "item_103",
          name: "Spiced Hibiscus Margarita",
          description: "Tequila blanco, house-made hibiscus syrup, fresh lime, chili salt rim.",
          price: 16,
          image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=2000&auto=format&fit=crop",
          category: "drink",
          available: true
        },
        {
          id: "item_104",
          name: "Golden Hour Spritz",
          description: "Prosecco, bitter orange liqueur, sparkling water, thyme sprig.",
          price: 14,
          image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2000&auto=format&fit=crop",
          category: "drink",
          available: true
        }
      ]
    },
    {
      id: "sec_2",
      name: "Artisan Plates",
      description: "Beautifully composed dishes perfect for sharing.",
      items: [
        {
          id: "item_201",
          name: "Truffle Burrata Toast",
          description: "Creamy burrata, shaved black truffle, hot honey, sourdough.",
          price: 24,
          image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=2792&auto=format&fit=crop",
          category: "food",
          available: true
        },
        {
          id: "item_202",
          name: "Seared Hokkaido Scallops",
          description: "Cauliflower purée, brown butter caper sauce, micro-greens.",
          price: 36,
          image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=2940&auto=format&fit=crop",
          category: "food",
          available: true
        },
        {
          id: "item_203",
          name: "Wagyu Beef Sliders",
          description: "Brioche buns, caramelized onion jam, gruyere cheese.",
          price: 28,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2799&auto=format&fit=crop",
          category: "food",
          available: false // Demonstrating sold-out state
        },
        {
          id: "item_204",
          name: "Crispy Maitake Mushrooms",
          description: "Tempura fried local maitake, yuzu kosho aioli, togarashi.",
          price: 18,
          image: "https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?q=80&w=2000&auto=format&fit=crop",
          category: "food",
          available: true
        },
        {
          id: "item_205",
          name: "Miso Glazed Black Cod",
          description: "Sustainably caught cod, sweet miso marinade, pickled ginger shoot.",
          price: 38,
          image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2000&auto=format&fit=crop",
          category: "food",
          available: true
        }
      ]
    },
    {
      id: "sec_3",
      name: "Decadent Desserts",
      description: "End your evening on a sweet note.",
      items: [
        {
          id: "item_301",
          name: "Matcha Lava Cake",
          description: "Warm matcha white chocolate center, black sesame ice cream.",
          price: 16,
          image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?q=80&w=2948&auto=format&fit=crop",
          category: "food",
          available: true
        },
        {
          id: "item_302",
          name: "Yuzu Meringue Tart",
          description: "Crisp butter shell, tart yuzu curd, toasted marshmallow meringue.",
          price: 14,
          image: "https://images.unsplash.com/photo-1501432781167-c0ccfd492297?q=80&w=2000&auto=format&fit=crop",
          category: "food",
          available: true
        }
      ]
    }
  ]
};

// --- HELPER UTILS ---
const formatPrice = (num) => `$${Number(num).toFixed(2)}`;
const hexToRgba = (hex, opacity) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    c = '0x' + c.join('');
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')}, ${opacity})`;
  }
  return `rgba(0, 0, 0, ${opacity})`;
};

// --- SUBCOMPONENTS ---

const HeroHeader = ({ menu }) => (
  <div className="relative w-full h-[40vh] min-h-[300px] flex items-end justify-center pb-12 overflow-hidden">
    {/* Background Image with Parallax-feel & Gradient Overlay */}
    <div 
      className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
      style={{ backgroundImage: `url(${menu.styling.backgroundUrl})` }}
    />
    <div 
      className="absolute inset-0"
      style={{ 
        background: `linear-gradient(to bottom, transparent 0%, ${hexToRgba(menu.styling.colorAccent1, 0.9)} 100%)` 
      }} 
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 animate-in slide-in-from-bottom-8 duration-700">
      {menu.styling.logoUrl && (
        <img 
          src={menu.styling.logoUrl} 
          alt={`${menu.name} Logo`} 
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/20 shadow-2xl mb-4 object-cover backdrop-blur-sm bg-white/10"
        />
      )}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-md">
        {menu.name}
      </h1>
      <div 
        className="text-white/80 text-sm sm:text-base max-w-lg leading-relaxed font-medium [&>p]:mb-2 last:[&>p]:mb-0"
        dangerouslySetInnerHTML={{ __html: menu.description }}
      />
    </div>
  </div>
);

const PictureItemCard = ({ item, quantity, onAdd, onRemove, accentColor }) => {
  const isAvailable = item.available !== false;

  return (
    <div className={`group flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!isAvailable ? 'opacity-60 grayscale-[0.8]' : ''}`}>
      {/* Immersive Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Utensils size={48} />
          </div>
        )}
        
        {/* Price Tag Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl font-bold text-gray-900 shadow-sm border border-white/20 text-sm">
          {formatPrice(item.price)}
        </div>

        {/* Out of stock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-full tracking-wider text-sm uppercase shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        <p 
          className="text-gray-500 text-[13px] sm:text-sm leading-relaxed mb-5 flex-grow line-clamp-3"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />

        {/* Action Area */}
        <div className="mt-auto">
          {isAvailable ? (
            quantity > 0 ? (
              <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <button 
                  onClick={onRemove} 
                  className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-700 active:scale-95 transition-transform"
                >
                  <Minus size={18} strokeWidth={2.5} />
                </button>
                <span className="font-bold text-gray-900 text-lg w-10 text-center">
                  {quantity}
                </span>
                <button 
                  onClick={onAdd} 
                  className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl shadow-sm text-white active:scale-95 transition-transform"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onAdd} 
                className="w-full py-3.5 sm:py-3 rounded-2xl font-bold text-white shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-[15px] sm:text-base"
                style={{ backgroundColor: accentColor }}
              >
                <Plus size={18} strokeWidth={3} />
                Add to Order
              </button>
            )
          ) : (
             <button disabled className="w-full py-3.5 sm:py-3 rounded-2xl font-bold text-gray-400 bg-gray-100 cursor-not-allowed text-[15px] sm:text-base">
               Unavailable
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

const FloatingCart = ({ cartTotalItems, cartTotalPrice, onOpenCart, accentColor }) => {
  if (cartTotalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-safe pt-4 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent animate-in slide-in-from-bottom-10 duration-300">
      <button 
        onClick={onOpenCart}
        className="w-full max-w-md flex items-center justify-between p-4 mb-2 rounded-3xl shadow-2xl text-white backdrop-blur-xl border border-white/20 active:scale-95 transition-all"
        style={{ 
          background: `linear-gradient(135deg, ${accentColor}, ${hexToRgba(accentColor, 0.8)})` 
        }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center relative">
            <ShoppingCart size={22} color="white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {cartTotalItems}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-white/80">Current Order</span>
            <span className="font-extrabold text-xl">{formatPrice(cartTotalPrice)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 font-bold text-white/90 mr-2">
          View <ChevronLeft className="rotate-180 w-5 h-5" />
        </div>
      </button>
    </div>
  );
};

const CartPanel = ({ isOpen, onClose, cart, total, onUpdateQuantity, accentColor }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-400 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-900">Your Order</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart size={48} strokeWidth={1} />
              <p className="font-medium text-lg">Your tray is empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-gray-100" />
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-800 leading-tight pr-2">{item.name}</h4>
                      <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 sm:w-8 sm:h-8 flex justify-center items-center bg-white rounded-lg shadow-sm text-gray-600 active:scale-95"><Minus size={16} /></button>
                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 sm:w-8 sm:h-8 flex justify-center items-center bg-white rounded-lg shadow-sm text-gray-600 active:scale-95"><Plus size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Area */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 pb-safe">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Total Balance</span>
              <span className="text-3xl font-black text-gray-900">{formatPrice(total)}</span>
            </div>
            <button 
              className="w-full py-4 rounded-2xl font-bold text-white shadow-xl hover:opacity-90 active:scale-95 transition-all text-lg"
              style={{ backgroundColor: accentColor }}
              onClick={() => alert('This is a preview. Order submission is mocked.')}
            >
              Confirm Order
            </button>
          </div>
        )}
      </div>
    </>
  );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const menu = mockMenuData;
  const { colorAccent1, colorAccent2, colorAccent3 } = menu.styling;
  
  const [cart, setCart] = useState([]);
  const [activeSection, setActiveSection] = useState(menu.sections[0]?.id || '');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const sectionRefs = useRef({});
  const navRef = useRef(null);

  // Scroll detection for sticky nav styling & IntersectionObserver for active tab
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 250);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -75% 0px' });

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Center active nav pill
  useEffect(() => {
    if (!navRef.current || !activeSection) return;
    const activeBtn = navRef.current.querySelector(`[data-id="${activeSection}"]`);
    if (activeBtn) {
      const scrollLeft = activeBtn.offsetLeft - (navRef.current.clientWidth / 2) + (activeBtn.clientWidth / 2);
      navRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeSection]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // Sticky nav height approx
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Cart Operations
  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    }
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 pb-32">
      
      {/* Hero Section */}
      <HeroHeader menu={menu} />

      {/* Sticky Category Navigation */}
      <div 
        className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-[#F8FAFC]'}`}
      >
        <div ref={navRef} className="flex px-4 py-3 sm:py-4 overflow-x-auto scrollbar-hide gap-3 scroll-smooth max-w-7xl mx-auto">
          {menu.sections.map(section => (
            <button
              key={section.id}
              data-id={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                activeSection === section.id 
                  ? 'text-white shadow-md' 
                  : 'bg-white text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50'
              }`}
              style={{ backgroundColor: activeSection === section.id ? colorAccent1 : undefined }}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content Grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6 space-y-12 sm:space-y-16">
        {menu.sections.map((section) => (
          <section 
            key={section.id} 
            id={section.id} 
            ref={el => sectionRefs.current[section.id] = el}
            className="scroll-mt-28"
          >
            {/* Section Header */}
            <div className="mb-6 sm:mb-8 flex flex-col items-center sm:items-start px-2 sm:px-0">
              <h2 
                className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 relative inline-block text-center sm:text-left"
                style={{ color: colorAccent1 }}
              >
                {section.name}
                <div 
                  className="absolute -bottom-2 left-1/4 right-1/4 sm:left-0 sm:right-0 h-1 rounded-full opacity-20"
                  style={{ backgroundColor: colorAccent2 }}
                />
              </h2>
              {section.description && (
                <p className="text-gray-500 font-medium text-center sm:text-left mt-3 max-w-2xl text-sm sm:text-base">
                  {section.description}
                </p>
              )}
            </div>

            {/* Items Grid - Picture Focused */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {section.items.map(item => {
                const cartItem = cart.find(c => c.id === item.id);
                return (
                  <PictureItemCard
                    key={item.id}
                    item={item}
                    quantity={cartItem ? cartItem.quantity : 0}
                    onAdd={() => handleAddToCart(item)}
                    onRemove={() => handleUpdateQuantity(item.id, cartItem.quantity - 1)}
                    accentColor={colorAccent3}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Floating Elements */}
      <FloatingCart 
        cartTotalItems={cartTotalItems}
        cartTotalPrice={cartTotalPrice}
        onOpenCart={() => setIsCartOpen(true)}
        accentColor={colorAccent3}
      />

      <CartPanel 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        total={cartTotalPrice}
        onUpdateQuantity={handleUpdateQuantity}
        accentColor={colorAccent3}
      />

      {/* Global styles required for hiding scrollbars but keeping functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 2rem);
        }
      `}} />
    </div>
  );
}