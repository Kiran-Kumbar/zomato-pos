const fs = require('fs');

async function fetchFoodish(category) {
  try {
    const res = await fetch(`https://foodish-api.com/api/images/${category}/`);
    const data = await res.json();
    return data.image;
  } catch (e) {
    console.error('Error fetching', category, e);
    return `https://foodish-api.com/images/${category}/${category}1.jpg`;
  }
}

async function run() {
  const file = 'src/lib/mock-data/index.ts';
  let content = fs.readFileSync(file, 'utf-8');

  const rCats = {
    'r1': 'butter-chicken',
    'r2': 'dosa',
    'r3': 'momos',
    'r4': 'pizza',
    'r5': 'sandwich',
    'r6': 'biryani',
    'r7': 'dessert',
    'r8': 'butter-chicken',
    'r9': 'burger',
    'r10': 'rice'
  };

  console.log('Fetching restaurant images...');
  for (let i = 1; i <= 10; i++) {
    const rid = `r${i}`;
    const cat = rCats[rid];
    const img = await fetchFoodish(cat);
    content = content.replace(new RegExp(`imageUrl:\\s*'\\/mock\\/${rid}\\.jpg'`), `imageUrl: '${img}'`);
  }

  const mCats = {
    'r1': 'butter-chicken',
    'r2': 'idly',
    'r3': 'momos',
    'r4': 'pasta',
    'r5': 'sandwich',
    'r6': 'biryani',
    'r7': 'dessert',
    'r8': 'butter-chicken',
    'r9': 'burger',
    'r10': 'rice'
  };

  console.log('Fetching menu images...');
  for (let i = 1; i <= 45; i++) {
    const mid = `m${i}`;
    const match = content.match(new RegExp(`id:\\s*'${mid}'.*?restaurantId:\\s*'([^']+)'`));
    if (match) {
      const rid = match[1];
      const cat = mCats[rid] || 'burger';
      const img = await fetchFoodish(cat);
      content = content.replace(new RegExp(`imageUrl:\\s*'\\/mock\\/${mid}\\.jpg'`), `imageUrl: '${img}'`);
    }
  }

  fs.writeFileSync(file, content);
  console.log('Seeded images successfully!');
}

run();
