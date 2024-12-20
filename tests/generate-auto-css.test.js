import test, { describe, it } from 'node:test'
import assert from 'node:assert'
import { generateTheme } from '../lib/generate-auto-css.js'
import { defaultTheme } from '../lib/generate-full-css.js'

// Theme testing
{
  // Test customTheme works
  describe('generateTheme should return correct values for coorect colors, along withb default values in theme, when:', () => {
    it('customTheme is empty', () => {
      const theme = generateTheme({}, defaultTheme)
      assert.strictEqual(theme.colors.primary.toString({format: "hex"}), defaultTheme.colors.primary)
    })
  })
  it('customTheme is has a customColor that is valid', () => {
    const customTheme = { colors: { balle: '#A6B626' } }
    const theme = generateTheme(customTheme, defaultTheme)
    theme.colors.bud
    assert.strictEqual(theme.colors.balle.toString({format: 'hex'}).toUpperCase(), customTheme.colors.balle.toUpperCase())
  })
}