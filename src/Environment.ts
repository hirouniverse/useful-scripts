export type Environment = 'dev' | 'prod'
export const isValidEnv = (value: string): value is Environment => {
  return ['dev', 'prod'].includes(value)
}
