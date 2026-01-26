import { useState, useCallback } from 'react'
import basic from '../basic.json'
import dark from '../dark.json'
import standard from '../standard.json'
import darkCustom from '../dark-custom.json'

export const useStyleManager = () => {
  const [originalStyle, setOriginalStyle] = useState<any>(null)
  const [layerOverrides, setLayerOverrides] = useState<Record<string, any>>({})
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)

  const presetStyles = [
    { name: 'Gebeta Basic', style: basic },
    { name: 'Gebeta Dark', style: dark },
    { name: 'Gebeta Standard', style: standard },
    { name: 'Dark Custom', style: darkCustom },
  ]

  const loadDefaultStyle = useCallback(() => {
    const apiKey = import.meta.env.VITE_GEBETA_API_KEY
    const styleWithAuth = JSON.parse(JSON.stringify(basic))

    if (apiKey && styleWithAuth.sources?.openmaptiles?.tiles) {
      styleWithAuth.sources.openmaptiles.tiles =
        styleWithAuth.sources.openmaptiles.tiles.map(
          (url: string) => `${url}?apiKey=${apiKey}`
        )
      if (styleWithAuth.glyphs) {
        styleWithAuth.glyphs = `${styleWithAuth.glyphs}?apiKey=${apiKey}`
      }
    }

    setOriginalStyle(styleWithAuth)
  }, [])

  const loadNewStyle = useCallback((style: any) => {
    const apiKey = import.meta.env.VITE_GEBETA_API_KEY

    //replacing
    if (style.sources?.openmaptiles?.tiles) {
      style.sources.openmaptiles.tiles = style.sources.openmaptiles.tiles.map(
        (url: string) => {
          let cleanUrl = url.replace(
            '~~TILE_ENDPOINT~~',
            'https://tiles.gebeta.app/tiles'
          )
          cleanUrl = cleanUrl.split('?')[0]
          return apiKey ? `${cleanUrl}?apiKey=${apiKey}` : cleanUrl
        }
      )
    }

    if (style.glyphs) {
      let cleanGlyphs = style.glyphs.replace(
        '~~TILE_ENDPOINT~~',
        'https://tiles.gebeta.app'
      )
      cleanGlyphs = cleanGlyphs.split('?')[0]
      style.glyphs = apiKey ? `${cleanGlyphs}?apiKey=${apiKey}` : cleanGlyphs
    }

    if (style.sprite && style.sprite.includes('~~TILE_ENDPOINT~~')) {
      style.sprite = style.sprite.replace(
        '~~TILE_ENDPOINT~~',
        'https://tiles.gebeta.app'
      )
    }

    setOriginalStyle(style)
    setLayerOverrides({})
    setSelectedLayerId(null)
  }, [])

  const getCurrentStyle = useCallback(() => {
    if (!originalStyle) return null

    const exportedLayers = originalStyle.layers.map((layer: any) => {
      const override = layerOverrides[layer.id]
      if (!override) return layer
      const merged = { ...layer, ...override }
      if (override.paint) merged.paint = { ...layer.paint, ...override.paint }
      if (override.layout)
        merged.layout = { ...layer.layout, ...override.layout }
      return merged
    })

    const newLayers = Object.values(layerOverrides).filter(
      (layer: any) => !originalStyle.layers.some((l: any) => l.id === layer.id)
    )

    return {
      ...originalStyle,
      layers: [...exportedLayers, ...newLayers],
    }
  }, [originalStyle, layerOverrides])

  const exportStyle = useCallback(() => {
    const fullStyle = getCurrentStyle()
    if (!fullStyle) return

    const cleanStyle = JSON.parse(JSON.stringify(fullStyle))

    if (cleanStyle.sources?.openmaptiles?.tiles) {
      cleanStyle.sources.openmaptiles.tiles =
        cleanStyle.sources.openmaptiles.tiles.map(
          (url: string) => url.split('?')[0]
        )
    }

    if (cleanStyle.glyphs) {
      cleanStyle.glyphs = cleanStyle.glyphs.split('?')[0]
    }

    if (cleanStyle.sprite && cleanStyle.sprite.includes('?')) {
      cleanStyle.sprite = cleanStyle.sprite.split('?')[0]
    }

    const blob = new Blob([JSON.stringify(cleanStyle, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'map-style.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [getCurrentStyle])

  const resetToDefault = useCallback(() => {
    if (
      confirm(
        'Are you sure you want to reset to the default style? This will clear all your changes.'
      )
    ) {
      localStorage.removeItem('mapStyleEditor')
      localStorage.removeItem('mapStyleOverrides')
      loadDefaultStyle()
      setLayerOverrides({})
      setSelectedLayerId(null)
    }
  }, [loadDefaultStyle])

  return {
    originalStyle,
    setOriginalStyle,
    layerOverrides,
    setLayerOverrides,
    selectedLayerId,
    setSelectedLayerId,
    presetStyles,
    loadDefaultStyle,
    loadNewStyle,
    getCurrentStyle,
    exportStyle,
    resetToDefault,
  }
}
