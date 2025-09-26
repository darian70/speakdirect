'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: "Hi! I'm your AI assistant. I can help you find the perfect automation solution for your business. What industry are you in?",
    timestamp: new Date(),
    suggestions: ['Healthcare', 'Legal Services', 'Real Estate', 'E-commerce', 'Other']
  }
]

const responses = {
  healthcare: {
    content: "Perfect! For healthcare practices, our most popular solutions are:\n\n• **Patient Scheduling AI** - Reduces no-shows by 50%\n• **HIPAA-Compliant Chatbots** - 24/7 patient support\n• **Medical Records Processing** - Automated data extraction\n\nWhat's your biggest operational challenge?",
    suggestions: ['Patient no-shows', 'Staff overwhelm', 'After-hours calls', 'Insurance verification']
  },
  legal: {
    content: "Excellent! Law firms love our automation solutions:\n\n• **Client Intake AI** - Qualify leads 24/7\n• **Document Analysis** - Contract review automation\n• **Appointment Scheduling** - Never miss a consultation\n\nWhat takes up most of your staff's time?",
    suggestions: ['Client intake', 'Document review', 'Scheduling', 'Follow-up calls']
  },
  'real estate': {
    content: "Great choice! Real estate professionals see amazing results with:\n\n• **Lead Qualification AI** - Score prospects automatically\n• **Property Inquiry Bot** - Handle listing questions 24/7\n• **Appointment Scheduling** - Book showings instantly\n\nHow many leads do you handle per month?",
    suggestions: ['Under 50', '50-200', '200-500', '500+']
  },
  ecommerce: {
    content: "Perfect! E-commerce businesses love these solutions:\n\n• **Customer Support AI** - Handle 80% of inquiries\n• **Order Processing** - Automated status updates\n• **Returns Management** - Streamline refund process\n\nWhat's your biggest customer service challenge?",
    suggestions: ['High ticket volume', 'After-hours support', 'Order tracking', 'Returns processing']
  },
  pricing: {
    content: "Our pricing is transparent and scalable:\n\n• **Starter**: $2,999 setup + $399/month\n• **Professional**: $5,999 setup + $799/month\n• **Enterprise**: Custom pricing\n\nMost clients see ROI within 3-6 months. Would you like a custom quote?",
    suggestions: ['Yes, get quote', 'See case studies', 'Schedule demo', 'Compare plans']
  },
  demo: {
    content: "I'd love to show you our solutions in action! Our demos are:\n\n• **15-30 minutes** - Focused on your needs\n• **Live demonstration** - See real AI agents\n• **Custom scenarios** - Your industry examples\n• **ROI analysis** - Projected savings\n\nWhat's the best way to reach you?",
    suggestions: ['Schedule now', 'Email me details', 'Call me', 'Send information']
  }
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on Escape and focus trap handling
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const generateResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Industry detection
    if (lowerMessage.includes('healthcare') || lowerMessage.includes('medical') || lowerMessage.includes('hospital')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: responses.healthcare.content,
        timestamp: new Date(),
        suggestions: responses.healthcare.suggestions
      }
    }
    
    if (lowerMessage.includes('legal') || lowerMessage.includes('law') || lowerMessage.includes('attorney')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: responses.legal.content,
        timestamp: new Date(),
        suggestions: responses.legal.suggestions
      }
    }
    
    if (lowerMessage.includes('real estate') || lowerMessage.includes('property') || lowerMessage.includes('realtor')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: responses['real estate'].content,
        timestamp: new Date(),
        suggestions: responses['real estate'].suggestions
      }
    }
    
    if (lowerMessage.includes('ecommerce') || lowerMessage.includes('e-commerce') || lowerMessage.includes('online store')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: responses.ecommerce.content,
        timestamp: new Date(),
        suggestions: responses.ecommerce.suggestions
      }
    }
    
    // Intent detection
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: responses.pricing.content,
        timestamp: new Date(),
        suggestions: responses.pricing.suggestions
      }
    }
    
    if (lowerMessage.includes('demo') || lowerMessage.includes('show me') || lowerMessage.includes('demonstration')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: responses.demo.content,
        timestamp: new Date(),
        suggestions: responses.demo.suggestions
      }
    }
    
    // Default responses
    const defaultResponses = [
      {
        content: "I'd be happy to help you find the right AI solution! Can you tell me more about your business or what challenges you're facing?",
        suggestions: ['Tell me about pricing', 'Show me a demo', 'Healthcare solutions', 'Legal solutions']
      },
      {
        content: "Our AI agents can help with phone calls, customer support, document processing, and workflow automation. What area interests you most?",
        suggestions: ['Phone agents', 'Chatbots', 'Document processing', 'Workflow automation']
      },
      {
        content: "We work with businesses of all sizes across many industries. What type of business do you run?",
        suggestions: ['Healthcare', 'Legal', 'Real Estate', 'E-commerce', 'Other']
      }
    ]
    
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: randomResponse.content,
      timestamp: new Date(),
      suggestions: randomResponse.suggestions
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateResponse(content)
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-primary-600 hover:bg-primary-700 animate-pulse-glow'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={isOpen}
        aria-controls="ai-chat-window"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
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
            id="ai-chat-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-chat-title"
            ref={dialogRef}
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">AI</span>
                </div>
                <div>
                  <h3 id="ai-chat-title" className="font-semibold">SpeakDirect Assistant</h3>
                  <p className="text-xs text-white/80">Online • Typically replies instantly</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === 'user' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-line text-sm">{message.content}</div>
                    {message.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  aria-label="Type your message"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  aria-label="Send message"
                  className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <PaperAirplaneIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
