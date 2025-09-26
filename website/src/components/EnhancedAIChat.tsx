'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserIcon,
  ComputerDesktopIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  type?: 'text' | 'lead-capture' | 'demo-request' | 'quick-action'
  data?: any
}

interface LeadData {
  name: string
  email: string
  company: string
  phone?: string
  interest: string
  message?: string
}

const quickActions = [
  { id: 'demo', label: 'Schedule Demo', icon: CalendarIcon },
  { id: 'roi', label: 'Calculate ROI', icon: DocumentTextIcon },
  { id: 'pricing', label: 'View Pricing', icon: ComputerDesktopIcon },
  { id: 'contact', label: 'Contact Sales', icon: PhoneIcon }
]

const aiResponses = {
  greeting: "Hi! I'm your AI assistant. I can help you learn about our automation solutions, schedule a demo, or calculate your potential ROI. What would you like to know?",
  demo: "I'd be happy to schedule a personalized demo for you! Let me collect some quick details to ensure we show you the most relevant features.",
  roi: "Great choice! Our ROI calculator can show you potential savings within minutes. Based on your industry and current operations, most clients see 200-400% ROI within the first year.",
  pricing: "Our pricing is tailored to your specific needs and scale. We offer flexible plans starting from $2,500/month for small businesses up to enterprise solutions. Would you like me to connect you with our sales team for a custom quote?",
  contact: "Perfect! I'll connect you with one of our AI automation specialists. They can answer detailed questions and provide a customized solution for your business.",
  phone_agents: "Our AI Phone Agents can handle customer service, appointment scheduling, and lead qualification 24/7. They integrate with your existing systems and can reduce call center costs by up to 75%. Would you like to see a live demo?",
  chatbots: "Our Web Chatbots provide instant customer support, lead capture, and can handle complex queries with 95% accuracy. They're perfect for e-commerce, SaaS, and service businesses. Interested in seeing how they work?",
  document_processing: "Our Document Processing AI can extract data from any document type with 99.7% accuracy. It's HIPAA compliant and integrates with your existing workflows. Many clients process documents 10x faster. Want to learn more?",
  workflow_automation: "Our Workflow Automation can streamline your entire operation - from lead management to customer onboarding. Most clients see 60-80% reduction in manual tasks. Should I show you some examples?"
}

