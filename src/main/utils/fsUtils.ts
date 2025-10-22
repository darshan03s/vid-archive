import { access } from 'node:fs/promises'
import { accessSync, constants, mkdirSync } from 'node:fs'

export async function pathExists(pathToCheck: string): Promise<boolean> {
  try {
    await access(pathToCheck, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export function pathExistsSync(pathToCheck: string): boolean {
  try {
    accessSync(pathToCheck, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export function makeDirs(path: string) {
  mkdirSync(path, { recursive: true })
}
