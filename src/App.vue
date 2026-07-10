<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { marked } from 'marked'
import AppHeader from './components/AppHeader.vue'
import NoteEditor from './components/NoteEditor.vue'
import NotePreview from './components/NotePreview.vue'
import ExportBar from './components/ExportBar.vue'

const STORAGE_KEY = 'marknote-content'

const content = ref('')
const isPreviewActive = ref(false)

const defaultContent = `# Benvenuto in MarkNote

Scrivi le tue idee in **Markdown** — MarkNote le trasforma in anteprima mentre scrivi.

## Cosa puoi fare

- Applica il **grassetto** e il *corsivo* con un gesto
- Inserisci [link](https://esempio.com) con un clic
- Organizza il testo in liste puntate e numerate
- Separa le sezioni con una riga orizzontale

## Per iniziare

1. Scrivi in questo pannello usando la sintassi Markdown
2. Guarda l'anteprima prendere forma a destra
3. Esporta la nota finita in HTML o testo semplice

> La scrittura è il respiro delle idee.
> — *Anonimo*

---

Pronto a scrivere la tua prossima nota?`

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved !== null) {
    content.value = saved
  } else {
    content.value = defaultContent
  }
})

watch(content, (val) => {
  localStorage.setItem(STORAGE_KEY, val)
})

const renderedHtml = computed(() => {
  if (!content.value.trim()) return '<p class="preview-empty">Scrivi qualcosa nel pannello di sinistra per vedere l&rsquo;anteprima.</p>'
  return marked.parse(content.value, { breaks: true, gfm: true })
})

const wordCount = computed(() => {
  const text = content.value.trim()
  if (!text) return 0
  return text.split(/\s+/).filter(w => w.length > 0).length
})

const charCount = computed(() => content.value.length)

function exportHtml() {
  const styles = `
    body { max-width: 720px; margin: 2rem auto; padding: 0 1.5rem; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 1.8; color: #1A1714; background: #FFFBEB; }
    h1, h2, h3, h4, h5, h6 { font-family: Georgia, serif; color: #1A1714; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.3; }
    h1 { font-size: 2rem; border-bottom: 2px solid #C41E3A; padding-bottom: 0.3em; }
    h2 { font-size: 1.5rem; }
    a { color: #C41E3A; text-decoration: underline; }
    code { background: #F0EDE8; padding: 2px 6px; border-radius: 4px; font-family: 'SF Mono', Consolas, monospace; font-size: 0.9em; }
    pre { background: #F0EDE8; padding: 1rem; border-radius: 6px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 3px solid #C41E3A; margin: 1.5rem 0; padding: 0.5rem 1rem; color: #5C5552; font-style: italic; }
    hr { border: none; border-top: 1px solid #E8E0D5; margin: 2rem 0; }
    ul, ol { padding-left: 1.5rem; margin: 1rem 0; }
    li { margin: 0.25rem 0; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #E8E0D5; padding: 0.5rem 1rem; text-align: left; }
    th { background: #F0EDE8; font-weight: 600; }
    img { max-width: 100%; height: auto; }
    p { margin: 0.75rem 0; }
    strong { color: #1A1714; }
  `.replace(/\s{2,}/g, ' ').trim()

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nota — MarkNote</title>
  <style>${styles}</style>
</head>
<body>
${renderedHtml.value}
</body>
</html>`

  downloadFile(html, 'nota-marknote.html', 'text/html')
}

function exportTxt() {
  const div = document.createElement('div')
  div.innerHTML = renderedHtml.value
  const text = div.textContent || div.innerText || ''
  downloadFile(text, 'nota-marknote.txt', 'text/plain;charset=utf-8')
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="app" :class="{ 'preview-active': isPreviewActive }">
    <AppHeader
      :wordCount="wordCount"
      :charCount="charCount"
      :isEmpty="!content.trim()"
    />

    <nav class="mobile-tabs" aria-label="Modalità visualizzazione">
      <button
        class="tab-btn"
        :class="{ active: !isPreviewActive }"
        @click="isPreviewActive = false"
        aria-pressed="true"
        :aria-label="isPreviewActive ? 'Passa alla modalità scrittura' : 'Sei in modalità scrittura'"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        Scrivi
      </button>
      <button
        class="tab-btn"
        :class="{ active: isPreviewActive }"
        @click="isPreviewActive = true"
        :aria-label="!isPreviewActive ? 'Passa alla modalità anteprima' : 'Sei in modalità anteprima'"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Anteprima
      </button>
    </nav>

    <main class="main-content">
      <NoteEditor v-model="content" v-show="!isPreviewActive" />
      <NotePreview :html="renderedHtml" v-show="isPreviewActive" />
    </main>

    <ExportBar @export-html="exportHtml" @export-txt="exportTxt" />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.mobile-tabs {
  display: none;
  background: var(--color-card);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-1) var(--space-3);
  gap: var(--space-1);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast), color var(--transition-fast);
  min-height: 44px;
}

.tab-btn:hover {
  background: var(--color-border);
  color: var(--color-text);
}

.tab-btn.active {
  background: var(--color-accent);
  color: #FFF;
}

.tab-btn svg {
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

@media (max-width: 768px) {
  .mobile-tabs {
    display: flex;
  }

  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>
