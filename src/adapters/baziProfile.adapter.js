import { createProfileResult } from './adapterContract.js'

export function adaptBaziProfile(context) {
  const result = context.profileData?.bazi || null

  if (!result) {
    return createProfileResult({
      id: 'bazi-profile',
      title: 'BaZi',
      detail: null,
      meta: { status: 'UNAVAILABLE' },
    })
  }

  const pillars = result.pillars || {}
  const primary = result.day_master?.name || result.dayMaster?.name || ''
  const secondary = Object.values(pillars).map((pillar) => pillar?.name || pillar?.ganZhi || '').filter(Boolean).join(' · ')

  return createProfileResult({
    id: 'bazi-profile',
    title: 'BaZi',
    primary,
    secondary,
    details: [
      { label: 'Day Master', value: primary },
      { label: 'Pillars', value: secondary },
    ],
    detail: result,
    effectiveDate: context.profile?.birth?.date || null,
    boundary: 'PROFILE_INPUT',
    meta: { status: 'SOURCE_COMPILED', engine: result.engine || 'lunar-javascript' },
  })
}