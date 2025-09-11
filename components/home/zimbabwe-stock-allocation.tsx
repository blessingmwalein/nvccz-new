"use client"

import { motion } from "framer-motion"
import { CiShop, CiBank, CiTrophy } from "react-icons/ci"

export function ZimbabweStockAllocation() {
  // Zimbabwean companies data - Only top 4
  const zimbabweCompanies = [
    {
      id: "ecobank",
      name: "Ecobank Zimbabwe",
      symbol: "EBZ",
      value: "2.45",
      allocation: "19.62%",
      description: "Banking Services",
      icon: CiBank,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      id: "innscor",
      name: "Innscor Africa",
      symbol: "INN",
      value: "1.85",
      allocation: "16.10%",
      description: "Food & Beverages",
      icon: CiShop,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      id: "delta",
      name: "Delta Corporation",
      symbol: "DLTA",
      value: "1.42",
      allocation: "12.28%",
      description: "Beverages & Food",
      icon: CiShop,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      id: "hunyani",
      name: "Hunyani Holdings",
      symbol: "HUN",
      value: "1.38",
      allocation: "11.66%",
      description: "Packaging & Paper",
      icon: CiShop,
      gradient: "from-cyan-500 to-blue-600"
    }
  ]

  return (
    <div className="bg-white ">
      <h2 className="text-lg text-gray-900 mb-4">Zimbabwe Stock Allocation</h2>
      <div className="grid grid-cols-2 gap-3">
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
              } rounded-2xl p-4 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex flex-col h-full">
                {/* Company Icon and Symbol - Top Row */}
                <div className="flex items-center gap-2">
                  <div className={`${
                    isGradient 
                      ? `w-8 h-8 rounded-full bg-white/20 flex items-center justify-center` 
                      : `w-8 h-8 rounded-full bg-gradient-to-r ${company.gradient} flex items-center justify-center`
                  }`}>
                    <company.icon className={`${isGradient ? 'w-4 h-4 text-white' : 'w-4 h-4 text-white'}`} />
                  </div>
                  <h3 className={`text-2xl ${
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
                  <div className={`flex items-center gap-2 ${
                    isGradient ? 'text-white/70 drop-shadow-sm' : 'text-gray-400'
                  }`}>
                    <span className="text-2xl">{company.value}</span>
                    <span className="text-xl">{company.allocation}</span>
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
