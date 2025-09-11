"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

const exchangeRates = [
  {
    currency: "Zimbabwe Gold",
    pair: "1USD-ZiG",
    buy: "25.9577",
    sell: "28.6337", 
    mid: "26.7605",
    change: "+0.5%",
    trend: "up"
  },
  {
    currency: "Zimbabwe Gold",
    pair: "1USD-ZiG",
    buy: "25.9577",
    sell: "28.6337",
    mid: "26.7605", 
    change: "+0.3%",
    trend: "up"
  },
  {
    currency: "Zimbabwe Gold",
    pair: "1USD-ZiG",
    buy: "25.9577",
    sell: "28.6337",
    mid: "26.7605",
    change: "-0.2%",
    trend: "down"
  }
]

export function ExchangeRatesTicker() {
  return (
    <div className="bg-blue-50/80 backdrop-blur-sm border-b border-blue-100">
      {/* Title outside the ticker */}
      <div className="px-6 py-2 bg-white/90 backdrop-blur-sm border-b border-blue-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-700">Live Exchange Rates (RBZ Official Rates)</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600">LIVE</span>
          </div>
        </div>
      </div>
      
      {/* Ticker Container */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50/60 to-indigo-50/60 py-3">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{
            x: [0, -120 * exchangeRates.length]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear"
            }
          }}
        >
          {[...exchangeRates, ...exchangeRates, ...exchangeRates].map((rate, index) => (
            <div key={index} className="flex-shrink-0 flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                  <span className="text-xs text-white">ZiG</span>
                </div>
                <div>
                  <div className="text-sm text-gray-800">{rate.currency}</div>
                  <div className="text-xs text-gray-600">{rate.pair}</div>
                </div>
              </div>
              
              {/* Dividing line */}
              <div className="w-px h-8 bg-gray-300"></div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="group cursor-pointer">
                  <div className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">WE BUY:</div>
                  <div className="text-base text-gray-800 group-hover:text-blue-700 transition-colors">{rate.buy}</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">WE SELL:</div>
                  <div className="text-base text-gray-800 group-hover:text-blue-700 transition-colors">{rate.sell}</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">MID:</div>
                  <div className="text-base text-gray-800 group-hover:text-blue-700 transition-colors">{rate.mid}</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">PAIR:</div>
                  <div className="text-base text-gray-800 group-hover:text-blue-700 transition-colors">{rate.pair}</div>
                </div>
              </div>
              
              {/* Dividing line */}
              <div className="w-px h-8 bg-gray-300"></div>
              
              <div className="flex items-center gap-2">
                {rate.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${
                  rate.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {rate.change}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
