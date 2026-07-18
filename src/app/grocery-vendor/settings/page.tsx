"use client";

import { Save, Store, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

export default function GrocerySettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Store Settings</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your grocery store profile and preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-500" /> Basic Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Store Name</label>
              <input type="text" defaultValue="Reliance Fresh" className="bg-gray-50 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white rounded-xl py-3 px-4 focus:ring-2 ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">FSSAI License Number</label>
              <input type="text" defaultValue="11223344556677" className="bg-gray-50 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white rounded-xl py-3 px-4 focus:ring-2 ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Store Description</label>
              <textarea rows={3} defaultValue="Fresh groceries, daily essentials, and household items delivered quickly to your doorstep." className="bg-gray-50 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white rounded-xl py-3 px-4 focus:ring-2 ring-emerald-500 resize-none" />
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" /> Contact & Location
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" /> Phone Number</label>
              <input type="tel" defaultValue="+91 98765 43210" className="bg-gray-50 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white rounded-xl py-3 px-4 focus:ring-2 ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> Email Address</label>
              <input type="email" defaultValue="store@reliancefresh.com" className="bg-gray-50 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white rounded-xl py-3 px-4 focus:ring-2 ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Complete Address</label>
              <textarea rows={2} defaultValue="123, 4th Cross, Indiranagar, Bangalore, Karnataka 560038" className="bg-gray-50 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white rounded-xl py-3 px-4 focus:ring-2 ring-emerald-500 resize-none" />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" /> Operating Hours
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Opening Time</label>
              <input type="time" defaultValue="07:00" className="bg-gray-50 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white rounded-xl py-3 px-4 focus:ring-2 ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Closing Time</label>
              <input type="time" defaultValue="23:00" className="bg-gray-50 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white rounded-xl py-3 px-4 focus:ring-2 ring-emerald-500" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
