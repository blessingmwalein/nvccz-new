"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CiBank, CiGlobe } from "react-icons/ci";
import { HiTrendingUp, HiTrendingDown, HiGlobe, HiChevronDown } from "react-icons/hi";

interface MarketData {
  id: string;
  name: string;
  icon: any;
  color: string;
  summary: {
    index: string;
    change: string;
    value: string;
  };
  details: {
    title: string;
    data: Array<{
      name: string;
      change: string;
      value: string;
    }>;
  };
}

const marketData: MarketData[] = [
  {
    id: "zse",
    name: "ZSE",
    icon: HiTrendingUp,
    color: "from-green-500 to-emerald-600",
    summary: {
      index: "All Share",
      change: "+2.1%",
      value: "45,230"
    },
    details: {
      title: "Zimbabwe Stock Exchange",
      data: [
        { name: "Econet", change: "+8.2%", value: "ZWL 1,250" },
        { name: "Delta", change: "+5.4%", value: "ZWL 890" },
        { name: "CBZ", change: "+4.7%", value: "ZWL 2,100" },
        { name: "Innscor", change: "-3.2%", value: "ZWL 450" },
        { name: "Meikles", change: "-2.8%", value: "ZWL 320" },
        { name: "NMB", change: "-1.9%", value: "ZWL 180" }
      ]
    }
  },
  {
    id: "rbz",
    name: "RBZ",
    icon: CiBank,
    color: "from-blue-500 to-cyan-600",
    summary: {
      index: "Lending Rate",
      change: "14.5%",
      value: "Current"
    },
    details: {
      title: "Reserve Bank of Zimbabwe",
      data: [
        { name: "Lending Rate", change: "14.5%", value: "Current" },
        { name: "Deposit Rate", change: "8.2%", value: "Current" },
        { name: "Inflation", change: "12.3%", value: "YoY" }
      ]
    }
  },
  {
    id: "african",
    name: "African Markets",
    icon: CiGlobe,
    color: "from-orange-500 to-red-600",
    summary: {
      index: "JSE",
      change: "+1.2%",
      value: "ZAR 78,450"
    },
    details: {
      title: "African Markets",
      data: [
        { name: "JSE", change: "+1.2%", value: "ZAR 78,450" },
        { name: "NSE", change: "+0.8%", value: "NGN 45,230" },
        { name: "NSE Kenya", change: "+0.5%", value: "KES 1,890" }
      ]
    }
  },
  {
    id: "global",
    name: "Global Markets",
    icon: HiGlobe,
    color: "from-purple-500 to-indigo-600",
    summary: {
      index: "S&P 500",
      change: "+0.8%",
      value: "4,567"
    },
    details: {
      title: "Global Markets",
      data: [
        { name: "S&P 500", change: "+0.8%", value: "4,567" },
        { name: "NASDAQ", change: "+1.2%", value: "14,234" },
        { name: "FTSE 100", change: "+0.5%", value: "7,890" },
        { name: "Nikkei", change: "+0.3%", value: "32,456" }
      ]
    }
  }
];

export function ZimbabweStockExchange() {
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);

  const getChangeColor = (change: string) => {
    return change.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white">
      <h2 className="text-lg text-gray-900 mb-4">Market Overview</h2>
      <div className="grid grid-cols-4 gap-3">
        {marketData.map((market, index) => {
          const Icon = market.icon;
          const isGradient = index % 2 === 0;

          return (
            <motion.div
              key={market.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group ${
                isGradient 
                  ? `bg-gradient-to-r ${market.color} hover:opacity-90` 
                  : 'bg-white border-1 border-gray-200 hover:border-gray-300'
              } rounded-2xl p-2 transition-all duration-300 cursor-pointer`}
              onClick={() => setSelectedMarket(market)}
            >
              <div className="flex flex-col h-full relative">
                {/* Top right dropdown button */}
                <div className="absolute top-0 right-0">
                  <button 
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-200 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMarket(market);
                    }}
                  >
                    <HiChevronDown className="w-3 h-3 text-gray-600 transition-transform duration-200 hover:rotate-180" />
                  </button>
                </div>

                {/* Header with Title */}
                <div className="flex items-center gap-2 pr-8">
                  <div className={`${
                    isGradient 
                      ? `w-8 h-8 rounded-full bg-white/20 flex items-center justify-center` 
                      : `w-8 h-8 rounded-full bg-gradient-to-r ${market.color} flex items-center justify-center`
                  }`}>
                    <Icon className={`${isGradient ? 'w-4 h-4 text-white' : 'w-4 h-4 text-white'}`} />
                  </div>
                  <h3 className={`text-lg ${
                    isGradient ? 'text-white drop-shadow-sm' : 'text-gray-900'
                  }`}>
                    {market.name}
                  </h3>
                </div>
                
                {/* Spacer to push percentage/value to bottom */}
                <div className="flex-1"></div>
                
                {/* Percentage and Value in bottom right */}
                <div className={`flex items-center justify-end gap-2 ${
                  isGradient ? 'text-white drop-shadow-sm' : 'text-gray-900'
                }`}>
                  <span className={`text-lg font-medium ${
                    isGradient ? 'text-white drop-shadow-sm' : getChangeColor(market.summary.change)
                  }`}>
                    {market.summary.change}
                  </span>
                  <span className={`text-base ${
                    isGradient ? 'text-white/70 drop-shadow-sm' : 'text-gray-400'
                  }`}>
                    {market.summary.value}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dialog for Market Details */}
      <Dialog open={!!selectedMarket} onOpenChange={() => setSelectedMarket(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedMarket?.details.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMarket && (
            <div className="space-y-4">
              <div className="grid gap-3">
                {selectedMarket.details.data.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-semibold ${getChangeColor(item.change)}`}>
                        {item.change}
                      </span>
                      <span className="text-gray-600 font-medium">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => setSelectedMarket(null)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
