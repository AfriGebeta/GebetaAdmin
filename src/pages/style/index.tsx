//@ts-nocheck
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useStyleManager } from './hooks/useStyleManager'
import { LayerList } from './components/LayerList'
import { LayerEditor } from './components/LayerEditor'
import { AddLayerModal } from './components/AddLayerModal'
import { OpenStyleModal } from './components/OpenStyleModal'
import { FullEditorModal } from './components/FullEditorModal'

export default function Style() {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const fileInputRef = useRef(null)

  const {
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
  } = useStyleManager()

  const [layerJSON, setLayerJSON] = useState('')
  const [fullStyleJSON, setFullStyleJSON] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [groupedLayers, setGroupedLayers] = useState(null)
  const [showFullEditor, setShowFullEditor] = useState(false)

  const [expandedSections, setExpandedSections] = useState({
    paint: true,
    json: false,
  })

  const [layerListCollapsed, setLayerListCollapsed] = useState(false)
  const [layerEditorCollapsed, setLayerEditorCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(30) // percentage

  // Calculate absolute pixel widths for each panel
  const getAbsoluteWidths = () => {
    const viewportWidth =
      typeof window !== 'undefined' ? window.innerWidth : 1920
    const sidebarPx = (viewportWidth * sidebarWidth) / 100
    return {
      layerListPx: sidebarPx * 0.4,
      layerEditorPx: sidebarPx * 0.6,
    }
  }

  // Calculate individual panel widths based on sidebar width
  const layerListWidth = sidebarWidth * 0.4 // 40% of sidebar
  const layerEditorWidth = sidebarWidth * 0.6 // 60% of sidebar

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidth = sidebarWidth

      const handleMouseMove = (e) => {
        const deltaX = e.clientX - startX
        const containerWidth = window.innerWidth
        const deltaPercent = (deltaX / containerWidth) * 100
        const newWidth = Math.min(Math.max(startWidth + deltaPercent, 15), 50)
        setSidebarWidth(newWidth)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    [sidebarWidth]
  )

  //for modals
  const [showAddLayerModal, setShowAddLayerModal] = useState(false)
  const [showOpenModal, setShowOpenModal] = useState(false)
  const [newLayerConfig, setNewLayerConfig] = useState({
    id: '',
    type: 'line',
    source: '',
    sourceLayer: '',
  })

  useEffect(() => {
    const savedStyle = localStorage.getItem('mapStyleEditor')
    const savedOverrides = localStorage.getItem('mapStyleOverrides')

    if (savedStyle) {
      try {
        const parsed = JSON.parse(savedStyle)
        const apiKey = import.meta.env.VITE_GEBETA_API_KEY

        if (!parsed.version || !parsed.sources || !parsed.layers) {
          console.warn('Invalid saved style, loading default')
          loadDefaultStyle()
          return
        }

        if (apiKey && parsed.sources?.openmaptiles?.tiles) {
          parsed.sources.openmaptiles.tiles =
            parsed.sources.openmaptiles.tiles.map((url) => {
              const cleanUrl = url.split('?')[0]
              return `${cleanUrl}?apiKey=${apiKey}`
            })
          if (parsed.glyphs) {
            const cleanGlyphs = parsed.glyphs.split('?')[0]
            parsed.glyphs = `${cleanGlyphs}?apiKey=${apiKey}`
          }
        }

        setOriginalStyle(parsed)

        if (savedOverrides) {
          setLayerOverrides(JSON.parse(savedOverrides))
        }
      } catch (e) {
        console.error('Failed to load saved style:', e)
        localStorage.removeItem('mapStyleEditor')
        localStorage.removeItem('mapStyleOverrides')
        loadDefaultStyle()
      }
    } else {
      loadDefaultStyle()
    }
  }, [loadDefaultStyle, setOriginalStyle, setLayerOverrides])

  useEffect(() => {
    if (originalStyle) {
      const styleToSave = getCurrentStyle()
      localStorage.setItem('mapStyleEditor', JSON.stringify(styleToSave))
      localStorage.setItem('mapStyleOverrides', JSON.stringify(layerOverrides))

      const styleForDisplay = JSON.parse(JSON.stringify(styleToSave))
      if (styleForDisplay.sources?.openmaptiles?.tiles) {
        styleForDisplay.sources.openmaptiles.tiles =
          styleForDisplay.sources.openmaptiles.tiles.map(
            (url) => url.split('?')[0]
          )
      }
      if (styleForDisplay.glyphs) {
        styleForDisplay.glyphs = styleForDisplay.glyphs.split('?')[0]
      }

      setFullStyleJSON(JSON.stringify(styleForDisplay, null, 2))
    }
  }, [originalStyle, layerOverrides, getCurrentStyle])

  useEffect(() => {
    if (mapRef.current || !mapContainer.current || !originalStyle) return

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: originalStyle,
      center: [38.7469, 9.0054],
      zoom: 12,
    })

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right')
    mapRef.current.addControl(
      new maplibregl.FullscreenControl(),
      'bottom-right'
    )

    mapRef.current.on('error', (e) => {
      console.error('Map error:', e)
    })

    mapRef.current.on('load', () => {
      console.log('Map loaded successfully')
    })

    mapRef.current.on('click', (e) => {
      const features = mapRef.current.queryRenderedFeatures(e.point)
      if (!features.length) return
      const layerId = features[0].layer.id
      setSelectedLayerId(layerId)

      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<strong style="color: #000; background: #fff; padding: 4px;">${layerId}</strong>`
        )
        .addTo(mapRef.current)
    })

    const grouped = originalStyle.layers.reduce((acc, layer) => {
      const group = layer['source-layer'] || 'ungrouped'
      if (!acc[group]) acc[group] = []
      acc[group].push(layer)
      return acc
    }, {})
    setGroupedLayers(grouped)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [originalStyle, setSelectedLayerId])

  useEffect(() => {
    if (!originalStyle || !selectedLayerId) {
      setLayerJSON('')
      return
    }

    const baseLayer = originalStyle.layers.find((l) => l.id === selectedLayerId)
    const override = layerOverrides[selectedLayerId] || {}
    const merged = { ...baseLayer, ...override }
    if (override.paint)
      merged.paint = { ...baseLayer?.paint, ...override.paint }
    if (override.layout)
      merged.layout = { ...baseLayer?.layout, ...override.layout }

    setLayerJSON(JSON.stringify(merged, null, 2))
  }, [selectedLayerId, originalStyle, layerOverrides])

  const applyLayerEdits = useCallback(
    (updatedLayer) => {
      if (!mapRef.current || !selectedLayerId || !originalStyle) return

      const map = mapRef.current
      const baseLayer = originalStyle.layers.find(
        (l) => l.id === selectedLayerId
      )

      if (updatedLayer.paint && baseLayer?.paint) {
        Object.keys(updatedLayer.paint).forEach((prop) => {
          const newValue = updatedLayer.paint[prop]
          const oldValue = baseLayer.paint[prop]
          if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
            map.setPaintProperty(selectedLayerId, prop, newValue)
          }
        })
      }

      if (updatedLayer.layout && baseLayer?.layout) {
        Object.keys(updatedLayer.layout).forEach((prop) => {
          const newValue = updatedLayer.layout[prop]
          const oldValue = baseLayer.layout[prop]
          if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
            map.setLayoutProperty(selectedLayerId, prop, newValue)
          }
        })
      }

      if (
        JSON.stringify(updatedLayer.filter) !==
        JSON.stringify(baseLayer?.filter)
      ) {
        map.setFilter(selectedLayerId, updatedLayer.filter || null)
      }

      if (
        updatedLayer.minzoom !== baseLayer?.minzoom ||
        updatedLayer.maxzoom !== baseLayer?.maxzoom
      ) {
        map.setLayerZoomRange(
          selectedLayerId,
          updatedLayer.minzoom ?? 0,
          updatedLayer.maxzoom ?? 24
        )
      }

      setLayerOverrides((prev) => ({
        ...prev,
        [selectedLayerId]: updatedLayer,
      }))
    },
    [selectedLayerId, originalStyle, setLayerOverrides]
  )

  const handleConfigChange = (field, value) => {
    setNewLayerConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateLayer = () => {
    if (!mapRef.current || !originalStyle) return
    if (!newLayerConfig.id || !newLayerConfig.source) {
      alert('Please fill in Layer ID and Source')
      return
    }

    const newLayer = {
      id: newLayerConfig.id,
      type: newLayerConfig.type,
      source: newLayerConfig.source,
      ...(newLayerConfig.sourceLayer
        ? { 'source-layer': newLayerConfig.sourceLayer }
        : {}),
      paint: {},
      layout: {},
    }

    try {
      mapRef.current.addLayer(newLayer)
      setSelectedLayerId(newLayer.id)
      setLayerOverrides((prev) => ({ ...prev, [newLayer.id]: newLayer }))

      const updatedGrouped = { ...groupedLayers }
      const group = newLayer['source-layer'] || 'ungrouped'
      if (!updatedGrouped[group]) updatedGrouped[group] = []
      updatedGrouped[group].push(newLayer)
      setGroupedLayers(updatedGrouped)

      setShowAddLayerModal(false)
      setNewLayerConfig({ id: '', type: 'line', source: '', sourceLayer: '' })
    } catch (err) {
      console.error('Failed to add layer:', err)
      alert(`Error: ${err.message}`)
    }
  }

  const handleFileOpen = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const style = JSON.parse(e.target.result)
        loadNewStyle(style)
        if (mapRef.current) {
          mapRef.current.setStyle(style)
        }
        setShowOpenModal(false)
      } catch (err) {
        alert('Invalid JSON file: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  const loadPresetStyle = async (preset) => {
    if (preset.style) {
      loadNewStyle(preset.style)
      if (mapRef.current) {
        mapRef.current.setStyle(preset.style)
      }
    } else if (preset.url) {
      try {
        const response = await fetch(preset.url)
        const style = await response.json()
        loadNewStyle(style)
        if (mapRef.current) {
          mapRef.current.setStyle(style)
        }
      } catch (err) {
        alert('Failed to load preset: ' + err.message)
      }
    }
    setShowOpenModal(false)
  }

  const applyFullStyleJSON = () => {
    try {
      const parsed = JSON.parse(fullStyleJSON)
      loadNewStyle(parsed)
      if (mapRef.current) {
        mapRef.current.setStyle(parsed)
      }
      setShowFullEditor(false)
    } catch (err) {
      alert('Invalid JSON: ' + err.message)
    }
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const getMergedLayer = (layerId) => {
    const base = originalStyle?.layers.find((l) => l.id === layerId)
    const override = layerOverrides[layerId]
    if (!base && !override) return null
    if (!base) return override

    const merged = { ...base, ...override }
    if (override?.paint) merged.paint = { ...base.paint, ...override.paint }
    if (override?.layout) merged.layout = { ...base.layout, ...override.layout }
    return merged
  }

  const selectedLayer = selectedLayerId ? getMergedLayer(selectedLayerId) : null

  const vectorSources = useMemo(() => {
    if (!originalStyle) return []
    return Object.entries(originalStyle.sources)
      .filter(([, source]) => source.type === 'vector')
      .map(([name]) => name)
  }, [originalStyle])

  return (
    <Layout>
      <LayoutHeader>
        <div className='flex items-center space-x-4'>
          <button
            onClick={resetToDefault}
            className='rounded-md border px-3 py-1.5 text-sm transition hover:bg-accent'
          >
            Reset
          </button>
          <button
            onClick={() => setShowFullEditor(true)}
            className='rounded-md border px-3 py-1.5 text-sm transition hover:bg-accent'
          >
            Code Editor
          </button>
          <button
            onClick={() => setShowAddLayerModal(true)}
            className='rounded-md border px-3 py-1.5 text-sm transition hover:bg-accent'
          >
            Add Layer
          </button>
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <button
            onClick={() => setShowOpenModal(true)}
            className='rounded-md border px-3 py-1.5 text-sm transition hover:bg-accent'
          >
            Open
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className='rounded-md border px-3 py-1.5 text-sm transition hover:bg-accent'
          >
            Import File
          </button>
          <input
            ref={fileInputRef}
            type='file'
            accept='.json'
            onChange={handleFileOpen}
            className='hidden'
          />
          <button
            onClick={exportStyle}
            className='rounded-md border bg-orange-400 px-3 py-1.5 text-sm transition hover:bg-accent'
          >
            Save
          </button>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='space-y-4'>
        <div className='flex h-[90vh] w-full'>
          {(() => {
            const { layerListPx, layerEditorPx } = getAbsoluteWidths()
            const totalWidth =
              layerListCollapsed && layerEditorCollapsed
                ? 80
                : layerListCollapsed
                  ? layerEditorPx + 40
                  : layerEditorCollapsed
                    ? layerListPx + 40
                    : layerListPx + layerEditorPx

            return (
              <>
                <div
                  className='flex h-full border-r'
                  style={{
                    width: `${totalWidth}px`,
                    transition: 'width 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      width: layerListCollapsed ? '40px' : `${layerListPx}px`,
                    }}
                  >
                    <LayerList
                      groupedLayers={groupedLayers}
                      selectedLayerId={selectedLayerId}
                      onSelectLayer={setSelectedLayerId}
                      isCollapsed={layerListCollapsed}
                      onToggleCollapse={() =>
                        setLayerListCollapsed(!layerListCollapsed)
                      }
                    />
                  </div>

                  <div
                    style={{
                      width: layerEditorCollapsed
                        ? '40px'
                        : `${layerEditorPx}px`,
                    }}
                  >
                    <LayerEditor
                      selectedLayer={selectedLayer}
                      selectedLayerId={selectedLayerId}
                      layerJSON={layerJSON}
                      jsonError={jsonError}
                      expandedSections={expandedSections}
                      onToggleSection={toggleSection}
                      onLayerJSONChange={(json) => {
                        setLayerJSON(json)
                        try {
                          JSON.parse(json)
                          setJsonError('')
                        } catch (err) {
                          setJsonError(err.message)
                        }
                      }}
                      onApplyEdits={applyLayerEdits}
                      isCollapsed={layerEditorCollapsed}
                      onToggleCollapse={() =>
                        setLayerEditorCollapsed(!layerEditorCollapsed)
                      }
                    />
                  </div>
                </div>

                {/* Draggable divider */}
                {!layerListCollapsed && !layerEditorCollapsed && (
                  <div
                    onMouseDown={handleMouseDown}
                    className='w-1 cursor-col-resize bg-border transition-colors hover:bg-primary'
                    style={{ flexShrink: 0 }}
                  />
                )}

                <div
                  className='relative h-full'
                  style={{
                    width: `calc(100% - ${totalWidth}px - ${!layerListCollapsed && !layerEditorCollapsed ? 4 : 0}px)`,
                    transition: 'width 0.3s ease',
                  }}
                >
                  <div ref={mapContainer} className='h-full w-full bg-muted' />
                </div>
              </>
            )
          })()}
        </div>
      </LayoutBody>

      <AddLayerModal
        show={showAddLayerModal}
        config={newLayerConfig}
        vectorSources={vectorSources}
        onClose={() => setShowAddLayerModal(false)}
        onChange={handleConfigChange}
        onCreate={handleCreateLayer}
      />

      <OpenStyleModal
        show={showOpenModal}
        presetStyles={presetStyles}
        fileInputRef={fileInputRef}
        onClose={() => setShowOpenModal(false)}
        onLoadPreset={loadPresetStyle}
      />

      <FullEditorModal
        show={showFullEditor}
        styleJSON={fullStyleJSON}
        onClose={() => setShowFullEditor(false)}
        onChange={setFullStyleJSON}
        onApply={applyFullStyleJSON}
      />
    </Layout>
  )
}
