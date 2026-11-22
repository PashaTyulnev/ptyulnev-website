<!-- Ladezeit vorher/nachher (Zahlen aus der Fallstudie Praxis-Software). -->
<template>
  <svg viewBox="0 0 320 120" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Ladezeit von 6 Minuten auf 2 Sekunden gesenkt">
    <!-- Stoppuhr -->
    <circle cx="36" cy="64" r="22" fill="var(--color-ink-soft)" />
    <path d="M32 38h8M36 38v4M36 64l9-9" />
    <path d="M54 44l4-4" />

    <g font-size="10" font-family="ui-monospace, monospace" stroke="none" fill="currentColor">
      <text x="76" y="40" opacity=".6">vorher</text>
      <text x="300" y="58" text-anchor="end">6 min</text>
      <text x="76" y="84" opacity=".6">nachher</text>
      <text x="104" y="102" fill="var(--color-accent)">2 s</text>
    </g>

    <rect x="76" y="46" width="186" height="16" rx="3" fill="currentColor" opacity=".15" stroke="none" />
    <rect x="76" y="46" width="186" height="16" rx="3" opacity=".5" />
    <rect x="76" y="90" width="22" height="16" rx="3" fill="var(--color-accent)" stroke="none" />
  </svg>
</template>
