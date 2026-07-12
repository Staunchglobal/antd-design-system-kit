import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  configPath,
  priorSelectionFor,
  readSelectionConfig,
  recordFileHashes,
  sha256,
  writeSelectionConfig,
} from './selection-state'

let root: string

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'antd-design-kit-test-'))
})

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true })
})

describe('readSelectionConfig', () => {
  it('returns null when no config file exists', () => {
    expect(readSelectionConfig(root)).toBeNull()
  })

  it('returns null when the config file has invalid JSON', () => {
    fs.writeFileSync(configPath(root), '{ not valid json')
    expect(readSelectionConfig(root)).toBeNull()
  })

  it('fills in defaults for missing fields', () => {
    fs.writeFileSync(configPath(root), JSON.stringify({}))
    expect(readSelectionConfig(root)).toEqual({ version: 1, framework: 'next', components: [], fileHashes: {} })
  })
})

describe('writeSelectionConfig', () => {
  it('writes a sorted component list and preserves existing fileHashes', () => {
    recordFileHashes(root, [{ relPath: 'a.ts', content: 'hello' }])
    writeSelectionConfig(root, 'vite', ['tag', 'button', 'card'])

    const config = readSelectionConfig(root)
    expect(config?.framework).toBe('vite')
    expect(config?.components).toEqual(['button', 'card', 'tag'])
    expect(config?.fileHashes).toEqual({ 'a.ts': sha256('hello') })
  })
})

describe('priorSelectionFor', () => {
  it('returns [] for a brand-new install', () => {
    expect(priorSelectionFor(root)).toEqual([])
  })

  it('returns the previously written selection', () => {
    writeSelectionConfig(root, 'next', ['button'])
    expect(priorSelectionFor(root)).toEqual(['button'])
  })
})

describe('recordFileHashes', () => {
  it('is a no-op given an empty entry list on a brand-new install', () => {
    recordFileHashes(root, [])
    expect(fs.existsSync(configPath(root))).toBe(false)
  })

  it('creates a config with default framework/components when none exists yet', () => {
    recordFileHashes(root, [{ relPath: 'x.ts', content: 'abc' }])
    const config = readSelectionConfig(root)
    expect(config?.framework).toBe('next')
    expect(config?.components).toEqual([])
    expect(config?.fileHashes['x.ts']).toBe(sha256('abc'))
  })

  it('merges new hashes into existing ones without dropping prior entries', () => {
    recordFileHashes(root, [{ relPath: 'a.ts', content: '1' }])
    recordFileHashes(root, [{ relPath: 'b.ts', content: '2' }])
    const config = readSelectionConfig(root)
    expect(config?.fileHashes).toEqual({ 'a.ts': sha256('1'), 'b.ts': sha256('2') })
  })

  it('overwrites the hash for a re-recorded path', () => {
    recordFileHashes(root, [{ relPath: 'a.ts', content: '1' }])
    recordFileHashes(root, [{ relPath: 'a.ts', content: 'changed' }])
    const config = readSelectionConfig(root)
    expect(config?.fileHashes['a.ts']).toBe(sha256('changed'))
  })
})

describe('sha256', () => {
  it('is deterministic and content-sensitive', () => {
    expect(sha256('hello')).toBe(sha256('hello'))
    expect(sha256('hello')).not.toBe(sha256('hello!'))
  })
})
