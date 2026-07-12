import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { sanitizeTokenOverrides } from '@/lib/theme/validation'
import { serializeThemeConfig } from '@/lib/theme/theme-config-codegen'

export const runtime = 'nodejs'

/** Works whether this app uses a src/ layout or not. */
function themeConfigPath(): string {
  const withSrc = path.join(process.cwd(), 'src/lib/theme/theme-config.ts')
  if (fs.existsSync(withSrc)) return withSrc
  return path.join(process.cwd(), 'lib/theme/theme-config.ts')
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, message: 'Theme editing is disabled in production.' }, { status: 403 })
  }

  const body = (await request.json()) as unknown
  const token =
    typeof body === 'object' && body !== null && 'token' in body
      ? sanitizeTokenOverrides((body as { token: unknown }).token)
      : {}

  const filePath = themeConfigPath()
  const existingSource = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null
  fs.writeFileSync(filePath, serializeThemeConfig(existingSource, token))

  return NextResponse.json({ ok: true, message: `Saved ${Object.keys(token).length} token override(s).` })
}
