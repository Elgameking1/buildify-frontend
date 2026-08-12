import { adaptUser } from './adapters'
import { api } from './api'

/** Account and vendor-profile management for the signed-in user. */
export const usersService = {
  getMe: async () => {
    const { data } = await api.get('/users/me')
    return {
      ...adaptUser(data),
      vendorProfile: data.vendor_profile
        ? {
            businessName: data.vendor_profile.business_name,
            description: data.vendor_profile.description ?? '',
            location: data.vendor_profile.location ?? '',
            logoUrl: data.vendor_profile.logo_url,
            isVerified: data.vendor_profile.is_verified,
          }
        : null,
      workerProfile: data.worker_profile
        ? {
            headline: data.worker_profile.headline ?? '',
            yearsExperience: data.worker_profile.years_experience,
            baseRate: data.worker_profile.base_rate,
            availability: data.worker_profile.availability_status,
            rating: Number(data.worker_profile.avg_rating ?? 0),
            ratingCount: data.worker_profile.rating_count ?? 0,
          }
        : null,
    }
  },

  updateMe: async ({ name, phone, region, city }) => {
    const { data } = await api.patch('/users/me', {
      full_name: name,
      phone,
      region,
      city,
    })
    return adaptUser(data)
  },

  getVendorProfile: async () => {
    const { data } = await api.get('/users/me/vendor-profile')
    return {
      businessName: data.business_name,
      description: data.description ?? '',
      location: data.location ?? '',
      logoUrl: data.logo_url,
      isVerified: data.is_verified,
    }
  },

  updateVendorProfile: async ({ businessName, description, location }) => {
    const { data } = await api.patch('/users/me/vendor-profile', {
      business_name: businessName,
      description,
      location,
    })
    return {
      businessName: data.business_name,
      description: data.description ?? '',
      location: data.location ?? '',
      logoUrl: data.logo_url,
      isVerified: data.is_verified,
    }
  },
}