export default function EnhancedAIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: '',
    message: ''
  })
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addAIMessage(aiResponses.greeting, 'text')
      }, 500)
    }
  }, [isOpen])

  // Accessibility: Escape to close and focus trap inside dialog
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement as HTMLElement | null
        if (e.shiftKey) {
          if (active === first || !dialogRef.current.contains(active)) {
            last.focus()
            e.preventDefault()
          }
        } else {
          if (active === last || !dialogRef.current.contains(active)) {
            first.focus()
            e.preventDefault()
          }
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = (text: string, sender: 'user' | 'ai', type: Message['type'] = 'text', data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type,
      data
    }
    setMessages(prev => [...prev, newMessage])
  }

  const addAIMessage = (text: string, type: Message['type'] = 'text', data?: any) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addMessage(text, 'ai', type, data)
    }, 1000 + Math.random() * 1000) // Simulate typing delay
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage(inputValue, 'user')
    const userMessage = inputValue.toLowerCase()
    setInputValue('')

    // Simple AI response logic
    setTimeout(() => {
      if (userMessage.includes('demo') || userMessage.includes('schedule')) {
        addAIMessage(aiResponses.demo)
        setTimeout(() => setShowLeadCapture(true), 1500)
      } else if (userMessage.includes('roi') || userMessage.includes('calculator') || userMessage.includes('savings')) {
        addAIMessage(aiResponses.roi)
      } else if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('pricing')) {
        addAIMessage(aiResponses.pricing)
      } else if (userMessage.includes('contact') || userMessage.includes('sales') || userMessage.includes('talk')) {
        addAIMessage(aiResponses.contact)
        setTimeout(() => setShowLeadCapture(true), 1500)
      } else if (userMessage.includes('phone') || userMessage.includes('call')) {
        addAIMessage(aiResponses.phone_agents)
      } else if (userMessage.includes('chatbot') || userMessage.includes('chat')) {
        addAIMessage(aiResponses.chatbots)
      } else if (userMessage.includes('document') || userMessage.includes('processing')) {
        addAIMessage(aiResponses.document_processing)
      } else if (userMessage.includes('workflow') || userMessage.includes('automation')) {
        addAIMessage(aiResponses.workflow_automation)
      } else {
        addAIMessage("I can help you with information about our AI solutions, schedule a demo, calculate ROI, or connect you with our sales team. What specific area interests you most?")
      }
    }, 500)
  }

  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId)
    if (!action) return

    addMessage(`I'd like to ${action.label.toLowerCase()}`, 'user')

    switch (actionId) {
      case 'demo':
        addAIMessage(aiResponses.demo)
        setTimeout(() => setShowLeadCapture(true), 1500)
        break
      case 'roi':
        addAIMessage("I'll redirect you to our ROI calculator where you can get instant results based on your business parameters.")
        setTimeout(() => {
          window.open('/roi-calculator', '_blank')
        }, 2000)
        break
      case 'pricing':
        addAIMessage(aiResponses.pricing)
        break
      case 'contact':
        addAIMessage(aiResponses.contact)
        setTimeout(() => setShowLeadCapture(true), 1500)
        break
    }
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    // Honeypot triggered – silently ignore
    if (honeypot.trim().length > 0) return

    setIsTyping(true)
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setLeadSubmitted(true)
      setShowLeadCapture(false)
      addAIMessage(`Thank you ${leadData.name}! I've forwarded your information to our team. You'll receive a calendar link within 5 minutes to schedule your personalized demo. In the meantime, feel free to explore our case studies or ROI calculator.`)

      // Reset form
      setLeadData({
        name: '',
        email: '',
        company: '',
        phone: '',
        interest: '',
        message: ''
      })
    } catch (error) {
      addAIMessage("I apologize, but there was an issue submitting your information. Please try again or contact us directly at SpeakDirectSales@gmail.com")
    } finally {
      setIsTyping(false)
      setIsSubmitting(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        }`}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={isOpen}
        aria-controls="enhanced-ai-chat"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="enhanced-ai-chat"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enhanced-ai-chat-title"
            ref={dialogRef}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ComputerDesktopIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="enhanced-ai-chat-title" className="font-semibold">AI Assistant</h3>
                  <p className="text-sm text-white/80">Online • Typically replies instantly</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white order-1 ml-2' 
                      : 'bg-gray-200 text-gray-600 order-2 mr-2'
                  }`}>
                    {message.sender === 'user' ? (
                      <UserIcon className="w-4 h-4" />
                    ) : (
                      <ComputerDesktopIcon className="w-4 h-4" />
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {messages.length === 1 && !isTyping && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">Quick actions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action.id)}
                        className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                      >
                        <action.icon className="w-4 h-4 text-blue-600" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Lead Capture Form */}
            {showLeadCapture && !leadSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-50 border-t border-blue-200"
              >
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <h4 className="font-semibold text-blue-900 text-sm">Let's get you connected!</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Name*"
                      value={leadData.name}
                      onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                      aria-label="Your name"
                      minLength={2}
                      className="px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email*"
                      value={leadData.email}
                      onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                      aria-label="Your email"
                      inputMode="email"
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      className="px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Company*"
                    value={leadData.company}
                    onChange={(e) => setLeadData(prev => ({ ...prev, company: e.target.value }))}
                    aria-label="Your company"
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {/* Honeypot field for bots */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      type="text"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  
                  <select
                    value={leadData.interest}
                    onChange={(e) => setLeadData(prev => ({ ...prev, interest: e.target.value }))}
                    aria-label="Primary interest"
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Primary Interest*</option>
                    <option value="phone-agents">AI Phone Agents</option>
                    <option value="chatbots">Web Chatbots</option>
                    <option value="document-processing">Document Processing</option>
                    <option value="workflow-automation">Workflow Automation</option>
                    <option value="all-solutions">All Solutions</option>
                  </select>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowLeadCapture(false)}
                      className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !leadData.name || !leadData.email || !leadData.company || !leadData.interest}
                      className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Success Message */}
            {leadSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border-t border-green-200"
              >
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Information submitted successfully!</span>
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
