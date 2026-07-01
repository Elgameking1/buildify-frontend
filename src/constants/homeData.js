import {
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiClipboard,
  FiHardDrive,
  FiHome,
  FiPackage,
  FiShield,
  FiTool,
  FiTruck,
  FiUsers,
  FiZap,
} from 'react-icons/fi'

export const featuredCategories = [
  {
    id: 'cement',
    name: 'Cement & Concrete',
    description: 'Bulk cement, ready-mix concrete, blocks, and aggregates.',
    icon: FiHome,
  },
  {
    id: 'steel',
    name: 'Steel & Rebar',
    description: 'Structural steel, reinforcement bars, mesh, and fasteners.',
    icon: FiHardDrive,
  },
  {
    id: 'tools',
    name: 'Tools & Equipment',
    description: 'Site-ready tools, safety kits, and heavy-duty equipment.',
    icon: FiTool,
  },
  {
    id: 'electrical',
    name: 'Electrical Supplies',
    description: 'Cables, panels, lighting fixtures, and power accessories.',
    icon: FiZap,
  },
]

export const featuredProducts = [
  {
    id: 'rebar-set',
    name: 'High-Tensile Rebar Bundle',
    category: 'Steel',
    price: '$420',
    unit: 'per bundle',
    badge: 'Best Seller',
  },
  {
    id: 'cement-bags',
    name: 'Premium Portland Cement',
    category: 'Concrete',
    price: '$14',
    unit: 'per bag',
    badge: 'In Stock',
  },
  {
    id: 'safety-kit',
    name: 'Complete Site Safety Kit',
    category: 'Safety',
    price: '$89',
    unit: 'per kit',
    badge: 'New',
  },
]

export const featuredWorkers = [
  {
    id: 'mason',
    name: 'Daniel Mensah',
    role: 'Masonry Specialist',
    rating: '4.9',
    projects: '128 projects',
    location: 'Accra',
  },
  {
    id: 'electrician',
    name: 'Ama Owusu',
    role: 'Licensed Electrician',
    rating: '4.8',
    projects: '94 projects',
    location: 'Tema',
  },
  {
    id: 'welder',
    name: 'Kwame Boateng',
    role: 'Structural Welder',
    rating: '4.9',
    projects: '112 projects',
    location: 'Kumasi',
  },
]

export const howItWorksSteps = [
  {
    id: 'search',
    title: 'Search',
    description: 'Find verified materials and workers by category, location, or project need.',
    icon: FiClipboard,
  },
  {
    id: 'compare',
    title: 'Compare',
    description: 'Review pricing, ratings, availability, and delivery options before choosing.',
    icon: FiCheckCircle,
  },
  {
    id: 'book',
    title: 'Book or Buy',
    description: 'Place an order or request a worker with clear project details.',
    icon: FiBriefcase,
  },
  {
    id: 'deliver',
    title: 'Build',
    description: 'Track fulfillment and keep your construction schedule moving.',
    icon: FiTruck,
  },
]

export const testimonials = [
  {
    id: 'site-manager',
    quote:
      'We sourced concrete supplies and two skilled masons in the same afternoon. It made our site planning much smoother.',
    name: 'Nana Adjei',
    role: 'Site Manager',
  },
  {
    id: 'developer',
    quote:
      'The worker profiles are clear, and the product cards make it easy to compare materials before ordering.',
    name: 'Esi Coleman',
    role: 'Property Developer',
  },
]

export const stats = [
  { id: 'vendors', label: 'Verified vendors', value: '240+' },
  { id: 'workers', label: 'Skilled workers', value: '1.8k' },
  { id: 'deliveries', label: 'Completed orders', value: '12k' },
]

export const trustHighlights = [
  { id: 'verified', label: 'Verified suppliers', icon: FiShield },
  { id: 'quality', label: 'Quality checked', icon: FiAward },
  { id: 'teams', label: 'Trusted workers', icon: FiUsers },
  { id: 'materials', label: 'Fast sourcing', icon: FiPackage },
]
