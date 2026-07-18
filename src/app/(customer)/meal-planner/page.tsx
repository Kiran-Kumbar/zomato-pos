"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateWeeklyMealPlan, MealPlanDay } from '@/lib/services/mealPlanner.service';
import { Calendar, ChevronRight, ShoppingCart, Loader2, Sparkles, Plus } from 'lucide-react';
import { useGroceryCartStore } from '@/store/groceryCartStore';
import { getAllProducts } from '@/lib/services/groceryProduct.service';
import { GroceryProduct } from '@/lib/types/grocery-ecosystem';
import { useRouter } from 'next/navigation';

export default function MealPlannerPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<MealPlanDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const { addToCart } = useGroceryCartStore();

  useEffect(() => {
    Promise.all([generateWeeklyMealPlan(), getAllProducts()]).then(([p, prods]) => {
      setPlan(p);
      setProducts(prods);
      setIsLoading(false);
    });
  }, []);

  const addEverythingToCart = () => {
    // Collect all ingredients from all recipes
    const allIngredients = new Set<string>();
    plan.forEach(day => {
      day.breakfast.ingredients.forEach(i => allIngredients.add(i.name));
      day.lunch.ingredients.forEach(i => allIngredients.add(i.name));
      day.dinner.ingredients.forEach(i => allIngredients.add(i.name));
    });

    // Map ingredients to first matched product and add to cart
    Array.from(allIngredients).forEach(ingName => {
      // Find a recipe that has this ingredient to get the mapping
      let mapping: string[] | undefined;
      for (const day of plan) {
        for (const meal of [day.breakfast, day.lunch, day.dinner]) {
          const ing = meal.ingredients.find(i => i.name === ingName);
          if (ing && ing.productIdMapping) {
            mapping = ing.productIdMapping;
            break;
          }
        }
        if (mapping) break;
      }
      
      if (mapping && mapping.length > 0) {
        const product = products.find(p => p.id === mapping![0]);
        if (product) addToCart(product);
      }
    });

    router.push('/grocery/cart');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col items-center justify-center pt-24">
        <Loader2 className="w-10 h-10 text-[#FF5A36] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generating AI Meal Plan...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <section className="flex flex-col gap-6 mt-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-extrabold tracking-tight"
              >
                Weekly <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] to-orange-400">Meal</span> Planner.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-2 text-gray-500 dark:text-gray-400 font-medium"
              >
                Plan your meals and auto-generate grocery lists.
              </motion.p>
            </div>
          </section>
          <button 
            onClick={addEverythingToCart}
            className="bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-4 px-8 rounded-2xl transition-colors flex items-center justify-center gap-2 group hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            Add Week's Groceries
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {plan.map((day) => (
            <div key={day.day} className="flex flex-col gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-full py-2 text-center border border-gray-200 dark:border-gray-800 shadow-sm sticky top-24 z-10">
                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">{day.day.slice(0, 3)}</span>
              </div>
              
              {(['breakfast', 'lunch', 'dinner'] as const).map(mealType => {
                const recipe = day[mealType];
                return (
                  <div 
                    key={mealType} 
                    className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#FF5A36]/50 transition-all cursor-pointer group"
                    onClick={() => router.push(`/cooking-mode/${encodeURIComponent(recipe.name)}`)}
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      {mealType}
                    </div>
                    <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 mb-3 overflow-hidden relative">
                      <img 
                        src={recipe.imageUrl || `https://loremflickr.com/400/400/food?lock=${day.day.length * recipe.calories}`} 
                        alt={recipe.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">
                      {recipe.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-gray-500">{recipe.prepTime}m</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                      <span className="text-xs font-bold text-[#FF5A36]">{recipe.calories}cal</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
