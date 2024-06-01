export type OpenIdProvider = 'Google' | 'Twitch' | 'Facebook'

export type AccountData = {
  provider: OpenIdProvider
  userAddr: string
  zkProofs: []
  ephemeralPrivateKey: string
  userSalt: string
  sub: string
  aud: string
  maxEpoch: number
}

export type SetupData = {
  provider: OpenIdProvider
  maxEpoch: number
  randomness: string
  ephemeralPrivateKey: string
}