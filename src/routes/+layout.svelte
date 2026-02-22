<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen">
  <header class="flex items-center justify-between px-6 py-3" style="background: var(--header-bg); border-bottom: 1px solid var(--card-border);">
    <div class="flex items-center gap-3">
      <span class="text-xl">🎼</span>
      <a href="/" class="text-base font-bold" style="color: var(--text-primary); text-decoration: none;">Darvis Maestro</a>
    </div>
    <nav class="flex items-center gap-4">
      <a href="/" class="text-sm font-medium" style="color: var(--text-secondary); text-decoration: none;">Goals</a>
      <a href="/portfolio" class="text-sm font-medium" style="color: var(--text-secondary); text-decoration: none;">Portfolio</a>
    </nav>
  </header>
  {@render children()}
</div>
