import { MenuItem, MoodTag } from '../types/menuItem';

/**
 * Filters and ranks MenuItems based on a selected MoodTag.
 * It will prioritize items that exactly contain the requested mood tag.
 * @param items Array of MenuItems to filter
 * @param mood The selected MoodTag
 * @returns Sorted/filtered array of MenuItems matching the mood
 */
export function rankItemsByMood(items: MenuItem[], mood: MoodTag): MenuItem[] {
  // First, filter items that contain the requested mood tag
  const matchingItems = items.filter(item => item.moodTags.includes(mood));

  // Sort them (e.g., by rating if available, or just keeping the existing order)
  return matchingItems.sort((a, b) => {
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;
    return ratingB - ratingA;
  });
}
