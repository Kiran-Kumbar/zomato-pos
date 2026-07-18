"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/authStore';
import { UtensilsCrossed, Store, Bike, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/logo';

type Step = 'phone' | 'otp' | 'role';

export default function LoginPage() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setStep('role');
    }
  }, [isAuthenticated]);
  
  const login = useAuthStore(state => state.login);
  const router = useRouter();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) setStep('role');
  };

  const handleRoleSelect = (role: UserRole) => {
    login(phone, role);
    if (role === 'customer') router.push('/');
    else if (role === 'restaurant') router.push('/restaurant/dashboard');
    else if (role === 'delivery') router.push('/delivery/home');
    else if (role === 'admin') router.push('/admin/dashboard');
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-6 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-rose-500/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="transform -rotate-6 mb-4 drop-shadow-2xl">
            <Logo size={80} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">TrustBite</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Real food, real transparency</p>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-2xl">
          <AnimatePresence mode="wait">
            
            {step === 'phone' && (
              <motion.form key="phone" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} onSubmit={handlePhoneSubmit}>
                <h2 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login or Signup</h2>
                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">+91</span>
                  <input 
                    type="tel" 
                    required
                    placeholder="Enter phone number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-14 pr-4 text-lg font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                  />
                </div>
                <button type="submit" disabled={phone.length < 10} className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.form key="otp" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} onSubmit={handleOtpSubmit}>
                <h2 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">Verify Phone</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Code sent to +91 {phone}</p>
                <input 
                  type="text" 
                  required
                  maxLength={4}
                  placeholder="----" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 px-4 text-center text-2xl tracking-[1em] font-bold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all mb-6 text-gray-900 dark:text-white placeholder:text-gray-400"
                />
                <button type="submit" disabled={otp.length !== 4} className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                  Verify <CheckCircle2 className="w-5 h-5" />
                </button>
              </motion.form>
            )}

            {step === 'role' && (
              <motion.div key="role" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">Select Environment</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Choose an app view for this demo</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'customer', label: 'Customer', icon: UtensilsCrossed, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
                    { id: 'restaurant', label: 'Restaurant', icon: Store, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
                    { id: 'delivery', label: 'Delivery', icon: Bike, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                    { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
                  ].map((r) => (
                    <button 
                      key={r.id} 
                      onClick={() => handleRoleSelect(r.id as UserRole)}
                      className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-950 transition-all active:scale-95 group shadow-sm hover:shadow-md"
                    >
                      <div className={`w-12 h-12 rounded-full ${r.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <r.icon className={`w-6 h-6 ${r.color}`} />
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{r.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
