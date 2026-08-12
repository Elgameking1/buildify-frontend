/**
 * Static copy for the landing page.
 *
 * What is left here is editorial: an explanation of how the marketplace works
 * and what it commits to. The fixtures that used to live alongside it -
 * invented products, invented workers, invented "240+ verified vendors"
 * counters and made-up customer quotes - are gone; every number and every card
 * on the home page now comes from the API.
 */

import {
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiClipboard,
  FiPackage,
  FiShield,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'

export const howItWorksSteps = [
  {
    id: 'search',
    title: 'Search',
    description:
      'Find materials and workers by category, skill, location, or project need.',
    icon: FiClipboard,
  },
  {
    id: 'compare',
    title: 'Compare',
    description:
      'Review pricing, ratings, availability, and stock levels before choosing.',
    icon: FiCheckCircle,
  },
  {
    id: 'book',
    title: 'Book or Buy',
    description:
      'Place an order against live stock, or send a worker a job request with the details.',
    icon: FiBriefcase,
  },
  {
    id: 'deliver',
    title: 'Build',
    description:
      'Follow each vendor line from confirmed to ready, and each job to completion.',
    icon: FiTruck,
  },
]

export const trustHighlights = [
  {
    id: 'verified',
    label: 'Vendors verified by an administrator',
    icon: FiShield,
  },
  { id: 'quality', label: 'Ratings only from completed jobs', icon: FiAward },
  { id: 'teams', label: 'Skills and availability kept current', icon: FiUsers },
  { id: 'materials', label: 'Stock checked at checkout', icon: FiPackage },
]
