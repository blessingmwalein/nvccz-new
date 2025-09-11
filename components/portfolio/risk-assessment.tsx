"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CiWarning, 
  CiRepeat, 
  CiSaveDown1, 
  CiVault, 
  CiWavePulse1, 
  CiViewTimeline, 
  CiCircleCheck,
  CiSettings,
  CiCircleInfo,
  CiCircleAlert
} from "react-icons/ci"

export function RiskAssessment() {
  const riskMetrics = [
    {
      title: "Overall Risk Score",
      value: "Medium",
      score: 65,
      icon: CiCircleCheck,
    },
    {
      title: "Concentration Risk",
      value: "Low",
      score: 25,
      icon: CiViewTimeline,
    },
    {
      title: "Market Risk",
      value: "Medium",
      score: 70,
      icon: CiWavePulse1,
    },
    {
      title: "Liquidity Risk",
      value: "High",
      score: 85,
      icon: CiWarning,
    },
  ]

  const riskAlerts = [
    {
      type: "warning",
      title: "High Sector Concentration",
      description: "Technology sector represents 35% of portfolio. Consider diversification.",
      severity: "Medium",
      icon: CiCircleAlert,
    },
    {
      type: "info",
      title: "Market Volatility Increase",
      description: "Recent market volatility has increased portfolio risk by 12%.",
      severity: "Low",
      icon: CiCircleInfo,
    },
    {
      type: "error",
      title: "Liquidity Concern",
      description: "15% of holdings have limited liquidity. Monitor exit opportunities.",
      severity: "High",
      icon: CiCircleAlert,
    },
  ]

  const stressTestResults = [
    { scenario: "Market Crash (-30%)", impact: "-18.2%", probability: "5%" },
    { scenario: "Interest Rate Rise (+200bp)", impact: "-8.4%", probability: "25%" },
    { scenario: "Sector Rotation", impact: "-12.1%", probability: "40%" },
    { scenario: "Liquidity Crisis", impact: "-22.5%", probability: "10%" },
  ]

  const mitigationStrategies = [
    {
      title: "Diversification",
      description: "Reduce technology sector allocation from 35% to 25%",
      status: "Recommended",
      action: "Implement",
      icon: CiCircleCheck,
    },
    {
      title: "Hedging Strategy",
      description: "Implement market neutral positions to reduce beta exposure",
      status: "Active",
      action: "Review",
      icon: CiVault,
    },
    {
      title: "Liquidity Management",
      description: "Increase cash reserves to 15% for opportunistic investments",
      status: "Pending",
      action: "Plan",
      icon: CiSettings,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Risk Assessment</h1>
          <p className="text-lg text-gray-600">Comprehensive risk analysis and monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/80 border-gray-300 hover:bg-gray-50">
            <CiRepeat className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
          <Button className="gradient-primary text-white hover:opacity-90">
            <CiSaveDown1 className="w-4 h-4 mr-2" />
            Risk Report
          </Button>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {riskMetrics.map((metric, index) => {
          const Icon = metric.icon
          const isGradient = index % 2 === 0
          
          return (
            <div key={index} className={`rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 relative ${isGradient ? 'gradient-primary' : 'bg-white'}`}>
              {/* Circular Icon Button */}
              <div className="absolute top-4 right-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isGradient ? 'bg-white/20' : 'gradient-primary'}`}>
                  <Icon className={`w-4 h-4 ${isGradient ? 'text-white' : 'text-white'}`} />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className={`text-sm font-medium ${isGradient ? 'text-white' : 'text-gray-600'}`}>{metric.title}</h3>
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${isGradient ? 'bg-white/20 text-white border-white/30' : 'gradient-primary text-white border-transparent'}`}>
                    {metric.value}
                  </Badge>
                  <span className={`text-sm font-medium ${isGradient ? 'text-white' : 'text-gray-800'}`}>{metric.score}/100</span>
                </div>
                <div className="bg-white rounded-full h-2">
                  <div 
                    className="gradient-primary h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Risk Alerts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <CiWarning className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Risk Alerts</h3>
        </div>
        <div className="space-y-4">
          {riskAlerts.map((alert, index) => {
            const Icon = alert.icon
            return (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-gray-800">{alert.title}</h4>
                      <p className="text-xs text-gray-600">{alert.description}</p>
                    </div>
                    <Badge className={`text-xs ${
                      alert.severity === "High"
                        ? "gradient-primary text-white border-transparent"
                        : alert.severity === "Medium"
                          ? "gradient-primary text-white border-transparent"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}>
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Risk Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stress Test Results */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <CiWavePulse1 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Stress Test Results</h3>
          </div>
          <div className="space-y-4">
            {stressTestResults.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/60 border border-gray-200">
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-gray-800">{test.scenario}</h4>
                  <p className="text-xs text-gray-600">Probability: {test.probability}</p>
                </div>
                <Badge className={`text-xs ${
                  test.impact.startsWith("-") 
                    ? "gradient-primary text-white border-transparent" 
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}>
                  {test.impact}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Mitigation */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <CiVault className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Risk Mitigation Strategies</h3>
          </div>
          <div className="space-y-4">
            {mitigationStrategies.map((strategy, index) => {
              const Icon = strategy.icon
              return (
                <div key={index} className="p-4 rounded-lg bg-white/60 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium text-sm text-gray-800">{strategy.title}</h4>
                      <p className="text-xs text-gray-600">{strategy.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge className={`text-xs ${
                          strategy.status === "Recommended" || strategy.status === "Active"
                            ? "gradient-primary text-white border-transparent"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}>
                          {strategy.status}
                        </Badge>
                        <Button size="sm" variant="outline" className="text-xs">
                          {strategy.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Risk Monitoring */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <CiViewTimeline className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Risk Monitoring Dashboard</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-white/60 border border-gray-200 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">VaR (95% Confidence)</span>
              <span className="font-medium text-red-600">-2.4%</span>
            </div>
            <div className="bg-white rounded-full h-2">
              <div className="gradient-primary h-2 rounded-full" style={{ width: "24%" }} />
            </div>
            <p className="text-xs text-gray-600">Daily risk exposure</p>
          </div>

          <div className="p-4 rounded-lg bg-white/60 border border-gray-200 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Beta to Market</span>
              <span className="font-medium text-gray-800">0.85</span>
            </div>
            <div className="bg-white rounded-full h-2">
              <div className="gradient-primary h-2 rounded-full" style={{ width: "85%" }} />
            </div>
            <p className="text-xs text-gray-600">Market sensitivity</p>
          </div>

          <div className="p-4 rounded-lg bg-white/60 border border-gray-200 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Tracking Error</span>
              <span className="font-medium text-gray-800">4.2%</span>
            </div>
            <div className="bg-white rounded-full h-2">
              <div className="gradient-primary h-2 rounded-full" style={{ width: "42%" }} />
            </div>
            <p className="text-xs text-gray-600">Benchmark deviation</p>
          </div>
        </div>
      </div>
    </div>
  )
}
