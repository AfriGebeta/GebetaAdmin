import { Profile } from '@/model'

export function getFeatureAccessToken(profile: Profile | null): string | null {
  //first checknig if the prof and token exists
  if (!profile || !profile.token || !Array.isArray(profile.token)) {
    return null
  }

  //finding the feature containing one
  const featureToken = profile.token.find(
    (token) => token.tokenType === 'FEATUREACCESSTOKEN' && !token.revoked
  )

  return featureToken?.token || null
}
