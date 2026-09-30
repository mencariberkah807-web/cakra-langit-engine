import { createProfileResult } from './adapterContract.js'

export function adaptJawaProfile(context) {
  const result = context.profileData?.jawa || null

  if (!result) {
    return createProfileResult({
      id: 'jawa-profile',
      title: 'Weton Jawa',
      detail: null,
      meta: { status: 'UNAVAILABLE' },
    })
  }

  return createProfileResult({
    id: 'jawa-profile',
    title: 'Weton Jawa',
    primary: result.weton || '',
    secondary: result.yearName ? result.monthName + ' ' + result.yearName : '',
    details: [
      { label: 'Hari', value: result.dayName || '' },
      { label: 'Pasaran', value: result.pasaran || '' },
      { label: 'Wuku', value: result.wuku || '' },
      { label: 'Windu', value: result.windu || '' },
    ],
    detail: result,
    effectiveDate: result.effectiveDate || context.profile?.birth?.date || null,
    boundary: 'PROFILE_INPUT',
    meta: { status: 'SOURCE_COMPILED', engine: result.meta?.engine || 'Jawa' },
  })
}