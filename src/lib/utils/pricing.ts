import { MenuItem } from '../types/menuItem';

/**
 * Calculates the total price of a given MenuItem including chosen variant and add-ons.
 * @param item The base MenuItem
 * @param quantity Number of items
 * @param selectedVariantId (Optional) The ID of the selected variant
 * @param selectedAddonIds (Optional) Array of selected add-on IDs
 * @returns Total price
 */
export function calculateItemTotal(
  item: MenuItem,
  quantity: number = 1,
  selectedVariantId?: string,
  selectedAddonIds: string[] = []
): number {
  let basePrice = item.price;
  
  if (selectedVariantId && item.variants) {
    const variant = item.variants.find(v => v.id === selectedVariantId);
    if (variant) {
      basePrice = variant.price;
    }
  }

  let addonsPrice = 0;
  if (selectedAddonIds.length > 0 && item.addons) {
    for (const addonId of selectedAddonIds) {
      const addon = item.addons.find(a => a.id === addonId);
      if (addon) {
        addonsPrice += addon.price;
      }
    }
  }

  return (basePrice + addonsPrice) * quantity;
}
