<!-- Shop mit eigenen Plugins, aktuell gehalten. -->
<template>
  <svg viewBox="0 0 320 180" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Onlineshop mit angeschlossenen Plugins und aktueller Version">
    <!-- Shop im Browser -->
    <rect x="18" y="20" width="186" height="140" rx="6" fill="var(--color-ink-soft)" />
    <path d="M18 38h186" opacity=".35" />
    <circle cx="28" cy="29" r="2" /><circle cx="35" cy="29" r="2" /><circle cx="42" cy="29" r="2" />
    <rect x="54" y="25" width="90" height="8" rx="4" opacity=".35" />
    <g v-for="(x, i) in [30, 88, 146]" :key="x">
      <rect :x="x" y="50" width="46" height="40" rx="3" opacity=".5" />
      <path :d="`M${x + 10} 80l9-11 7 7 6-5 9 9`" opacity=".5" />
      <path :d="`M${x} 100h${[34, 28, 38][i]}M${x} 110h20`" />
      <rect :x="x" y="120" width="30" height="10" rx="2" :stroke="i === 1 ? 'var(--color-accent)' : 'currentColor'" />
    </g>

    <!-- Plugins -->
    <g v-for="(y, i) in [34, 78, 122]" :key="y">
      <path :d="`M204 ${y + 12}h18`" :stroke="i === 1 ? 'var(--color-accent)' : 'currentColor'" />
      <path
        :d="`M222 ${y}h22a5 5 0 0 1 10 0h22v24h-54z`"
        fill="var(--color-ink-soft)"
        :stroke="i === 1 ? 'var(--color-accent)' : 'currentColor'"
      />
      <path :d="`M230 ${y + 12}h${[28, 34, 22][i]}`" opacity=".6" />
    </g>

    <!-- Version -->
    <rect x="222" y="158" width="76" height="16" rx="8" stroke="var(--color-accent)" />
    <text x="260" y="169.5" text-anchor="middle" font-size="9" font-family="ui-monospace, monospace" fill="var(--color-accent)" stroke="none">6.6 ✓ aktuell</text>
  </svg>
</template>
