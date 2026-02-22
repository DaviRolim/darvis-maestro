<script lang="ts">
  let goals = $state<any[]>([]);
  let showModal = $state(false);
  let newTitle = $state('');
  let newDescription = $state('');
  let newTags = $state('');
  let draggedId = $state<string | null>(null);

  const columns = ['planning', 'executing', 'measuring', 'proven'] as const;
  const columnLabels: Record<string, string> = {
    planning: 'Planning', executing: 'Executing', measuring: 'Measuring', proven: 'Proven'
  };
  const columnColors: Record<string, string> = {
    planning: 'var(--neon-purple)', executing: 'var(--neon-cyan)', measuring: 'var(--status-amber)', proven: 'var(--status-green)'
  };

  async function loadGoals() {
    const res = await fetch('/api/goals');
    goals = await res.json();
  }

  function goalsByStatus(status: string) {
    return goals.filter(g => g.status === status);
  }

  async function createGoal() {
    if (!newTitle.trim()) return;
    await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      })
    });
    newTitle = ''; newDescription = ''; newTags = '';
    showModal = false;
    loadGoals();
  }

  function handleDragStart(id: string) {
    draggedId = id;
  }

  async function handleDrop(status: string) {
    if (!draggedId) return;
    await fetch(`/api/goals/${draggedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    draggedId = null;
    loadGoals();
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  $effect(() => { loadGoals(); });
</script>

<div class="p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-xl font-bold" style="color: var(--text-primary);">Goals Board</h1>
    <button class="btn btn-primary" onclick={() => showModal = true}>+ New Goal</button>
  </div>

  <div class="grid grid-cols-4 gap-4" style="min-height: 70vh;">
    {#each columns as status}
      <div
        class="rounded-lg p-3"
        style="background: rgba(26,26,31,0.5); border: 1px solid var(--card-border);"
        ondragover={handleDragOver}
        ondrop={() => handleDrop(status)}
      >
        <div class="flex items-center gap-2 mb-3">
          <span class="status-dot" style="background: {columnColors[status]}; box-shadow: 0 0 6px {columnColors[status]};"></span>
          <span class="text-xs font-bold tracking-widest" style="color: var(--text-muted);">{columnLabels[status]}</span>
          <span class="text-xs font-bold mono px-1.5 py-0.5 rounded" style="background: rgba(173,77,255,0.15); color: {columnColors[status]};">{goalsByStatus(status).length}</span>
        </div>

        <div class="flex flex-col gap-2">
          {#each goalsByStatus(status) as goal (goal.id)}
            <a
              href="/goals/{goal.id}"
              class="card p-3 block no-underline cursor-grab active:cursor-grabbing"
              draggable="true"
              ondragstart={() => handleDragStart(goal.id)}
            >
              <div class="text-sm font-semibold mb-1" style="color: var(--text-primary);">{goal.title}</div>
              {#if goal.description}
                <div class="text-xs mb-2" style="color: var(--text-secondary);">{goal.description}</div>
              {/if}
              <div class="flex flex-wrap gap-1">
                {#each (goal.tags || []) as tag}
                  <span class="chip">{tag}</span>
                {/each}
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- New Goal Modal -->
{#if showModal}
  <div class="fixed inset-0 flex items-center justify-center z-50" style="background: rgba(0,0,0,0.7);" onclick={() => showModal = false}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="card p-6 w-full max-w-md" onclick={(e) => e.stopPropagation()}>
      <h2 class="text-lg font-bold mb-4" style="color: var(--text-primary);">New Goal</h2>
      
      <div class="mb-3">
        <label class="block text-xs font-medium mb-1" style="color: var(--text-secondary);">Title *</label>
        <input
          bind:value={newTitle}
          class="w-full px-3 py-2 rounded text-sm"
          style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);"
          placeholder="e.g. Reduce frame drops for Troy"
          onkeydown={(e) => e.key === 'Enter' && createGoal()}
        />
      </div>
      
      <div class="mb-3">
        <label class="block text-xs font-medium mb-1" style="color: var(--text-secondary);">Description</label>
        <input
          bind:value={newDescription}
          class="w-full px-3 py-2 rounded text-sm"
          style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);"
          placeholder="Optional one-liner"
        />
      </div>
      
      <div class="mb-4">
        <label class="block text-xs font-medium mb-1" style="color: var(--text-secondary);">Tags (comma-separated)</label>
        <input
          bind:value={newTags}
          class="w-full px-3 py-2 rounded text-sm"
          style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);"
          placeholder="e.g. nubank, troy, performance"
        />
      </div>
      
      <div class="flex gap-2 justify-end">
        <button class="btn btn-ghost" onclick={() => showModal = false}>Cancel</button>
        <button class="btn btn-primary" onclick={createGoal}>Create Goal</button>
      </div>
    </div>
  </div>
{/if}
