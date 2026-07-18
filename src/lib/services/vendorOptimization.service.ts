import { GROCERY_PRODUCTS, GROCERY_VENDORS, matchProductsForIngredient } from '../mock-data/grocery';
import { GroceryProduct, GroceryVendor } from '../types/grocery-ecosystem';

export interface VendorOptimizationOption {
  type: 'fastest' | 'cheapest' | 'premium' | 'multi-vendor';
  totalPrice: number;
  etaMins: number;
  vendorsUsed: GroceryVendor[];
  matchedProducts: GroceryProduct[];
  missingItems: string[]; // Names of ingredients that couldn't be fulfilled
}

export interface SubstitutionSuggestion {
  originalIngredient: string;
  suggestedProduct: GroceryProduct;
  reason: string;
}

export const computeVendorOptimizations = async (
  ingredientNames: string[]
): Promise<VendorOptimizationOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const candidatesMap: Record<string, GroceryProduct[]> = {};
      
      ingredientNames.forEach(ing => {
        const productIds = matchProductsForIngredient(ing);
        candidatesMap[ing] = productIds.map(id => GROCERY_PRODUCTS.find(p => p.id === id)!).filter(Boolean);
      });

      const options: VendorOptimizationOption[] = [];

      const buildOption = (
        type: 'fastest' | 'cheapest' | 'premium' | 'multi-vendor',
        selectionFn: (candidates: GroceryProduct[]) => GroceryProduct | undefined
      ): VendorOptimizationOption => {
        let totalPrice = 0;
        let maxEta = 0;
        const vendorsUsedSet = new Set<string>();
        const matchedProducts: GroceryProduct[] = [];
        const missingItems: string[] = [];

        ingredientNames.forEach(ing => {
          const cands = candidatesMap[ing] || [];
          if (cands.length === 0) {
            missingItems.push(ing);
            return;
          }
          const selected = selectionFn(cands);
          if (selected) {
            matchedProducts.push(selected);
            totalPrice += selected.price;
            vendorsUsedSet.add(selected.vendorId);
            const vendorEta = GROCERY_VENDORS.find(v => v.id === selected.vendorId)?.etaMins || 0;
            if (vendorEta > maxEta) maxEta = vendorEta;
          } else {
            missingItems.push(ing);
          }
        });

        const vendorsUsed = Array.from(vendorsUsedSet).map(vid => GROCERY_VENDORS.find(v => v.id === vid)!).filter(Boolean);

        return {
          type,
          totalPrice,
          etaMins: maxEta,
          vendorsUsed,
          matchedProducts,
          missingItems
        };
      };

      // 1. Cheapest: lowest price product across all vendors
      options.push(buildOption('cheapest', (cands) => cands.sort((a, b) => a.price - b.price)[0]));

      // 2. Fastest: consolidate to the vendor with fastest ETA that has most items
      const vendorItemCounts: Record<string, number> = {};
      ingredientNames.forEach(ing => {
        const cands = candidatesMap[ing] || [];
        const vSet = new Set(cands.map(c => c.vendorId));
        vSet.forEach(v => vendorItemCounts[v] = (vendorItemCounts[v] || 0) + 1);
      });
      
      const bestVendorId = Object.keys(vendorItemCounts).sort((a, b) => {
         if (vendorItemCounts[b] !== vendorItemCounts[a]) return vendorItemCounts[b] - vendorItemCounts[a];
         const vA = GROCERY_VENDORS.find(v => v.id === a)!;
         const vB = GROCERY_VENDORS.find(v => v.id === b)!;
         return vA.etaMins - vB.etaMins;
      })[0];

      options.push(buildOption('fastest', (cands) => {
        const fromBest = cands.find(c => c.vendorId === bestVendorId);
        return fromBest || cands.sort((a, b) => a.price - b.price)[0];
      }));

      // 3. Premium: Highest price / premium brand
      options.push(buildOption('premium', (cands) => cands.sort((a, b) => b.price - a.price)[0]));

      // 4. Multi-vendor (if different from cheapest)
      options.push(buildOption('multi-vendor', (cands) => cands.length > 1 ? cands[1] : cands[0]));

      // Remove duplicate options (e.g., if fastest ends up being the cheapest)
      const uniqueOptions = options.filter((opt, index, self) =>
        index === self.findIndex((t) => (
          t.type === opt.type || (t.totalPrice === opt.totalPrice && t.vendorsUsed.length === opt.vendorsUsed.length)
        ))
      );

      resolve(uniqueOptions);
    }, 400);
  });
};

export const suggestSubstitutions = async (
  outOfStockIngredient: string
): Promise<SubstitutionSuggestion | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pIds = matchProductsForIngredient(outOfStockIngredient);
      if (pIds.length > 0) {
        // Pick a random alternative or the first one
        const altId = pIds.length > 1 ? pIds[1] : pIds[0];
        const prod = GROCERY_PRODUCTS.find(p => p.id === altId);
        if (prod) {
           resolve({
             originalIngredient: outOfStockIngredient,
             suggestedProduct: prod,
             reason: `This ${prod.brand} item is an excellent substitute.`
           });
           return;
        }
      }
      resolve(null);
    }, 200);
  });
};
