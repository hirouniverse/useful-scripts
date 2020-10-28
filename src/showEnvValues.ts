import * as path from 'path'
import { execSync } from 'child_process'
import { isValidEnv, Environment } from './Environment'

const execCommand = (cmd: string) => {
  return execSync(cmd, { stdio: 'inherit' })
}

const generateEnvString = (env: Environment): string[] => {
  const json = require(path.resolve(__dirname, '../env', `${env}.json`))
  const envValues: string[] = []

  Object.keys(json).forEach(key => {
    const value = json[key]
    if (!value) return

    const type = typeof(value)
    if (type === 'object') {
      Object.keys(value).forEach(key2 => {
        const value2 = value[key2]
        const type2 = typeof(value2)
        if (type2 === 'string' || type2 === 'number') {
          envValues.push(`${key}.${key2}=${value2}`)
        } else {
          throw new Error('Unsupported env var')
        }
      })
    } else {
      envValues.push(`${key}=${value}`)
    }
  })
  return envValues
}

const main = async () => {

  const env = process.argv[2]
  if (!isValidEnv(env)) throw new Error('parameter is invalid')

  const values = generateEnvString(env)
  if (values.length === 0) throw new Error('No env var')

  execCommand(`echo '${values.join(' ')}'`)

  process.exit(0)
}

main()
