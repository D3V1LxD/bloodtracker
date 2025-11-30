'use client'; // This directive is required for React state (useState) to work in Next.js

import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Calendar, 
  Heart, 
  MapPin, 
  Plus, 
  Clock, 
  Trophy, 
  Activity,
  X,
  User
} from 'lucide-react';

// Utility to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Utility to calculate days difference
const getDaysDiff = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2 - date1) / oneDay);
};

// Calculate exact age from birthdate with years and months
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  
  if (today.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      months = 11;
    }
  }
  
  return `${years}y ${months}m`;
};

export default function BloodDonationTracker() {
  // --- State Management ---
  const [user, setUser] = useState({
    name: "Md. Mahim Khan",
    bloodType: "B+",
    donorId: "BD-MK024", 
    age: calculateAge("2001-04-07"),
    weight: "62kg",
    height: "5'7''"
  });

  const [donations, setDonations] = useState([
    { 
      id: 1, 
      date: "2025-11-29", 
      location: "Uttara Adhunik Medical College and Hospital", 
      volume: 450, 
      type: "Whole Blood", 
      notes: "First time donation" 
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({
    date: new Date().toISOString().split('T')[0],
    location: "",
    volume: 450,
    type: "Whole Blood",
    notes: ""
  });

  // --- Derived Metrics ---
  const totalDonations = donations.length;
  const totalVolume = donations.reduce((acc, curr) => acc + curr.volume, 0);

  // Calculate Next Eligibility (120 days)
  const lastDonation = donations.length > 0 
    ? donations.sort((a, b) => new Date(b.date) - new Date(a.date))[0] 
    : null;
  
  let eligibilityStatus = { eligible: true, daysRemaining: 0, nextDate: new Date() };
  
  if (lastDonation) {
    const lastDate = new Date(lastDonation.date);
    const today = new Date();
    const eligibilityDate = new Date(lastDate);
    eligibilityDate.setDate(lastDate.getDate() + 120);
    
    today.setHours(0,0,0,0);
    eligibilityDate.setHours(0,0,0,0);
    
    if (today < eligibilityDate) {
      const diff = getDaysDiff(today, eligibilityDate);
      eligibilityStatus = {
        eligible: false,
        daysRemaining: diff,
        nextDate: eligibilityDate
      };
    } else {
      eligibilityStatus = {
        eligible: true,
        daysRemaining: 0,
        nextDate: today
      };
    }
  }

  // --- Handlers ---
  const handleAddDonation = (e) => {
    e.preventDefault();
    const donation = {
      id: Date.now(),
      ...newDonation,
      volume: parseInt(newDonation.volume)
    };
    
    setDonations(prev => [...prev, donation].sort((a, b) => new Date(b.date) - new Date(a.date)));
    setIsFormOpen(false);
    setNewDonation({
      date: new Date().toISOString().split('T')[0],
      location: "",
      volume: 450,
      type: "Whole Blood",
      notes: ""
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 p-2 rounded-lg shadow-md">
                <Heart className="h-6 w-6 text-white fill-current" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                LifeFlow
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">ID: {user.donorId}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200 font-bold text-red-700">
                {user.bloodType}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-50"></div>
          
          <div className="p-6 sm:p-8 relative z-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Donation Status</h2>
                {eligibilityStatus.eligible ? (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                    <Activity className="h-4 w-4" />
                    <span className="font-semibold text-sm">You are eligible to donate today!</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold text-sm">{eligibilityStatus.daysRemaining} days until next eligibility</span>
                  </div>
                )}
                
                {!eligibilityStatus.eligible && (
                  <p className="text-slate-500 text-sm mt-3">
                    Your estimated next donation date is <strong className="text-slate-700">{formatDate(eligibilityStatus.nextDate)}</strong>.
                  </p>
                )}
              </div>

              <button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-red-200 w-full md:w-auto active:scale-95"
              >
                <Plus className="h-5 w-5" />
                <span>Log Donation</span>
              </button>
            </div>
          </div>
          
          {!eligibilityStatus.eligible && (
            <div className="w-full bg-slate-100 h-2">
              <div 
                className="bg-red-500 h-2 rounded-r-full transition-all duration-1000"
                style={{ width: `${((120 - eligibilityStatus.daysRemaining) / 120) * 100}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <span className="text-xs text-slate-400 uppercase font-semibold">Age</span>
              <div className="font-medium text-slate-700">{user.age}</div>
           </div>
           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <span className="text-xs text-slate-400 uppercase font-semibold">Weight</span>
              <div className="font-medium text-slate-700">{user.weight}</div>
           </div>
           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <span className="text-xs text-slate-400 uppercase font-semibold">Height</span>
              <div className="font-medium text-slate-700">{user.height}</div>
           </div>
           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <span className="text-xs text-slate-400 uppercase font-semibold">Blood Group</span>
              <div className="font-bold text-red-600">{user.bloodType}</div>
           </div>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Droplet className="h-6 w-6" />
            </div>
            <div>
              <div className="text-slate-500 text-sm font-medium">Total Volume</div>
              <div className="text-2xl font-bold text-slate-900">{totalVolume} <span className="text-sm font-normal text-slate-400">ml</span></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="text-slate-500 text-sm font-medium">Donations</div>
              <div className="text-2xl font-bold text-slate-900">{totalDonations} <span className="text-sm font-normal text-slate-400">times</span></div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Donation History</h3>
            <span className="text-sm text-slate-500">{totalDonations} records found</span>
          </div>

          <div className="grid gap-4">
            {donations.map((donation, index) => (
              <div key={donation.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                {index !== donations.length - 1 && (
                  <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-slate-100 hidden md:block group-last:hidden"></div>
                )}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center space-x-4">
                    <div className="h-12 w-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{formatDate(donation.date)}</h4>
                      <div className="flex items-center text-sm text-slate-500 mt-1 space-x-3">
                        <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {donation.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 pl-16 md:pl-0">
                    <div className="text-left md:text-right">
                      <div className="text-sm font-medium text-slate-900">{donation.type}</div>
                      <div className="text-xs text-slate-500">{donation.volume} ml</div>
                    </div>
                    {donation.notes && (
                      <div className="hidden lg:block text-xs text-slate-400 max-w-xs italic text-right">"{donation.notes}"</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Log New Donation</h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddDonation} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" required value={newDonation.date} onChange={(e) => setNewDonation({...newDonation, date: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" required value={newDonation.location} onChange={(e) => setNewDonation({...newDonation, location: e.target.value})} placeholder="Hospital or donation center" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select required value={newDonation.type} onChange={(e) => setNewDonation({...newDonation, type: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all">
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Plasma">Plasma</option>
                  <option value="Platelets">Platelets</option>
                  <option value="Double Red Cells">Double Red Cells</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Volume (ml)</label>
                <input type="number" required value={newDonation.volume} onChange={(e) => setNewDonation({...newDonation, volume: e.target.value})} min="1" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea value={newDonation.notes} onChange={(e) => setNewDonation({...newDonation, notes: e.target.value})} placeholder="Any additional notes..." rows="3" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"></textarea>
              </div>
              
              <div className="pt-2">
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
