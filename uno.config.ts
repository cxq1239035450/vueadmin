import {
  defineConfig,
  presetAttributify,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  rules: [
    [/^ft-(\d+)$/, v => ({ 'font-size': `${v[1]}px` })],
    [/^flex-(\d+)$/, v => ({ flex: v[1] })],
    [/^min-w-(\d+)$/, v => ({ 'min-width': `${v[1]}px` })],
    [/^max-w-(\d+)$/, v => ({ 'max-width': `${v[1]}px` })],
    [/^height-(\d+)$/, v => ({ height: `${v[1]}px` })],
    [/^width-(\d+)$/, v => ({ width: `${v[1]}px` })],
  ],
  presets: [presetAttributify(), presetUno()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
