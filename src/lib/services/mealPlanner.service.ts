import { AI_RECIPES } from '../mock-data/grocery';
import { AIRecipe } from '../types/grocery-ecosystem';

export interface MealPlanDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: AIRecipe;
  lunch: AIRecipe;
  dinner: AIRecipe;
}

const DAYS_OF_WEEK: MealPlanDay['day'][] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const generateWeeklyMealPlan = async (): Promise<MealPlanDay[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock meal planner: pick random recipes for each meal of the day
      const plan: MealPlanDay[] = DAYS_OF_WEEK.map(day => {
        const getRandomRecipe = () => AI_RECIPES[Math.floor(Math.random() * AI_RECIPES.length)];
        
        return {
          day,
          breakfast: getRandomRecipe(),
          lunch: getRandomRecipe(),
          dinner: getRandomRecipe()
        };
      });
      
      resolve(plan);
    }, 800); // Simulated delay for generating a full week's plan
  });
};
