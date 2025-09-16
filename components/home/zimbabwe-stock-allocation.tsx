"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CiShop, CiBank, CiTrophy } from "react-icons/ci"
import { useAppSelector } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"

export function ZimbabweStockAllocation() {
  const topGainers = useAppSelector((state) => state.financialData.topGainers);
  const topLosers = useAppSelector((state) => state.financialData.topLosers);

  const loading = topGainers.loading || topLosers.loading;
  const error = topGainers.error || topLosers.error;

  // Data is now provided by FinancialDataProvider
  // No need for individual API calls here

  // Combine top gainers and losers, take top 4
  const allStocks = [
    ...(topGainers.data?.top_gainers?.slice(0, 2) || []),
    ...(topLosers.data?.top_losers?.slice(0, 2) || [])
  ];

  const zimbabweCompanies = allStocks.map((stock, index) => ({
    id: stock.symbol.toLowerCase(),
    name: stock.symbol,
    symbol: stock.symbol,
    value: stock.value.toFixed(2),
    allocation: `${Math.abs(stock.change).toFixed(1)}%`,
    description: stock.change >= 0 ? "Top Gainer" : "Top Loser",
    icon: stock.change >= 0 ? CiTrophy : CiShop,
    gradient: stock.change >= 0 ? "from-green-500 to-emerald-600" : "from-red-500 to-orange-600"
  }));

  if (loading) {
    return (
      <div className="bg-white">
        <h2 className="text-sm sm:text-base text-gray-900 mb-3">Zimbabwe Stock Allocation</h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-2 sm:p-3">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                  <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
                </div>
                <div className="flex-1 flex items-center justify-center mb-2 sm:mb-3">
                  <Skeleton className="h-3 w-16 sm:w-20" />
                </div>
                <div className="flex items-end justify-end">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Skeleton className="h-4 sm:h-5 w-8 sm:w-10" />
                    <Skeleton className="h-3 sm:h-4 w-8 sm:w-10" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <h2 className="text-sm sm:text-base text-gray-900 mb-3">Zimbabwe Stock Allocation</h2>
        <div className="text-center py-4 sm:py-6 text-red-600">
          <p className="text-xs sm:text-sm">Failed to load stock data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <h2 className="text-sm sm:text-base text-gray-900 mb-3">Zimbabwe Stock Allocation</h2>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {zimbabweCompanies.map((company, index) => {
          const isGradient = index % 2 === 0; // Alternate: even indices get gradient, odd get white/gray
          
          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${
                isGradient 
                  ? `bg-gradient-to-r ${company.gradient} hover:opacity-90` 
                  : 'bg-white border-1 border-gray-200 hover:border-gray-300'
              } rounded-xl sm:rounded-2xl p-2 sm:p-3 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex flex-col h-full">
                {/* Company Icon and Symbol - Top Row */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className={`${
                    isGradient 
                      ? `w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center` 
                      : `w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${company.gradient} flex items-center justify-center`
                  }`}>
                    <company.icon className={`${isGradient ? 'w-3 h-3 sm:w-4 sm:h-4 text-white' : 'w-3 h-3 sm:w-4 sm:h-4 text-white'}`} />
                  </div>
                  <h3 className={`text-sm sm:text-base lg:text-lg ${
                    isGradient ? 'text-white drop-shadow-sm' : 'text-gray-900'
                  }`}>
                    {company.symbol}
                  </h3>
                </div>
                
                {/* Description - Center */}
                <div className="flex-1 flex items-center justify-center">
                  <p className={`text-xs text-center ${
                    isGradient ? 'text-white/80 drop-shadow-sm' : 'text-gray-500'
                  }`}>
                    {company.description}
                  </p>
                </div>
                
                {/* Value and Percentage - Bottom Right */}
                <div className="flex items-end justify-end mt-1">
                  <div className={`flex items-center gap-1 sm:gap-2 ${
                    isGradient ? 'text-white/70 drop-shadow-sm' : 'text-gray-400'
                  }`}>
                    <span className="text-sm sm:text-base lg:text-lg font-medium">{company.value}</span>
                    <span className="text-xs sm:text-sm lg:text-base">{company.allocation}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  )
}
