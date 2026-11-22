<!-- Excel-Chaos wird zu einem schlanken internen Tool. -->
<template>
  <svg viewBox="0 0 320 180" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Unübersichtliche Excel-Liste wird zu einem internen Tool">
    <!-- Kopien der Liste im Hintergrund -->
    <rect x="34" y="22" width="104" height="124" rx="3" opacity=".3" />
    <rect x="27" y="29" width="104" height="124" rx="3" opacity=".5" />
    <!-- Tabelle -->
    <rect x="20" y="36" width="104" height="124" rx="3" fill="var(--color-ink-soft)" />
    <path d="M20 54h104M20 72h104M20 90h104M20 108h104M20 126h104M20 144h104M52 36v124M88 36v124" opacity=".35" />
    <path d="M27 63h18M59 63h22M95 63h14M27 81h14M59 81h10M95 81h22M27 99h20M95 99h8M27 117h16M59 117h24M27 135h12M59 135h16M95 135h18" />
    <!-- widersprüchliche Einträge -->
    <path d="M56 96l28 6M92 114l28 6" opacity=".6" />
    <text x="20" y="174" font-size="9" font-family="ui-monospace, monospace" fill="currentColor" stroke="none" opacity=".6">liste_final_v3.xlsx</text>

    <!-- Pfeil -->
    <path d="M148 98h30M170 90l8 8-8 8" stroke="var(--color-accent)" stroke-width="2" />

    <!-- Internes Tool -->
    <rect x="194" y="36" width="108" height="124" rx="6" fill="var(--color-ink-soft)" />
    <path d="M194 54h108" opacity=".35" />
    <circle cx="204" cy="45" r="2" /><circle cx="211" cy="45" r="2" /><circle cx="218" cy="45" r="2" />
    <g v-for="(y, i) in [70, 92, 114, 136]" :key="y">
      <rect x="206" :y="y - 6" width="12" height="12" rx="2" :stroke="i < 3 ? 'var(--color-accent)' : 'currentColor'" />
      <path v-if="i < 3" :d="`M209 ${y}l2.5 2.5 4.5-5`" stroke="var(--color-accent)" />
      <path :d="`M226 ${y}h${[52, 40, 58, 34][i]}`" />
    </g>
  </svg>
</template>
