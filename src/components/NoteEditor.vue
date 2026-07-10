<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const textareaRef = ref(null)

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

// Toolbar actions — insert markdown syntax at cursor
function insertSyntax(before, after = '') {
  const ta = textareaRef.value
  if (!ta) return

  const start = ta.selectionStart
  const end = ta.selectionEnd
  const selected = props.modelValue.substring(start, end)
  const replacement = before + selected + after

  const newValue = props.modelValue.substring(0, start) + replacement + props.modelValue.substring(end)
  emit('update:modelValue', newValue)

  nextTick(() => {
    ta.focus()
    const cursor = selected
      ? start + replacement.length
      : start + before.length
    ta.setSelectionRange(cursor, cursor)
  })
}

function insertBold() { insertSyntax('**', '**') }
function insertItalic() { insertSyntax('*', '*') }
function insertHeading() { insertSyntax('## ') }
function insertLink() {
  const ta = textareaRef.value
  if (!ta) return

  const start = ta.selectionStart
  const end = ta.selectionEnd
  const selected = props.modelValue.substring(start, end)
  const text = selected || 'testo link'
  const replacement = `[${text}](url)`

  const newValue = props.modelValue.substring(0, start) + replacement + props.modelValue.substring(end)
  emit('update:modelValue', newValue)

  nextTick(() => {
    ta.focus()
    if (!selected) {
      // Select "texto link" for quick replacement
      ta.setSelectionRange(start + 1, start + 1 + text.length)
    } else {
      ta.setSelectionRange(start + replacement.length - 4, start + replacement.length - 1)
    }
  })
}
function insertList() { insertSyntax('- ') }
function insertQuote() { insertSyntax('> ') }
function insertHr() { insertSyntax('\n---\n') }

// Keyboard shortcuts
function onKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
    e.preventDefault()
    insertBold()
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
    e.preventDefault()
    insertItalic()
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    insertLink()
  }
}
</script>

<template>
  <div class="editor-panel">
    <div class="toolbar" role="toolbar" aria-label="Strumenti di formattazione">
      <button
        class="tool-btn"
        @click="insertHeading"
        title="Titolo (H2)"
        aria-label="Inserisci titolo"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h12"/><path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 4h12"/><path d="M6 12v-4h12v4"/></svg>
      </button>
      <button class="tool-btn" @click="insertBold" title="Grassetto (Ctrl+B)" aria-label="Grassetto" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
      </button>
      <button class="tool-btn" @click="insertItalic" title="Corsivo (Ctrl+I)" aria-label="Corsivo" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
      </button>
      <span class="tool-sep" aria-hidden="true"></span>
      <button class="tool-btn" @click="insertLink" title="Link (Ctrl+K)" aria-label="Inserisci link" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      </button>
      <button class="tool-btn" @click="insertList" title="Lista puntata" aria-label="Inserisci lista" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      </button>
      <button class="tool-btn" @click="insertQuote" title="Citazione" aria-label="Inserisci citazione" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
      </button>
      <button class="tool-btn" @click="insertHr" title="Linea orizzontale" aria-label="Inserisci separatore" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/></svg>
      </button>
    </div>

    <label class="sr-only" for="markdown-editor">Scrivi la tua nota in Markdown</label>
    <textarea
      id="markdown-editor"
      ref="textareaRef"
      class="editor-textarea"
      :value="modelValue"
      @input="onInput"
      @keydown="onKeydown"
      placeholder="Scrivi qui la tua nota in Markdown..."
      spellcheck="true"
      autofocus
    ></textarea>
  </div>
</template>

<style scoped>
.editor-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-card);
  border-right: 1px solid var(--color-border);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: var(--color-card);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  overflow-x: auto;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
  flex-shrink: 0;
}

.tool-btn:hover {
  background: var(--color-border);
  color: var(--color-text);
}

.tool-btn:active {
  background: var(--color-border-strong);
}

.tool-sep {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 var(--space-1);
  flex-shrink: 0;
}

.editor-textarea {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.75;
  color: var(--color-text);
  background: var(--color-card);
  tab-size: 2;
}

.editor-textarea::placeholder {
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-style: italic;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .editor-panel {
    border-right: none;
  }
}
</style>
