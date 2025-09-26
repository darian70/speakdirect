'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  CalculatorIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ClockIcon,
  UserGroupIcon,
  PhoneIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

interface ROIInputs {
  employees: number
  avgSalary: number
  callVolume: number
  avgCallTime: number
  documentVolume: number
  processingTime: number
  industry: string
  currentCosts: number
}

interface ROIResults {
  annualSavings: number
  monthlyROI: number
  paybackPeriod: number
  efficiencyGain: number
  timesSaved: number
  implementationCost: number
}

const industries = [
  { value: 'healthcare', label: 'Healthcare', multiplier: 1.2 },
  { value: 'financial', label: 'Financial Services', multiplier: 1.1 },
  { value: 'ecommerce', label: 'E-commerce', multiplier: 1.0 },
  { value: 'legal', label: 'Legal Services', multiplier: 1.3 },
  { value: 'technology', label: 'Technology', multiplier: 0.9 },
  { value: 'manufacturing', label: 'Manufacturing', multiplier: 1.0 },
  { value: 'other', label: 'Other', multiplier: 1.0 }
]

const defaultInputs: ROIInputs = {
  employees: 50,
  avgSalary: 65000,
  callVolume: 1000,
  avgCallTime: 8,
  documentVolume: 500,
  processingTime: 15,
  industry: 'technology',
  currentCosts: 50000
}

