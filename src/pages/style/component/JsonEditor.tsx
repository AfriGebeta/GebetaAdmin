import React, { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
}

const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const monacoEditorRef = useRef<any>(null)

  useEffect(() => {
    if (!editorRef.current) return

    // Create editor
    monacoEditorRef.current = monaco.editor.create(editorRef.current, {
      value: value || '{\n  "filter": []\n}',
      language: 'json',
      theme: 'vs-dark', // or 'vs' for light
      minimap: { enabled: false },
      lineNumbers: 'on',
      automaticLayout: true,
      folding: true,
      scrollBeyondLastLine: false,
      wordWrap: 'off',
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
    })

    // Listen for changes
    monacoEditorRef.current.onDidChangeModelContent(() => {
      const newValue = monacoEditorRef.current.getValue()
      onChange(newValue)
    })

    // Optional: set initial value if it changes externally
    if (
      monacoEditorRef.current &&
      value !== monacoEditorRef.current.getValue()
    ) {
      monacoEditorRef.current.setValue(value)
    }
  }, [value])

  return <div ref={editorRef} className='h-[300px] w-full rounded border' />
}

export default JsonEditor
