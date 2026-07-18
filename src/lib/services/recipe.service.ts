import { AI_RECIPES, matchProductsForIngredient } from '../mock-data/grocery';
import { AIRecipe } from '../types/grocery-ecosystem';

export const generateRecipeFromPrompt = async (prompt: string): Promise<AIRecipe> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerPrompt = prompt.toLowerCase();
      let matchedRecipe = AI_RECIPES.find(r => lowerPrompt.includes(r.name.toLowerCase()));
      
      if (!matchedRecipe) {
        // Clean up prompt for title
        const cleanName = prompt.trim();
        const dishName = cleanName.length > 40 ? cleanName.substring(0, 40) + '...' : cleanName;
        const capitalizedName = dishName.charAt(0).toUpperCase() + dishName.slice(1);
        
        // Find potential ingredients by matching keywords from our supported mock list
        const allKeywords = [
          'Chicken', 'Butter', 'Tomato Puree', 'Dosa Batter', 'Potatoes', 'Oil', 
          'Frozen Samosas', 'Curd', 'Chaat Masala', 'Basmati Rice', 'Mixed Veggies', 
          'Biryani Masala', 'Pizza Base', 'Paneer', 'Cheese', 'Salt', 'Sugar', 
          'Atta', 'Toor Dal', 'Milk', 'Onion', 'Tomato', 'Bread', 'Eggs', 'Watermelon',
          'Mango', 'Apple', 'Grapes', 'Banana', 'Carrot', 'Broccoli', 'Peas'
        ];
        
        const dynamicIngredients: any[] = [];
        const addedKws = new Set();
        
        allKeywords.forEach(kw => {
          if (lowerPrompt.includes(kw.toLowerCase()) && !addedKws.has(kw)) {
             dynamicIngredients.push({
               name: kw,
               quantity: 'Required amount',
               productIdMapping: matchProductsForIngredient(kw)
             });
             addedKws.add(kw);
          }
        });

        // Add some default ingredients if none matched or very few matched
        if (dynamicIngredients.length === 0) {
           dynamicIngredients.push({ name: 'Salt', quantity: 'To taste', productIdMapping: matchProductsForIngredient('Salt') });
           dynamicIngredients.push({ name: 'Oil', quantity: '2 tbsp', productIdMapping: matchProductsForIngredient('Oil') });
           dynamicIngredients.push({ name: 'Mixed Veggies', quantity: '250g', productIdMapping: matchProductsForIngredient('Mixed Veggies') });
        }
        
        matchedRecipe = {
          id: `dyn_${Date.now()}`,
          name: capitalizedName,
          description: `A custom AI-generated culinary experience tailored for "${prompt}".`,
          prepTime: Math.floor(Math.random() * 30) + 15,
          difficulty: 'Medium',
          calories: Math.floor(Math.random() * 400) + 200,
          imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
          ingredients: dynamicIngredients,
          instructions: [
            "Prepare all the selected ingredients.",
            "Follow standard cooking procedures for this dish.",
            "Serve hot and enjoy your custom creation!"
          ]
        };
      }
      
      resolve(matchedRecipe);
    }, 600); // Simulated 600ms "AI thinking" delay
  });
};

export const getAllRecipes = async (): Promise<AIRecipe[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(AI_RECIPES);
    }, 100);
  });
};
