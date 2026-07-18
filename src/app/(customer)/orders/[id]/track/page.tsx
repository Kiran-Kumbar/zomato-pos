"use client";

import { useEffect, useState, use } from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, Phone, CheckCircle2, ChevronLeft, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getById as getOrder, update as updateOrder } from '@/lib/services/order.service';
import { getById as getRestaurant } from '@/lib/services/restaurant.service';
import { getById as getDeliveryPartner } from '@/lib/services/deliveryPartner.service';
import { Order } from '@/lib/types/order';
import { Restaurant } from '@/lib/types/restaurant';
import { DeliveryPartner } from '@/lib/types/deliveryPartner';
import StatusTimeline, { TimelineStep } from '@/components/ui/StatusTimeline';
import SurgeDisclosure from '@/components/ui/SurgeDisclosure';
import { calculateSurge } from '@/lib/utils/surgeCalc';
import { Star, Video, Play } from 'lucide-react';
import { create as createReview } from '@/lib/services/review.service';

const LiveTrackingMap = dynamic(() => import('@/components/map/LiveTrackingMap'), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse flex flex-col items-center justify-center text-gray-400 text-sm font-semibold"><MapPin className="w-6 h-6 mb-2 animate-bounce" /> Loading map...</div> 
});

const STATUS_FLOW = ['placed', 'accepted', 'preparing', 'ready', 'picked_up', 'on_the_way', 'delivered'];

