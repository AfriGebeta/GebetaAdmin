//@ts-nocheck
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import basic from './basic.json'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

// --- Input Components ---
const NumberInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) => (
  <div className='mb-2 flex items-center gap-2'>
    <label className='w-24 text-xs text-gray-400'>{label}</label>
    <input
      type='number'
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className='w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500'
    />
  </div>
)

const ColorInput = ({ label, value, onChange }) => {
  let hexValue = '#000000'
  try {
    if (
      typeof value === 'string' &&
      value.startsWith('#') &&
      value.length === 7
    ) {
      hexValue = value
    }
  } catch {}
  return (
    <div className='mb-2 flex items-center gap-2'>
      <label className='w-24 text-xs text-gray-400'>{label}</label>
      <input
        type='color'
        value={hexValue}
        onChange={(e) => onChange(e.target.value)}
        className='h-8 w-8 cursor-pointer rounded border border-gray-600'
      />
      <input
        type='text'
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className='flex-1 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500'
        placeholder='#RRGGBB or rgba(...)'
      />
    </div>
  )
}

export default function Style() {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)

  const [layerJSON, setLayerJSON] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [groupedLayers, setGroupedLayers] = useState(null)
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const [originalStyle, setOriginalStyle] = useState(null)
  const [layerOverrides, setLayerOverrides] = useState({})

  const [expandedSections, setExpandedSections] = useState({
    paint: true,
    json: false,
  })

  // Modal state
  const [showAddLayerModal, setShowAddLayerModal] = useState(false)
  const [newLayerConfig, setNewLayerConfig] = useState({
    id: '',
    type: 'line',
    source: '',
    sourceLayer: '',
  })

  // Load style
  useEffect(() => {
    setOriginalStyle(basic)
  }, [])

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainer.current || !originalStyle) return

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: originalStyle,
      center: [38.7469, 9.0054],
      zoom: 12,
    })

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right')

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
  }, [originalStyle])

  // Update layerJSON
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

  // Apply edits via MapLibre setters
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
    [selectedLayerId, originalStyle]
  )

  // Handle modal input change
  const handleConfigChange = (field, value) => {
    setNewLayerConfig((prev) => ({ ...prev, [field]: value }))
  }

  // Create new layer from modal
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
      // Start with empty paint/layout
      paint: {},
      layout: {},
    }

    try {
      mapRef.current.addLayer(newLayer)
      setSelectedLayerId(newLayer.id)
      setLayerOverrides((prev) => ({ ...prev, [newLayer.id]: newLayer }))

      // Update grouped layers
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

  const exportStyle = useCallback(() => {
    if (!originalStyle) return

    const exportedLayers = originalStyle.layers.map((layer) => {
      const override = layerOverrides[layer.id]
      if (!override) return layer
      const merged = { ...layer, ...override }
      if (override.paint) merged.paint = { ...layer.paint, ...override.paint }
      if (override.layout)
        merged.layout = { ...layer.layout, ...override.layout }
      return merged
    })

    const newLayers = Object.values(layerOverrides).filter(
      (layer) => !originalStyle.layers.some((l) => l.id === layer.id)
    )

    const fullStyle = {
      ...originalStyle,
      layers: [...exportedLayers, ...newLayers],
    }

    const blob = new Blob([JSON.stringify(fullStyle, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'edited-style.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [originalStyle, layerOverrides])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const renderIcon = (type) => {
    switch (type) {
      case 'fill':
        return <div className='h-3 w-3 rounded-sm bg-blue-500'></div>
      case 'line':
        return <div className='h-0.5 w-4 bg-green-500'></div>
      case 'symbol':
        return (
          <div className='h-3 w-3 rounded-full border border-yellow-500'></div>
        )
      case 'circle':
        return <div className='h-3 w-3 rounded-full bg-purple-500'></div>
      default:
        return <div className='h-3 w-3 rounded-sm bg-gray-500'></div>
    }
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

  const allLayers = useMemo(() => {
    const layers = [...(originalStyle?.layers || [])]
    const newLayers = Object.values(layerOverrides).filter(
      (layer) => !originalStyle?.layers.some((l) => l.id === layer.id)
    )
    return [...layers, ...newLayers]
  }, [originalStyle, layerOverrides])

  useEffect(() => {
    if (!originalStyle) return
    const grouped = allLayers.reduce((acc, layer) => {
      const group = layer['source-layer'] || 'ungrouped'
      if (!acc[group]) acc[group] = []
      acc[group].push(layer)
      return acc
    }, {})
    setGroupedLayers(grouped)
  }, [allLayers, originalStyle])

  // Get vector sources for dropdown
  const vectorSources = useMemo(() => {
    if (!originalStyle) return []
    return Object.entries(originalStyle.sources)
      .filter(([, source]) => source.type === 'vector')
      .map(([name]) => name)
  }, [originalStyle])

  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <button
            onClick={() => setShowAddLayerModal(true)}
            className='rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700'
          >
            + Add Layer
          </button>
          <button
            onClick={exportStyle}
            className='rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white transition hover:bg-emerald-700'
          >
            Export Style
          </button>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='space-y-4'>
        <div className='flex h-[90vh] w-full bg-gray-900 text-white'>
          <div className='flex h-full w-[40%] border-r border-gray-700'>
            <div className='h-full w-[50%] overflow-y-auto bg-gray-800 p-3'>
              <h2 className='mb-3 text-lg font-semibold'>Layers</h2>
              {groupedLayers ? (
                Object.entries(groupedLayers).map(([group, layers]) => (
                  <div key={group} className='mb-4'>
                    <div className='px-2 py-1 text-xs font-bold uppercase tracking-wide text-gray-400'>
                      {group}
                    </div>
                    {layers.map((layer) => (
                      <div
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors ${
                          selectedLayerId === layer.id
                            ? 'border-l-4 border-blue-500 bg-blue-900'
                            : 'hover:bg-gray-700'
                        }`}
                      >
                        {renderIcon(layer.type)}
                        <span className='ml-2 truncate text-sm'>
                          {layer.id}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className='text-sm text-gray-500'>Loading...</div>
              )}
            </div>

            <div className='flex h-full w-[50%] flex-col bg-gray-800'>
              {selectedLayerId && selectedLayer ? (
                <>
                  <div className='border-b border-gray-700 p-3'>
                    <h3 className='text-lg font-medium'>
                      Layer:{' '}
                      <span className='text-blue-400'>{selectedLayerId}</span>
                    </h3>
                  </div>
                  <div className='flex-1 space-y-3 overflow-y-auto p-3'>
                    {selectedLayer.type === 'line' && (
                      <div className='rounded-md border border-gray-700'>
                        <button
                          onClick={() => toggleSection('paint')}
                          className='flex w-full items-center justify-between bg-gray-700 px-3 py-2 hover:bg-gray-600'
                        >
                          <span>Paint properties</span>
                          <svg
                            className={`h-4 w-4 transition-transform ${expandedSections.paint ? 'rotate-180' : ''}`}
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 9l-7 7-7-7'
                            />
                          </svg>
                        </button>
                        {expandedSections.paint && (
                          <div className='space-y-3 bg-gray-800 p-3 text-xs'>
                            <NumberInput
                              label='Opacity'
                              value={selectedLayer.paint?.['line-opacity'] || 1}
                              onChange={(val) => {
                                const updated = {
                                  ...selectedLayer,
                                  paint: {
                                    ...selectedLayer.paint,
                                    'line-opacity': val,
                                  },
                                }
                                setLayerJSON(JSON.stringify(updated, null, 2))
                                applyLayerEdits(updated)
                              }}
                              min={0}
                              max={1}
                              step={0.01}
                            />
                            <ColorInput
                              label='Color'
                              value={
                                selectedLayer.paint?.['line-color'] || '#41515c'
                              }
                              onChange={(val) => {
                                const updated = {
                                  ...selectedLayer,
                                  paint: {
                                    ...selectedLayer.paint,
                                    'line-color': val,
                                  },
                                }
                                setLayerJSON(JSON.stringify(updated, null, 2))
                                applyLayerEdits(updated)
                              }}
                            />
                            <NumberInput
                              label='Width'
                              value={selectedLayer.paint?.['line-width'] || 1}
                              onChange={(val) => {
                                const updated = {
                                  ...selectedLayer,
                                  paint: {
                                    ...selectedLayer.paint,
                                    'line-width': val,
                                  },
                                }
                                setLayerJSON(JSON.stringify(updated, null, 2))
                                applyLayerEdits(updated)
                              }}
                              min={0}
                              max={20}
                              step={0.1}
                            />
                            <div className='mt-3 border-t border-gray-700 pt-2'>
                              <button
                                onClick={() => toggleSection('json')}
                                className='text-xs text-blue-400 hover:underline'
                              >
                                ➤ Edit full JSON
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className='rounded-md border border-gray-700'>
                      <button
                        onClick={() => toggleSection('json')}
                        className='flex w-full items-center justify-between bg-gray-700 px-3 py-2 hover:bg-gray-600'
                      >
                        <span>JSON Editor</span>
                        <svg
                          className={`h-4 w-4 transition-transform ${expandedSections.json ? 'rotate-180' : ''}`}
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 9l-7 7-7-7'
                          />
                        </svg>
                      </button>
                      {expandedSections.json && (
                        <div className='bg-gray-800 p-3'>
                          <textarea
                            className='resize-vertical h-40 w-full rounded-md border border-gray-600 bg-black p-2 font-mono text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={layerJSON}
                            onChange={(e) => {
                              const newValue = e.target.value
                              setLayerJSON(newValue)
                              try {
                                const parsed = JSON.parse(newValue)
                                setJsonError('')
                                applyLayerEdits(parsed)
                              } catch (err) {
                                setJsonError(err.message)
                              }
                            }}
                            spellCheck={false}
                            placeholder='Edit layer JSON here...'
                          />
                          {jsonError && (
                            <div className='mt-1 text-xs text-red-400'>
                              ❌ {jsonError}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className='flex flex-1 items-center justify-center text-gray-500'>
                  Select a layer to edit
                </div>
              )}
            </div>
          </div>

          <div className='relative h-full w-[60%]'>
            <div ref={mapContainer} className='h-full w-full bg-gray-950' />
          </div>
        </div>
      </LayoutBody>

      {/* Add Layer Modal */}
      {showAddLayerModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
          <div className='w-96 rounded-lg bg-gray-800 p-6 text-white'>
            <h3 className='mb-4 text-lg font-semibold'>Add New Layer</h3>

            <div className='space-y-3'>
              <div>
                <label className='mb-1 block text-xs text-gray-400'>
                  Layer ID
                </label>
                <input
                  type='text'
                  value={newLayerConfig.id}
                  onChange={(e) => handleConfigChange('id', e.target.value)}
                  className='w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white'
                  placeholder='e.g. my-new-layer'
                />
              </div>

              <div>
                <label className='mb-1 block text-xs text-gray-400'>Type</label>
                <select
                  value={newLayerConfig.type}
                  onChange={(e) => handleConfigChange('type', e.target.value)}
                  className='w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white'
                >
                  <option value='fill'>Fill</option>
                  <option value='line'>Line</option>
                  <option value='circle'>Circle</option>
                  <option value='symbol'>Symbol</option>
                  <option value='background'>Background</option>
                </select>
              </div>

              <div>
                <label className='mb-1 block text-xs text-gray-400'>
                  Source
                </label>
                <select
                  value={newLayerConfig.source}
                  onChange={(e) => handleConfigChange('source', e.target.value)}
                  className='w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white'
                >
                  <option value=''>-- Select Source --</option>
                  {vectorSources.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='mb-1 block text-xs text-gray-400'>
                  Source Layer (optional)
                </label>
                <input
                  type='text'
                  value={newLayerConfig.sourceLayer}
                  onChange={(e) =>
                    handleConfigChange('sourceLayer', e.target.value)
                  }
                  className='w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white'
                  placeholder='e.g. transportation'
                />
              </div>
            </div>

            <div className='mt-6 flex justify-end space-x-2'>
              <button
                onClick={() => setShowAddLayerModal(false)}
                className='rounded bg-gray-600 px-3 py-1.5 text-sm hover:bg-gray-700'
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLayer}
                className='rounded bg-blue-600 px-3 py-1.5 text-sm hover:bg-blue-700'
              >
                Create Layer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
