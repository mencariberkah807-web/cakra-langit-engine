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
  const primary = result.eightChar || ''
  const secondary = Object.values(pillars).map((pillar) => pillar?.selected || pillar?.ganzhi || '').filter(Boolean).join(' · ')

  return createProfileResult({
    id: 'bazi-profile',
    title: 'BaZi',
    primary,
    secondary,
    details: [
      { label: 'Eight Characters', value: primary },
      { label: 'Pillars', value: secondary },
    ],
    detail: result,
    effectiveDate: context.profile?.birth?.date || null,
    boundary: 'PROFILE_INPUT',
    meta: { status: 'SOURCE_COMPILED', engine: result.engine || 'lunar-javascript' },
  })
}