const fs = require('fs');
const path = require('path');

const target = path.join(process.cwd(), 'src/app/(customer)/grocery/vendor/[id]/page.tsx');
let content = fs.readFileSync(target, 'utf8');

// The replacement logic:
const oldBannerRegex = /<div className="min-h-screen bg-\[\#fafafa\] dark:bg-\[\#0a0a0a\] pb-32">[\s\S]*?<div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 flex flex-col gap-8">/;

const newBannerHtml = `<div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pb-32 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-8">
        
        {/* Standard Header */}
        <section className="flex flex-col gap-6 mt-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] to-orange-400">{vendor.name}</span> Store.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-gray-500 dark:text-gray-400 font-medium"
            >
              Fresh groceries delivered in {vendor.etaMins} mins.
            </motion.p>
          </div>
        </section>

      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 bg-gray-900 rounded-3xl overflow-hidden shadow-sm">
        <img src={vendor.bannerUrl} alt={vendor.name} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        {/* Top Nav */}
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Vendor Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col md:flex-row items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-3 mt-2"
            >
              <div className="bg-[#FF5A36] text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm group relative cursor-help">
                <Leaf className="w-4 h-4" /> {vendor.freshnessScore}% Fresh
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="font-bold mb-1 flex items-center gap-1"><Info className="w-3 h-3"/> Freshness Score</div>
                  AI-calculated metric based on time-since-harvest, batch quality, and user reports.
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {vendor.rating}
              </div>
              <div className="bg-white/20 backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4" /> {vendor.distanceKm} km
              </div>
              <div className="bg-white/20 backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {vendor.etaMins} mins
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-8">`;

content = content.replace(oldBannerRegex, newBannerHtml);

fs.writeFileSync(target, content, 'utf8');
console.log('Fixed vendor page header!');
