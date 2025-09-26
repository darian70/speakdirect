'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const openPositions = [
  {
    title: 'Senior AI Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Build and scale AI systems that power our automation platform. Work with cutting-edge ML models and distributed systems.',
    requirements: [
      'MS/PhD in Computer Science or related field',
      'Experience with Python, TensorFlow/PyTorch',
      'Knowledge of distributed systems and cloud platforms',
      'Strong background in machine learning and NLP'
    ],
    salary: '$180k - $250k',
    equity: '0.1% - 0.5%'
  },
  {
    title: 'Product Manager - AI Solutions',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    experience: '4+ years',
    description: 'Drive product strategy for our AI automation solutions. Work closely with engineering and customers to define the future of AI.',
    requirements: [
      'MBA or equivalent experience',
      'Product management experience in B2B SaaS',
      'Understanding of AI/ML technologies',
      'Strong analytical and communication skills'
    ],
    salary: '$160k - $220k',
    equity: '0.05% - 0.3%'
  },
  {
    title: 'Enterprise Sales Executive',
    department: 'Sales',
    location: 'Remote (US)',
    type: 'Full-time',
    experience: '6+ years',
    description: 'Drive revenue growth by selling AI automation solutions to Fortune 500 companies. Build relationships with C-level executives.',
    requirements: [
      'Proven track record in enterprise software sales',
      'Experience selling to Fortune 500 companies',
      'Strong presentation and negotiation skills',
      'Understanding of AI/automation technologies'
    ],
    salary: '$120k - $180k',
    equity: '0.02% - 0.2%',
    commission: 'Up to $300k OTE'
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Build and maintain our cloud infrastructure. Ensure high availability and scalability of our AI platform.',
    requirements: [
      'Experience with AWS/GCP/Azure',
      'Kubernetes and Docker expertise',
      'Infrastructure as Code (Terraform)',
      'Monitoring and observability tools'
    ],
    salary: '$140k - $190k',
    equity: '0.05% - 0.25%'
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Ensure customer success and drive expansion revenue. Help customers maximize value from our AI solutions.',
    requirements: [
      'Experience in customer success or account management',
      'Strong technical aptitude',
      'Excellent communication skills',
      'Experience with enterprise software'
    ],
    salary: '$100k - $140k',
    equity: '0.02% - 0.15%'
  },
  {
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    experience: '4+ years',
    description: 'Design intuitive user experiences for our AI platform. Create beautiful and functional interfaces for complex AI systems.',
    requirements: [
      'Portfolio demonstrating B2B SaaS design',
      'Proficiency in Figma and design systems',
      'Experience with user research and testing',
      'Understanding of AI/ML interfaces'
    ],
    salary: '$130k - $180k',
    equity: '0.03% - 0.2%'
  }
]

const benefits = [
  {
    category: 'Health & Wellness',
    icon: HeartIcon,
    items: [
      'Comprehensive health, dental, and vision insurance',
      'Mental health support and counseling',
      'Wellness stipend for gym/fitness',
      'Flexible PTO and sabbatical options'
    ]
  },
  {
    category: 'Financial',
    icon: CurrencyDollarIcon,
    items: [
      'Competitive salary and equity packages',
      '401(k) with company matching',
      'Performance bonuses and stock options',
      'Professional development budget'
    ]
  },
  {
    category: 'Work-Life Balance',
    icon: ClockIcon,
    items: [
      'Flexible working hours',
      'Remote-first culture',
      'Unlimited PTO policy',
      'Family leave and parental support'
    ]
  },
  {
    category: 'Growth & Learning',
    icon: AcademicCapIcon,
    items: [
      '$5,000 annual learning budget',
      'Conference attendance support',
      'Internal mentorship programs',
      'Career development planning'
    ]
  }
]

const companyPerks = [
  {
    title: 'Remote-First Culture',
    description: 'Work from anywhere with flexible hours and async communication.',
    icon: GlobeAltIcon
  },
  {
    title: 'Cutting-Edge Technology',
    description: 'Work with the latest AI technologies and tools in the industry.',
    icon: ComputerDesktopIcon
  },
  {
    title: 'High-Impact Work',
    description: 'Your work directly impacts thousands of businesses and millions of users.',
    icon: RocketLaunchIcon
  },
  {
    title: 'Learning Culture',
    description: 'Continuous learning with access to courses, conferences, and mentorship.',
    icon: LightBulbIcon
  }
]

const careerStats = [
  { label: 'Team Growth', value: '300%', description: 'Year-over-year team expansion' },
  { label: 'Employee Satisfaction', value: '4.9/5', description: 'Average rating on Glassdoor' },
  { label: 'Retention Rate', value: '95%', description: 'Employee retention after 2 years' },
  { label: 'Diversity', value: '45%', description: 'Women and underrepresented minorities' }
]

const departments = [
  { name: 'Engineering', openings: 8, icon: ComputerDesktopIcon },
  { name: 'Product', openings: 3, icon: LightBulbIcon },
  { name: 'Sales', openings: 5, icon: ChartBarIcon },
  { name: 'Customer Success', openings: 4, icon: UserGroupIcon },
  { name: 'Marketing', openings: 2, icon: GlobeAltIcon },
  { name: 'Operations', openings: 3, icon: BuildingOfficeIcon }
]

export default function CareersPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [positionsRef, positionsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [perksRef, perksInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const router = useRouter()

  useEffect(() => {
    router.replace('/company/about')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
        <p className="text-gray-600">Taking you to our About page.</p>
      </div>
    </div>
  )
}
