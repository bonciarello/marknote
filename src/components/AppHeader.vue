<script setup>
defineProps({
  wordCount: { type: Number, default: 0 },
  charCount: { type: Number, default: 0 },
  isEmpty: { type: Boolean, default: true }
})
</script>

<template>
  <header class="app-header">
    <div class="ribbon" aria-hidden="true"></div>
    <div class="header-content">
      <div class="header-text">
        <h1 class="app-title">MarkNote</h1>
        <p class="app-subtitle">Scrivi in Markdown, vedi l&rsquo;anteprima in tempo reale</p>
      </div>
      <div class="header-stats" aria-live="polite" :aria-label="`${wordCount} parole, ${charCount} caratteri`">
        <span class="stat" title="Parole">{{ wordCount }} parole</span>
        <span class="stat-divider" aria-hidden="true">·</span>
        <span class="stat" title="Caratteri">{{ charCount }} caratteri</span>
      </div>
      <div
        class="saved-badge"
        :class="{ visible: !isEmpty }"
        role="status"
        aria-label="Nota salvata automaticamente"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        Salvato
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: relative;
  background: var(--color-card);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-3) var(--space-4);
  overflow: hidden;
}

/* Signature element — bookmark ribbon */
.ribbon {
  position: absolute;
  top: -6px;
  left: -6px;
  width: 36px;
  height: 64px;
  background: var(--color-accent);
  clip-path: polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%);
  filter: drop-shadow(0 2px 3px rgba(196, 30, 58, 0.35));
  z-index: 1;
}

.ribbon::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  padding-left: var(--space-8);
}

.header-text {
  min-width: 0;
}

.app-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.app-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
  line-height: 1.4;
}

.header-stats {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.stat-divider {
  color: var(--color-border-strong);
}

.saved-badge {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-success);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity var(--transition-base), transform var(--transition-base);
  white-space: nowrap;
}

.saved-badge.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .app-header {
    padding: var(--space-2) var(--space-3);
  }

  .header-content {
    padding-left: var(--space-7);
    gap: var(--space-3);
  }

  .app-title {
    font-size: var(--text-lg);
  }

  .app-subtitle {
    font-size: var(--text-xs);
  }

  .header-stats {
    font-size: var(--text-xs);
  }

  .ribbon {
    width: 28px;
    height: 50px;
  }
}
</style>
