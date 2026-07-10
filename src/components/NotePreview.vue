<script setup>
defineProps({
  html: { type: String, default: '' }
})
</script>

<template>
  <div class="preview-panel">
    <div class="preview-header">
      <span class="preview-label">Anteprima</span>
    </div>
    <div
      class="preview-content markdown-body"
      v-html="html"
    ></div>
  </div>
</template>

<style scoped>
.preview-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface);
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  background: var(--color-surface);
}

.preview-label {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
}

/* ===== Markdown Body Styles ===== */
.markdown-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text);
  word-wrap: break-word;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  font-family: var(--font-display);
  color: var(--color-text);
  line-height: 1.35;
  margin-top: 1.6em;
  margin-bottom: 0.5em;
}

.markdown-body :deep(h1) {
  font-size: 1.75rem;
  font-weight: 600;
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 0.3em;
}

.markdown-body :deep(h2) {
  font-size: 1.375rem;
  font-weight: 600;
}

.markdown-body :deep(h3) {
  font-size: 1.15rem;
  font-weight: 600;
}

.markdown-body :deep(p) {
  margin: 0.6em 0;
}

.markdown-body :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-body :deep(a:hover) {
  color: var(--color-accent-hover);
}

.markdown-body :deep(strong) {
  font-weight: 600;
  color: var(--color-text);
}

.markdown-body :deep(em) {
  font-style: italic;
}

.markdown-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
  background: var(--color-border);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  color: var(--color-accent);
}

.markdown-body :deep(pre) {
  background: #F5F2ED;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  overflow-x: auto;
  margin: 0.75em 0;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--color-text);
  font-size: var(--text-sm);
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  margin: 0.75em 0;
  padding: var(--space-2) var(--space-4);
  color: var(--color-text-secondary);
  background: rgba(196, 30, 58, 0.04);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.markdown-body :deep(blockquote p) {
  margin: 0.3em 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.markdown-body :deep(li) {
  margin: 0.2em 0;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border-strong);
  margin: 1.5em 0;
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.75em 0;
  font-size: var(--text-sm);
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--color-border);
  padding: var(--space-2) var(--space-3);
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--color-border);
  font-weight: 600;
}

.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
}

.markdown-body :deep(.preview-empty) {
  color: var(--color-text-muted);
  font-style: italic;
  text-align: center;
  padding: var(--space-10) var(--space-4);
}
</style>