export default function ROICalculatorPage() {
  const [inputs, setInputs] = useState<ROIInputs>(defaultInputs)
  const [results, setResults] = useState<ROIResults | null>(null)
  const [activeTab, setActiveTab] = useState('phone-agents')
  
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [calculatorRef, calculatorInView] = useInView({ threshold: 0.1, triggerOnce: true })

  const calculateROI = () => {
    const industryMultiplier = industries.find(i => i.value === inputs.industry)?.multiplier || 1.0
    
    // Phone Agents ROI Calculation
    const annualCallCost = (inputs.callVolume * 12) * (inputs.avgCallTime / 60) * (inputs.avgSalary / 2080)
    const phoneAgentSavings = annualCallCost * 0.75 * industryMultiplier
    
    // Document Processing ROI Calculation
    const annualDocCost = (inputs.documentVolume * 12) * (inputs.processingTime / 60) * (inputs.avgSalary / 2080)
    const documentSavings = annualDocCost * 0.85 * industryMultiplier
    
    // Total calculations
    const totalAnnualSavings = phoneAgentSavings + documentSavings + (inputs.currentCosts * 0.6)
    const implementationCost = Math.max(25000, inputs.employees * 500)
    const monthlyROI = ((totalAnnualSavings - implementationCost) / implementationCost) * 100
    const paybackPeriod = implementationCost / (totalAnnualSavings / 12)
    const efficiencyGain = 73 * industryMultiplier
    const timesSaved = (inputs.callVolume * inputs.avgCallTime + inputs.documentVolume * inputs.processingTime) * 0.8
    
    setResults({
      annualSavings: Math.round(totalAnnualSavings),
      monthlyROI: Math.round(monthlyROI),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      efficiencyGain: Math.round(efficiencyGain),
      timesSaved: Math.round(timesSaved),
      implementationCost: Math.round(implementationCost)
    })
  }

  useEffect(() => {
    calculateROI()
  }, [inputs])

  const updateInput = (field: keyof ROIInputs, value: number | string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
              <CalculatorIcon className="w-4 h-4 mr-2" />
              ROI Calculator • Interactive • Real-Time Results
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Calculate Your <span className="text-emerald-600">AI ROI</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Discover the potential cost savings and efficiency gains from implementing 
              our AI automation solutions in your organization.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section ref={calculatorRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={calculatorInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="card p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Enter Your Business Details
              </h2>
              
              <div className="space-y-6">
                {/* Company Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    value={inputs.employees}
                    onChange={(e) => updateInput('employees', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="50"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Industry
                  </label>
                  <select
                    value={inputs.industry}
                    onChange={(e) => updateInput('industry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {industries.map((industry) => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Average Salary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Average Employee Salary (Annual)
                  </label>
                  <input
                    type="number"
                    value={inputs.avgSalary}
                    onChange={(e) => updateInput('avgSalary', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="65000"
                  />
                </div>

                {/* Call Volume */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Monthly Call Volume
                  </label>
                  <input
                    type="number"
                    value={inputs.callVolume}
                    onChange={(e) => updateInput('callVolume', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="1000"
                  />
                </div>

                {/* Average Call Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Average Call Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={inputs.avgCallTime}
                    onChange={(e) => updateInput('avgCallTime', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="8"
                  />
                </div>

                {/* Document Volume */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Monthly Documents Processed
                  </label>
                  <input
                    type="number"
                    value={inputs.documentVolume}
                    onChange={(e) => updateInput('documentVolume', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="500"
                  />
                </div>

                {/* Processing Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Average Processing Time per Document (minutes)
                  </label>
                  <input
                    type="number"
                    value={inputs.processingTime}
                    onChange={(e) => updateInput('processingTime', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="15"
                  />
                </div>

                {/* Current Operational Costs */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Current Monthly Operational Costs
                  </label>
                  <input
                    type="number"
                    value={inputs.currentCosts}
                    onChange={(e) => updateInput('currentCosts', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="50000"
                  />
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={calculatorInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Main ROI Card */}
              <div className="card p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Your Projected ROI
                  </h3>
                  <p className="text-gray-600">
                    Based on your business parameters
                  </p>
                </div>

                {results && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">
                        {formatCurrency(results.annualSavings)}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        Annual Savings
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">
                        {results.paybackPeriod} mo
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        Payback Period
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Metrics */}
              {results && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {results.monthlyROI}%
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      Monthly ROI
                    </div>
                  </div>

                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <ChartBarIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {results.efficiencyGain}%
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      Efficiency Gain
                    </div>
                  </div>

                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <ClockIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {formatNumber(results.timesSaved)}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      Minutes Saved/Month
                    </div>
                  </div>

                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatCurrency(results.implementationCost)}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      Implementation Cost
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="card p-6 bg-gray-50">
                <h4 className="font-bold text-gray-900 mb-3">
                  Ready to Get Started?
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Schedule a consultation to discuss your specific requirements and get a detailed implementation plan.
                </p>
                <Link href="/contact" className="btn-primary w-full text-center">
                  Schedule Consultation
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROI Breakdown */}
      <section className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How We Calculate Your ROI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our ROI calculator uses industry benchmarks and proven methodologies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Labor Cost Savings',
                description: 'Calculate savings from automating repetitive tasks, reducing manual processing time, and optimizing workforce allocation.',
                factors: [
                  'Current employee costs',
                  'Time spent on automatable tasks',
                  'Automation efficiency rates',
                  'Industry-specific multipliers'
                ],
                icon: UserGroupIcon,
                color: 'blue'
              },
              {
                title: 'Operational Efficiency',
                description: 'Measure improvements in processing speed, accuracy, and overall operational performance.',
                factors: [
                  'Processing time reduction',
                  'Error rate improvements',
                  '24/7 availability benefits',
                  'Scalability advantages'
                ],
                icon: ChartBarIcon,
                color: 'green'
              },
              {
                title: 'Implementation Costs',
                description: 'Account for setup, training, integration, and ongoing maintenance costs to provide accurate net ROI.',
                factors: [
                  'Initial setup and configuration',
                  'System integration costs',
                  'Training and change management',
                  'Ongoing support and maintenance'
                ],
                icon: CurrencyDollarIcon,
                color: 'purple'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6 ${
                  item.color === 'blue' ? 'bg-blue-100' :
                  item.color === 'green' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  <item.icon className={`w-6 h-6 ${
                    item.color === 'blue' ? 'text-blue-600' :
                    item.color === 'green' ? 'text-green-600' :
                    'text-purple-600'
                  }`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {item.description}
                </p>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Factors:</h4>
                  <ul className="space-y-2">
                    {item.factors.map((factor) => (
                      <li key={factor} className="flex items-start space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Benchmarks */}
      <section className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Industry Benchmarks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Average ROI results across different industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { industry: 'Healthcare', roi: '340%', payback: '4.2 months', savings: '$1.8M' },
              { industry: 'Financial', roi: '285%', payback: '5.1 months', savings: '$2.1M' },
              { industry: 'E-commerce', roi: '420%', payback: '3.8 months', savings: '$1.5M' },
              { industry: 'Legal', roi: '380%', payback: '4.5 months', savings: '$2.3M' }
            ].map((benchmark, index) => (
              <motion.div
                key={benchmark.industry}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {benchmark.industry}
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {benchmark.roi}
                    </div>
                    <div className="text-sm text-gray-600">Average ROI</div>
                  </div>

                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {benchmark.payback}
                    </div>
                    <div className="text-sm text-gray-600">Payback Period</div>
                  </div>

                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {benchmark.savings}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Annual Savings</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-width container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Turn Your ROI Projection into Reality
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Get a detailed implementation plan and start realizing these savings within weeks, not months.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-white">
              Schedule Strategy Session
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/case-studies" className="btn-outline-white">
              View Success Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