const REST_POS: [number, number] = [12.9716, 77.5946];
const USER_POS: [number, number] = [12.9856, 77.6086];

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [partner, setPartner] = useState<DeliveryPartner | null>(null);
  
  const [currentStatus, setCurrentStatus] = useState<string>('placed');
  const [progress, setProgress] = useState(0); 
  const [surge] = useState(() => calculateSurge());
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitReview = async () => {
    if (!order || rating === 0) return;
    setIsSubmittingReview(true);
    
    await createReview({
      userId: order.userId,
      restaurantId: order.restaurantId,
      orderId: order.id,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      videoUrl: videoPreview || undefined
    });
    
    setReviewSubmitted(true);
    setIsSubmittingReview(false);
  };
  
  useEffect(() => {
    params.then(p => {
      async function load() {
        const o = await getOrder(p.id);
        if (o) {
          setOrder(o);
          setCurrentStatus(o.status === 'delivered' ? 'placed' : o.status); // reset to placed for demo effect
          const r = await getRestaurant(o.restaurantId);
          if (r) setRestaurant(r);
          
          if (o.deliveryPartnerId) {
            const dp = await getDeliveryPartner(o.deliveryPartnerId);
            if (dp) setPartner(dp);
          } else {
            const dp = await getDeliveryPartner('dp1');
            if (dp) setPartner(dp);
          }
        }
      }
      load();
    });
  }, [params]);

  // Demo Status Progression
  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      setCurrentStatus(prev => {
        const idx = STATUS_FLOW.indexOf(prev);
        if (idx < STATUS_FLOW.length - 1) {
          return STATUS_FLOW[idx + 1];
        }
        clearInterval(interval);
        return prev;
      });
    }, 4000); 
    return () => clearInterval(interval);
  }, [order]);

  // Map progress interpolation
  useEffect(() => {
    if (currentStatus === 'on_the_way') {
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + 0.05, 1)); 
      }, 1000);
      return () => clearInterval(interval);
    } else if (currentStatus === 'delivered') {
      setProgress(1);
    } else {
      setProgress(0);
    }
  }, [currentStatus]);

  if (!order || !restaurant) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-bold animate-pulse">
        Loading Tracking...
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(currentStatus);

  const steps: TimelineStep[] = [
    { id: 'placed', label: 'Order Placed', isCompleted: currentIdx > 0, isActive: currentIdx === 0 },
    { id: 'accepted', label: 'Order Accepted', description: 'Restaurant is reviewing', isCompleted: currentIdx > 1, isActive: currentIdx === 1 },
    { id: 'preparing', label: 'Preparing Food', description: 'Your meal is being cooked', isCompleted: currentIdx > 2, isActive: currentIdx === 2 },
    { id: 'ready', label: 'Ready for Pickup', isCompleted: currentIdx > 3, isActive: currentIdx === 3 },
    { id: 'picked_up', label: 'Partner Picked Up', isCompleted: currentIdx > 4, isActive: currentIdx === 4 },
    { id: 'on_the_way', label: 'On the Way', description: 'Delivery partner is en route', isCompleted: currentIdx > 5, isActive: currentIdx === 5 },
    { id: 'delivered', label: 'Delivered', isCompleted: currentIdx > 6, isActive: currentIdx === 6 },
  ];

  const currentMapPos: [number, number] = [
    REST_POS[0] + (USER_POS[0] - REST_POS[0]) * progress,
    REST_POS[1] + (USER_POS[1] - REST_POS[1]) * progress,
  ];

  const estimatedTime = currentStatus === 'delivered' ? 'Arrived' : `${Math.max(2, 25 - currentIdx * 3)} mins`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
      
      {/* Map Header Area */}
      <div className="h-[40vh] relative bg-gray-200 shadow-inner overflow-hidden z-10">
        <LiveTrackingMap currentPos={currentMapPos} restaurantPos={REST_POS} userPos={USER_POS} />
        
        <button onClick={() => router.back()} className="absolute top-4 left-4 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full shadow-lg z-[400] transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>

        {/* ETA overlay */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-3 px-5 shadow-xl border border-gray-100 dark:border-gray-800 z-[400] flex flex-col items-center transform hover:scale-105 transition-transform">
          <span className="text-[9px] uppercase tracking-widest font-black text-gray-500 mb-0.5">Arriving in</span>
          <span className="text-2xl font-black text-red-500 leading-none">{estimatedTime}</span>
        </div>

        {/* Dev Toggle */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800 flex justify-between items-center mb-8">
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Dev: Advance Order Status</span>
          <button 
            onClick={async () => {
              const sequence = ['placed', 'accepted', 'preparing', 'ready', 'picked_up', 'on_the_way', 'delivered'];
              const currentIndex = sequence.indexOf(order.status);
              if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
                const nextStatus = sequence[currentIndex + 1] as any;
                await updateOrder(order.id, { status: nextStatus, statusTimestamps: { ...order.statusTimestamps, [nextStatus]: new Date().toISOString() }});
                setOrder({ ...order, status: nextStatus, statusTimestamps: { ...order.statusTimestamps, [nextStatus]: new Date().toISOString() }});
              }
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            Next Step
          </button>
        </div>
      </div>

      <div className="flex-1 -mt-6 relative z-20 bg-gray-50 dark:bg-gray-950 rounded-t-3xl shadow-[0_-15px_30px_rgba(0,0,0,0.08)] px-4 pt-6 flex flex-col gap-6 border-t border-gray-100 dark:border-gray-800">
        
        {/* Partner Info */}
        {partner && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-2xl overflow-hidden shadow-sm shrink-0">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${partner.name}`}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900 dark:text-white">{partner.name}</span>
                <span className="text-sm text-gray-500 font-semibold capitalize">{partner.vehicleType}</span>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-green-600 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Background Verified
                </div>
              </div>
            </div>
            <button className="w-12 h-12 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors shadow-sm active:scale-95">
              <Phone className="w-5 h-5 fill-current" />
            </button>
          </div>
        )}

        {/* Status Timeline or Review Form */}
        {currentStatus === 'delivered' ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            {reviewSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2">Thanks for your review!</h3>
                <p className="text-gray-500 text-sm">Your feedback helps others make better choices.</p>
                <button onClick={() => router.push(`/restaurant/${restaurant.id}`)} className="mt-6 bg-red-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-600 transition-colors shadow-md shadow-red-500/30">
                   Order Again
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="font-black text-xl text-gray-900 dark:text-white text-center">How was your food?</h3>
                <div className="flex justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setRating(star)} className="p-1">
                      <Star className={`w-10 h-10 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-gray-800'}`} />
                    </button>
                  ))}
                </div>
                
                <textarea 
                  placeholder="Tell us what you liked..." 
                  value={comment} onChange={e => setComment(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
                
                <div className="flex items-center gap-4">
                  <label className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-3 rounded-2xl border border-red-200 dark:border-red-800/30 flex items-center justify-center gap-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                    <Video className="w-5 h-5" />
                    {videoFile ? 'Video Added' : 'Add Video Review'}
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
                  </label>
                  {videoPreview && (
                    <div className="w-12 h-12 rounded-xl bg-gray-900 overflow-hidden relative shrink-0">
                       <video src={videoPreview} className="w-full h-full object-cover opacity-50" />
                       <Play className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || isSubmittingReview}
                  className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl mt-2 disabled:opacity-50 disabled:bg-gray-400 shadow-md shadow-red-500/30 transition-colors"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-black text-gray-900 dark:text-white text-xl">Order Tracker</h3>
              <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/30 shadow-sm">
                <ShieldCheck className="w-4 h-4" /> {restaurant.transparencyScore}% Trust Score
              </div>
            </div>
            
            <div className="pl-2">
              <StatusTimeline steps={steps} />
            </div>
          </div>
        )}

        {/* Bill Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Order Details</h3>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
              <span>Item Total ({order.items.length} items)</span>
              <span className="text-gray-900 dark:text-white">₹{order.totalAmount - 50 - surge.amount - Math.round(order.totalAmount * 0.05)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
              <span className="flex items-center">Delivery Partner Fee <SurgeDisclosure details={surge.details} totalAmount={surge.amount} /></span>
              <span className="text-gray-900 dark:text-white">₹{50 + surge.amount}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
              <span>Taxes</span>
              <span className="text-gray-900 dark:text-white">₹{Math.round(order.totalAmount * 0.05)}</span>
            </div>
            <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-800 my-2" />
            <div className="flex justify-between font-black text-lg text-gray-900 dark:text-white">
              <span>Grand Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
