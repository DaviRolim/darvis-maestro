<script lang="ts">
  let goals = $state<any[]>([]);
  let copied = $state(false);

  async function loadGoals() {
    const res = await fetch('/api/goals?status=proven');
    goals = await res.json();
  }

  function formatDelta(before: number, after: number) {
    const delta = ((after - before) / before * 100).toFixed(1);
    return +delta > 0 ? `+${delta}%` : `${delta}%`;
  }

  function generateMarkdown() {
    let md = '# Impact Portfolio\n\n';
    md += `Generated: ${new Date().toLocaleDateString()}\n\n---\n\n`;
    
    for (const goal of goals) {
      md += `## ${goal.title}\n`;
      if (goal.description) md += `${goal.description}\n`;
      md += `Tags: ${(goal.tags || []).join(', ')}\n\n`;
      
      if (goal.narrative) {
        md += `${goal.narrative}\n\n`;
      }
      
      md += '---\n\n';
    }
    
    return md;
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(generateMarkdown());
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  $effect(() => { loadGoals(); });
</script>

<div class="p-6 max-w-4xl mx-auto">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-xl font-bold" style="color: var(--text-primary);">📁 Portfolio</h1>
    <button class="btn btn-primary" onclick={copyMarkdown}>
      {copied ? '✓ Copied!' : 'Export Markdown'}
    </button>
  </div>

  {#if goals.length === 0}
    <div class="text-center py-20">
      <p class="text-lg mb-2" style="color: var(--text-muted);">🎼</p>
      <p class="text-sm" style="color: var(--text-muted);">No proven goals yet.</p>
      <p class="text-xs" style="color: var(--text-muted);">Move goals to "Proven" on the board to see them here.</p>
    </div>
  {:else}
    <div class="flex flex-col gap-4">
      {#each goals as goal}
        <a href="/goals/{goal.id}" class="card p-4 block no-underline" style="transition: all 0.15s ease;">
          <div class="flex items-center gap-2 mb-2">
            <span class="status-dot" style="background: var(--status-green); box-shadow: 0 0 6px var(--status-green);"></span>
            <h2 class="text-base font-semibold" style="color: var(--text-primary);">{goal.title}</h2>
          </div>
          
          {#if goal.description}
            <p class="text-sm mb-2" style="color: var(--text-secondary);">{goal.description}</p>
          {/if}

          <div class="flex gap-1 mb-2">
            {#each (goal.tags || []) as tag}
              <span class="chip">{tag}</span>
            {/each}
          </div>

          {#if goal.narrative}
            <p class="text-sm leading-relaxed" style="color: var(--text-secondary); font-style: italic;">{goal.narrative}</p>
          {/if}

          <div class="flex gap-2 mt-2">
            {#each (goal.outcome_tags || []) as tag}
              <span class="text-xs px-2 py-0.5 rounded" style="background: rgba(77,217,115,0.15); color: var(--status-green);">✅ {tag.replace(/_/g, ' ')}</span>
            {/each}
          </div>
        </a>
      {/each}
    </div>
    
    <div class="mt-6 text-center">
      <p class="text-xs" style="color: var(--text-muted);">{goals.length} proven goal{goals.length !== 1 ? 's' : ''}</p>
    </div>
  {/if}
</div>
