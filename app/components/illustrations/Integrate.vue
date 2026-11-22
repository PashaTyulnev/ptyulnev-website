<!-- Daten aus mehreren Quellen laufen in einer Auswertung zusammen. -->
<template>
  <svg viewBox="0 0 320 180" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Daten aus mehreren Quellen werden zusammengeführt und ausgewertet">
    <!-- Quellen -->
    <g fill="var(--color-ink-soft)">
      <rect x="18" y="22" width="70" height="34" rx="4" />
      <rect x="18" y="73" width="70" height="34" rx="4" />
      <rect x="18" y="124" width="70" height="34" rx="4" />
    </g>
    <g font-size="8.5" font-family="ui-monospace, monospace" fill="currentColor" stroke="none" opacity=".7">
      <text x="28" y="43">CSV</text>
      <text x="28" y="94">API</text>
      <text x="28" y="145">Terminal</text>
    </g>

    <!-- Zusammenführung -->
    <path d="M88 39c30 0 30 51 58 51M88 90h58M88 141c30 0 30-51 58-51" opacity=".6" />
    <circle cx="150" cy="90" r="5" fill="var(--color-accent)" stroke="none" />
    <path d="M155 90h27M174 82l8 8-8 8" stroke="var(--color-accent)" stroke-width="2" />

    <!-- Auswertung -->
    <rect x="196" y="28" width="106" height="124" rx="6" fill="var(--color-ink-soft)" />
    <path d="M196 46h106" opacity=".35" />
    <path d="M206 37h40" opacity=".6" />
    <path d="M208 136h84" opacity=".35" />
    <g fill="var(--color-accent)" stroke="none">
      <rect x="214" y="104" width="12" height="32" rx="1.5" opacity=".45" />
      <rect x="234" y="86" width="12" height="50" rx="1.5" opacity=".65" />
      <rect x="254" y="94" width="12" height="42" rx="1.5" opacity=".8" />
      <rect x="274" y="66" width="12" height="70" rx="1.5" />
    </g>
    <path d="M208 58h30M208 66h20" opacity=".6" />
  </svg>
</template>
