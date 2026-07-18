"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Mic, 
  Send, 
  ChefHat, 
  Clock, 
  Flame, 
  ChevronRight,
  Gift,
  ShoppingCart,
  Users,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Trash2,
  Minus,
  Plus,
  Zap,
  Truck,
  Star,
  RefreshCw,
  Info,
  Store,
  MapPin
} from 'lucide-react';
import { AIRecipe, GroceryProduct, GroceryVendor } from '@/lib/types/grocery-ecosystem';
import { generateRecipeFromPrompt } from '@/lib/services/recipe.service';
import { getAllProducts } from '@/lib/services/groceryProduct.service';
import { getAllVendors } from '@/lib/services/groceryVendor.service';
import { computeVendorOptimizations, suggestSubstitutions, VendorOptimizationOption, SubstitutionSuggestion } from '@/lib/services/vendorOptimization.service';
import { RECIPE_KITS } from '@/lib/mock-data/grocery';
import { useRecipeStore } from '@/store/recipeStore';
import { useIngredientStore } from '@/store/ingredientStore';
import { usePantryStore } from '@/store/pantryStore';
import { useGroceryCartStore } from '@/store/groceryCartStore';
import { list as listRestaurants } from '@/lib/services/restaurant.service';
import { Restaurant } from '@/lib/types/restaurant';

const SUGGESTIONS = [
  "Butter Chicken",
  "Paneer Butter Masala",
  "Dinner for 4 under 600 rupees",
  "Healthy Meal",
  "Breakfast under 200 rupees",
  "I have Eggs and Bread",
  "Weekly Meal Plan",
  "Party Menu"
];

const SMART_PANTRY_ITEMS = ["Salt", "Sugar", "Oil", "Turmeric", "Chilli Powder", "Butter"];

export default function AIKitchenPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { currentRecipe, setCurrentRecipe } = useRecipeStore();
  const { selections, setSelection, updateQuantity, removeSelection, clearSelections } = useIngredientStore();
  const { checkedItemIds, toggleItem, items: pantryItems, hasItemByName } = usePantryStore();
  const { addToCart } = useGroceryCartStore();

  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [vendors, setVendors] = useState<GroceryVendor[]>([]);
  const [isIngredientsExpanded, setIsIngredientsExpanded] = useState(false);

  // Vendor Optimization State
  const [optimizations, setOptimizations] = useState<VendorOptimizationOption[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [substitutions, setSubstitutions] = useState<Record<string, SubstitutionSuggestion>>({});

  // Flagship Inter-Ecosystem Tabs State
  const [activeMode, setActiveMode] = useState<'cook' | 'order'>('cook');
  const [deliveryRestaurants, setDeliveryRestaurants] = useState<Restaurant[]>([]);
  const [hasReadyMade, setHasReadyMade] = useState(false);

  // Leftover Mode State
  const [isLeftoverMode, setIsLeftoverMode] = useState(false);
  const [leftoverIngredients, setLeftoverIngredients] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([getAllProducts(), getAllVendors()]).then(([p, v]) => {
      setProducts(p);
      setVendors(v);
    });
  }, []);

  const handlePromptSubmit = async (text: string) => {
    if (!text.trim()) return;
    setPrompt(text);
    setIsTyping(true);
    setCurrentRecipe(null);
    clearSelections();
    setIsIngredientsExpanded(false);
    setOptimizations([]);
    setSubstitutions({});
    setHasReadyMade(false);
    
    let parsedLeftovers: string[] = [];
    if (isLeftoverMode) {
      parsedLeftovers = text.split(',').map(s => s.trim().toLowerCase());
      setLeftoverIngredients(parsedLeftovers);
    } else {
      setLeftoverIngredients([]);
    }
    
    try {
      const result = await generateRecipeFromPrompt(text);
      setCurrentRecipe(result);
      
      const ingredientsToOpt: string[] = [];

      // Prepopulate default selections for the recipe
      result.ingredients.forEach(ing => {
        const isLeftover = isLeftoverMode && parsedLeftovers.some(l => ing.name.toLowerCase().includes(l));
        if (!hasItemByName(ing.name) && !isLeftover) {
          ingredientsToOpt.push(ing.name);
          const matchedIds = ing.productIdMapping || [];
          const matchedProducts = products.filter(p => matchedIds.includes(p.id));
          
          if (matchedProducts.length > 0) {
            const defaultProd = matchedProducts[0];
            if (defaultProd.id.endsWith('3') || defaultProd.id.endsWith('7')) {
              suggestSubstitutions(ing.name).then(sub => {
                if (sub) setSubstitutions(prev => ({ ...prev, [ing.name]: sub }));
              });
            }
            setSelection(ing.name, defaultProd, 1);
          }
        }
      });

      // Run vendor optimization
      if (ingredientsToOpt.length > 0) {
        setIsOptimizing(true);
        const opts = await computeVendorOptimizations(ingredientsToOpt);
        setOptimizations(opts);
        setIsOptimizing(false);
      }

      // Check for ready-made food delivery options
      const rests = await listRestaurants();
      if (rests.length > 0) {
        setDeliveryRestaurants(rests.slice(0, 3)); // Mock 3 matching restaurants
        setHasReadyMade(true);
        setActiveMode('cook');
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  // Re-sync selections if pantry changes
  useEffect(() => {
    if (currentRecipe) {
      currentRecipe.ingredients.forEach(ing => {
        const isLeftover = isLeftoverMode && leftoverIngredients.some(l => ing.name.toLowerCase().includes(l));
        if (hasItemByName(ing.name) || isLeftover) {
          removeSelection(ing.name);
        } else if (!selections[ing.name]) {
          const matchedIds = ing.productIdMapping || [];
          const matchedProducts = products.filter(p => matchedIds.includes(p.id));
          if (matchedProducts.length > 0) {
            setSelection(ing.name, matchedProducts[0], 1);
          }
        }
      });
    }
  }, [checkedItemIds, currentRecipe, isLeftoverMode, leftoverIngredients]);

  const getEstimatedCost = () => {
    let total = 0;
    Object.values(selections).forEach(sel => {
      total += sel.selectedProduct.price * sel.quantity;
    });
    return total;
  };

  const getVendorName = (vid: string) => vendors.find(v => v.id === vid)?.name || 'Unknown Vendor';

  const applyOptimization = (opt: VendorOptimizationOption) => {
    opt.matchedProducts.forEach(mp => {
      const ing = currentRecipe?.ingredients.find(i => i.productIdMapping?.includes(mp.id));
      if (ing) {
        const existingQty = selections[ing.name]?.quantity || 1;
        setSelection(ing.name, mp, existingQty);
      }
    });
  };

  const swapSubstitution = (ingName: string) => {
    const sub = substitutions[ingName];
    if (sub) {
      const existingQty = selections[ingName]?.quantity || 1;
      setSelection(ingName, sub.suggestedProduct, existingQty);
      const newSubs = { ...substitutions };
      delete newSubs[ingName];
      setSubstitutions(newSubs);
    }
  };

  const activeVendors = Array.from(new Set(Object.values(selections).map(s => s.selectedProduct.vendorId)));

  return (
    <div className="w-full pb-16 flex flex-col items-center">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <div className="w-full px-4 md:px-6 pt-4 md:pt-6">
        <section className="relative w-full h-[460px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80&auto=format&fit=crop"
            alt="Cooking kitchen"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/65"></div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8 max-w-3xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
              Powered by AI
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5A36] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5A36]"></span>
              </span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-4"
          >
            Your AI <span className="text-[#FF5A36]">Kitchen</span> Assistant
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white/80 text-base md:text-lg font-medium max-w-lg mb-6"
          >
            Tell me what you're craving, what's in your fridge, or your budget — I'll craft the perfect recipe.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold"><ChefHat className="w-3.5 h-3.5 text-orange-400" /> Smart Recipes</span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold"><ShoppingCart className="w-3.5 h-3.5 text-emerald-400" /> Auto Cart</span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Pantry Aware</span>
          </motion.div>
        </div>
        </section>
      </div>

      {/* ═══════════ PAGE CONTENT ═══════════ */}
      <div className="w-full max-w-4xl px-4 md:px-6 flex flex-col gap-10 pt-8">

        {/* Recipe Kits */}
        {!currentRecipe && !isTyping && (
          <div className="w-full flex flex-col gap-4 mt-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#FF5A36]" /> Curated Seasonal Kits
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x w-full">
              {RECIPE_KITS.map((kit, i) => (
                <div 
                  key={kit.id}
                  onClick={() => handlePromptSubmit(`I want the ${kit.name}`)}
                  className="snap-start shrink-0 w-72 md:w-80 h-40 rounded-3xl relative overflow-hidden group cursor-pointer border border-gray-200 dark:border-gray-800 shadow-lg"
                >
                  <img 
                    src={`https://loremflickr.com/400/300/food?lock=${200 + i}`} 
                    alt={kit.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1">
                    <div className="text-[10px] uppercase font-black text-purple-400 tracking-wider bg-[#FF5A36]/20 backdrop-blur-md self-start px-2 py-0.5 rounded">
                      {kit.occasion}
                    </div>
                    <h4 className="text-white font-bold text-lg leading-tight">{kit.name}</h4>
                    <div className="flex justify-between items-end mt-1">
                      <span className="text-emerald-400 font-bold text-sm">₹{kit.totalPrice}</span>
                      <span className="text-white/60 text-xs font-bold line-through">₹{Math.floor(kit.totalPrice / (1 - kit.discountPercentage/100))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Input Box */}
        <div className="w-full relative z-20">
          <div className="w-full bg-white dark:bg-gray-900 rounded-[2rem] p-3 shadow-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-3">
            <button className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#FF5A36] dark:hover:text-[#FF5A36] transition-colors shrink-0">
              <Mic className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder={isLeftoverMode ? "What ingredients do you have? e.g. Rice, Paneer..." : "e.g. Dinner for 4 under 600 rupees..."}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white text-lg placeholder:text-gray-400"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit(prompt)}
            />
            <button 
              onClick={() => handlePromptSubmit(prompt)}
              disabled={!prompt.trim() || isTyping}
              className="w-12 h-12 bg-[#FF5A36] hover:bg-[#E23744] disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors shrink-0 shadow-md shadow-[#FF5A36]/20"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>
          {/* Leftover Mode Toggle */}
          <div className="flex items-center justify-center mt-3">
            <button 
              onClick={() => setIsLeftoverMode(!isLeftoverMode)} 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${isLeftoverMode ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:text-[#FF5A36]'}`}
            >
              Leftover Mode {isLeftoverMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        {!currentRecipe && !isTyping && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2 px-4">
            {SUGGESTIONS.map((sug) => (
              <button 
                key={sug}
                onClick={() => handlePromptSubmit(sug)}
                className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-semibold hover:border-[#FF5A36] hover:text-[#FF5A36] dark:hover:text-[#FF5A36] transition-all shadow-sm"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* AI Typing Animation */}
        <AnimatePresence mode="wait">
          {isTyping && (
            <motion.div 
              key="typing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-6 py-12"
            >
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-4 border-[#FF5A36]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#FF5A36] rounded-full border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#FF5A36] animate-pulse" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse text-lg">
                Crafting the perfect culinary experience...
              </p>
            </motion.div>
          )}

          {/* Rendered Flagship Area */}
          {currentRecipe && !isTyping && (
            <motion.div 
              key="flagship-results"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full flex flex-col gap-6"
            >
              
              {/* Flagship Ecosystem Toggle Tabs */}
              {hasReadyMade && (
                <div className="flex bg-gray-200/50 dark:bg-gray-800/50 p-1.5 rounded-2xl w-full max-w-sm mx-auto shadow-inner relative overflow-hidden">
                  <button 
                    onClick={() => setActiveMode('cook')}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 z-10 ${
                      activeMode === 'cook' 
                        ? 'bg-white dark:bg-gray-900 shadow-md text-[#FF5A36]' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <ChefHat className="w-4 h-4" /> Cook at Home
                  </button>
                  <button 
                    onClick={() => setActiveMode('order')}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 z-10 ${
                      activeMode === 'order' 
                        ? 'bg-white dark:bg-gray-900 shadow-md text-red-500 dark:text-red-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <Store className="w-4 h-4" /> Order Ready-Made
                  </button>
                </div>
              )}

              {/* Cook at Home Mode */}
              {activeMode === 'cook' && (
                <>
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl flex flex-col md:flex-row">
                    
                    <div className="w-full md:w-[40%] h-64 md:h-auto relative bg-gray-100 dark:bg-gray-800">
                      <img 
                        src={currentRecipe.imageUrl || `https://loremflickr.com/800/800/food?lock=${currentRecipe.id.charCodeAt(0)}`} 
                        alt={currentRecipe.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <ChefHat className="w-4 h-4 text-[#FF5A36]" />
                        <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">AI Generated</span>
                      </div>
                    </div>

                    <div className="flex-1 p-8 md:p-10 flex flex-col">
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
                        {currentRecipe.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                        {currentRecipe.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        <div className="flex flex-col bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                          <Clock className="w-5 h-5 text-[#FF5A36] mb-2" />
                          <span className="text-xs font-bold text-gray-500 uppercase">Time</span>
                          <span className="font-bold text-gray-900 dark:text-white">{currentRecipe.prepTime} mins</span>
                        </div>
                        <div className="flex flex-col bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                          <Flame className="w-5 h-5 text-orange-500 mb-2" />
                          <span className="text-xs font-bold text-gray-500 uppercase">Calories</span>
                          <span className="font-bold text-gray-900 dark:text-white">{currentRecipe.calories} kcal</span>
                        </div>
                        <div className="flex flex-col bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                          <Users className="w-5 h-5 text-blue-500 mb-2" />
                          <span className="text-xs font-bold text-gray-500 uppercase">Serves</span>
                          <span className="font-bold text-gray-900 dark:text-white">2 - 4</span>
                        </div>
                        <div className="flex flex-col bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                          <ShoppingCart className="w-5 h-5 text-[#FF5A36] mb-2" />
                          <span className="text-xs font-bold text-gray-500 uppercase">Est. Cost</span>
                          <span className="font-bold text-gray-900 dark:text-white">₹{getEstimatedCost()}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-500 uppercase">Difficulty:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            currentRecipe.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-[#FF5A36]/20 dark:text-emerald-400' :
                            currentRecipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                          }`}>
                            {currentRecipe.difficulty}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => setIsIngredientsExpanded(true)}
                          className="w-full md:w-auto bg-[#FF5A36] hover:bg-[#E23744] text-white font-bold py-4 md:py-3 px-8 rounded-2xl transition-colors shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 group"
                        >
                          Shop Ingredients <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {optimizations.length > 0 && (
                    <div className="w-full flex flex-col gap-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#FF5A36]" /> Vendor Optimization Options
                      </h3>
                      
                      {(() => {
                        const cheapest = optimizations.find(o => o.type === 'cheapest');
                        const fastest = optimizations.find(o => o.type === 'fastest');
                        const savings = (fastest?.totalPrice || 0) - (cheapest?.totalPrice || 0);
                        const isMulti = activeVendors.length > 1 || (cheapest && cheapest.vendorsUsed.length > 1);
                        
                        if (isMulti && savings > 0) {
                          return (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-2xl flex items-start gap-3">
                              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                              <div className="text-sm text-blue-900 dark:text-blue-300">
                                <strong className="block mb-1">Single vs Multiple Vendors Comparison</strong>
                                You currently have items selected across <strong>{activeVendors.length} vendors</strong>. While you might save ₹{savings} by combining vendors, it will split your delivery into multiple ETAs. Select <em>Fastest</em> to consolidate delivery.
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {optimizations.map((opt, idx) => (
                          <button 
                            key={idx}
                            onClick={() => applyOptimization(opt)}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-[#FF5A36] transition-colors shadow-sm text-left flex flex-col gap-3 group relative overflow-hidden"
                          >
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#FF5A36]/5 rounded-full blur-xl group-hover:bg-[#FF5A36]/20 transition-colors"></div>
                            
                            <div className="flex items-center gap-2">
                              {opt.type === 'fastest' && <Zap className="w-5 h-5 text-yellow-500" />}
                              {opt.type === 'cheapest' && <Truck className="w-5 h-5 text-[#FF5A36]" />}
                              {opt.type === 'premium' && <Star className="w-5 h-5 text-[#FF5A36]" />}
                              {opt.type === 'multi-vendor' && <ShoppingCart className="w-5 h-5 text-blue-500" />}
                              <span className="font-bold text-gray-900 dark:text-white capitalize">
                                {opt.type}
                              </span>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              <span className="text-2xl font-black text-gray-900 dark:text-white">₹{opt.totalPrice}</span>
                              <span className="text-sm text-gray-500">ETA: {opt.etaMins} mins</span>
                            </div>

                            <div className="text-xs font-semibold text-gray-400 mt-2">
                              {opt.vendorsUsed.length === 1 
                                ? `1 vendor (${opt.vendorsUsed[0].name})`
                                : `${opt.vendorsUsed.length} vendors combined`}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="w-full bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden mt-2">
                    <button 
                      onClick={() => setIsIngredientsExpanded(!isIngredientsExpanded)}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="w-6 h-6 text-[#FF5A36]" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Live Ingredients Cart</span>
                      </div>
                      {isIngredientsExpanded ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
                    </button>

                    <AnimatePresence>
                      {isIngredientsExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 flex flex-col gap-6">
                            
                            <div className="bg-emerald-50 dark:bg-[#FF5A36]/5 p-5 rounded-2xl border border-emerald-100 dark:border-[#FF5A36]/10">
                              <h4 className="font-bold text-emerald-900 dark:text-emerald-400 mb-3 text-sm flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Smart Pantry: Already have these?
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {SMART_PANTRY_ITEMS.map((item) => {
                                  const pItem = pantryItems.find(i => i.name.toLowerCase() === item.toLowerCase());
                                  if (!pItem) return null;
                                  const isChecked = checkedItemIds.has(pItem.id);
                                  
                                  return (
                                    <button 
                                      key={item}
                                      onClick={() => toggleItem(pItem.id)}
                                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                        isChecked 
                                          ? 'bg-[#FF5A36] border-[#FF5A36] text-white' 
                                          : 'bg-white dark:bg-gray-900 border-emerald-200 dark:border-[#FF5A36]/30 text-emerald-700 dark:text-emerald-400'
                                      }`}
                                    >
                                      {item} {isChecked && '✓'}
                                    </button>
                                  );
                                })}
                              </div>
                              <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-2 font-medium">Checking an item removes it from your live shopping list and price estimate.</p>
                            </div>

                            <div className="flex flex-col gap-4">
                              {currentRecipe.ingredients.map(ing => {
                                if (hasItemByName(ing.name)) return null; 
                                
                                const selection = selections[ing.name];
                                if (!selection) return null;
                                
                                const matchedIds = ing.productIdMapping || [];
                                const matchedProducts = products.filter(p => matchedIds.includes(p.id));
                                const hasSub = substitutions[ing.name];
                                const isOutOfStock = selection.selectedProduct.id.endsWith('3') || selection.selectedProduct.id.endsWith('7');

                                return (
                                  <div key={ing.name} className="flex flex-col gap-2">
                                    
                                    {hasSub && isOutOfStock && (
                                      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
                                        <div className="flex items-start gap-2">
                                          <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                          <div className="text-orange-900 dark:text-orange-300">
                                            <strong>{selection.selectedProduct.name} is out of stock.</strong> {hasSub.reason}
                                          </div>
                                        </div>
                                        <button 
                                          onClick={() => swapSubstitution(ing.name)}
                                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center gap-1 shrink-0"
                                        >
                                          <RefreshCw className="w-3.5 h-3.5" /> Swap to {hasSub.suggestedProduct.name}
                                        </button>
                                      </div>
                                    )}

                                    <div className={`flex flex-col md:flex-row gap-4 p-4 rounded-2xl border ${isOutOfStock ? 'border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-900/10 grayscale-[0.3]' : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20'}`}>
                                      
                                      <div className="flex items-center gap-4 flex-1">
                                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100 dark:border-gray-700">
                                          <img src={selection.selectedProduct.imageUrl} alt={selection.selectedProduct.name} className={`w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal ${isOutOfStock ? 'opacity-50' : ''}`} />
                                        </div>
                                        <div>
                                          <div className="text-xs font-bold text-gray-500 uppercase">{ing.name} • {ing.quantity}</div>
                                          <h4 className={`font-bold text-sm mt-0.5 line-clamp-1 ${isOutOfStock ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                            {selection.selectedProduct.name}
                                          </h4>
                                          <div className="text-sm font-black text-[#FF5A36] mt-1">₹{selection.selectedProduct.price}</div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between md:justify-end gap-4 md:w-1/2">
                                        
                                        <div className="flex flex-col gap-2 w-full max-w-[200px]">
                                          <select 
                                            value={selection.selectedProduct.id}
                                            onChange={(e) => {
                                              const newProduct = products.find(p => p.id === e.target.value);
                                              if (newProduct) setSelection(ing.name, newProduct, selection.quantity);
                                            }}
                                            className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 font-medium text-gray-700 dark:text-gray-300 outline-none"
                                          >
                                            {matchedProducts.map(mp => (
                                              <option key={mp.id} value={mp.id}>
                                                {mp.brand} • ₹{mp.price} • {getVendorName(mp.vendorId)}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg h-10 overflow-hidden shrink-0">
                                          <button 
                                            onClick={() => updateQuantity(ing.name, -1)}
                                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                          <span className="w-8 text-center font-bold text-sm">
                                            {selection.quantity}
                                          </span>
                                          <button 
                                            onClick={() => updateQuantity(ing.name, 1)}
                                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </div>

                                        <button 
                                          onClick={() => removeSelection(ing.name)}
                                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                          <Trash2 className="w-5 h-5" />
                                        </button>
                                      </div>
                                      
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6 mt-2">
                              <div>
                                <div className="text-gray-500 font-medium">Final Estimated Cost</div>
                                <div className="text-2xl font-black text-gray-900 dark:text-white">₹{getEstimatedCost()}</div>
                              </div>
                              <button 
                                onClick={() => {
                                  Object.values(selections).forEach(sel => {
                                    for(let i = 0; i < sel.quantity; i++){
                                      addToCart(sel.selectedProduct);
                                    }
                                  });
                                  router.push('/grocery/cart');
                                }}
                                className="bg-[#FF5A36] hover:bg-[#E23744] text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-purple-500/25 flex items-center gap-2"
                              >
                                {isLeftoverMode ? 'Add Missing Ingredients' : 'Add to Grocery Cart'} <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}

              {/* Order Ready-Made Mode */}
              {activeMode === 'order' && (
                <div className="w-full flex flex-col gap-4 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">
                      Top spots for {currentRecipe.name}
                    </h2>
                    <div className="text-sm font-bold text-red-500 flex items-center gap-1">
                      <Flame className="w-4 h-4" /> Hot & Fresh
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {deliveryRestaurants.map((restaurant) => (
                      <div 
                        key={restaurant.id}
                        className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all group cursor-pointer flex flex-col"
                        onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                      >
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img 
                            src={restaurant.imageUrl} 
                            alt={restaurant.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-md text-sm">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {restaurant.rating}
                          </div>
                          
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div className="text-white font-bold text-lg leading-tight">{restaurant.name}</div>
                            <div className="text-white/80 font-semibold text-sm">{restaurant.priceRange}</div>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1 gap-4">
                          <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 px-2 py-1 rounded-md">
                              <Truck className="w-4 h-4" /> {restaurant.deliveryTimeMinutes} mins
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {restaurant.address.split(',')[0]}
                            </span>
                          </div>
                          
                          <button 
                            className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
                          >
                            Order Now <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
