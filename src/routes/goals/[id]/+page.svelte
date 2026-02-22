<script lang="ts">
  import { page } from '$app/stores';

  let goal = $state<any>(null);
  let activeTab = $state('updates');
  let newUpdate = $state('');
  let newArtifactTitle = $state('');
  let newArtifactUrl = $state('');
  let newArtifactType = $state('pr');
  let newMetricName = $state('');
  let newMetricBefore = $state('');
  let newMetricAfter = $state('');
  let newMetricUnit = $state('');

  const outcomeOptions = [
    'leadership_recognition', 'team_adoption', 'process_change', 'reputation_boost',
    'cost_savings', 'time_savings', 'client_satisfaction', 'revenue_generated', 'risk_reduced', 'knowledge_shared'
  ];
  const outcomeLabels: Record<string, string> = {
    leadership_recognition: '👑 Leadership Recognition', team_adoption: '👥 Team Adoption',
    process_change: '🔄 Process Change', reputation_boost: '⭐ Reputation Boost',
    cost_savings: '💰 Cost Savings', time_savings: '⏱️ Time Savings',
    client_satisfaction: '😊 Client Satisfaction', revenue_generated: '📈 Revenue Generated',
    risk_reduced: '🛡️ Risk Reduced', knowledge_shared: '📚 Knowledge Shared'
  };

  async function loadGoal() {
    const id = $page.params.id;
    const res = await fetch(`/api/goals/${id}`);
    if (res.ok) goal = await res.json();
  }

  async function addUpdate() {
    if (!newUpdate.trim()) return;
    await fetch(`/api/goals/${goal.id}/updates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary: newUpdate.trim() })
    });
    newUpdate = '';
    loadGoal();
  }

  async function addArtifact() {
    if (!newArtifactTitle.trim()) return;
    await fetch(`/api/goals/${goal.id}/artifacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: newArtifactType, title: newArtifactTitle.trim(), url: newArtifactUrl.trim() || undefined })
    });
    newArtifactTitle = ''; newArtifactUrl = '';
    loadGoal();
  }

  async function addMetric() {
    if (!newMetricName.trim() || !newMetricBefore || !newMetricAfter) return;
    await fetch(`/api/goals/${goal.id}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newMetricName.trim(), before_val: +newMetricBefore, after_val: +newMetricAfter, unit: newMetricUnit.trim() || undefined })
    });
    newMetricName = ''; newMetricBefore = ''; newMetricAfter = ''; newMetricUnit = '';
    loadGoal();
  }

  async function toggleOutcome(tag: string) {
    const current = goal.outcome_tags || [];
    const updated = current.includes(tag) ? current.filter((t: string) => t !== tag) : [...current, tag];
    await fetch(`/api/goals/${goal.id}/outcomes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome_tags: updated, outcome_notes: goal.outcome_notes || '' })
    });
    loadGoal();
  }

  function formatDelta(before: number, after: number) {
    const delta = ((after - before) / before * 100).toFixed(1);
    return +delta > 0 ? `+${delta}%` : `${delta}%`;
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  $effect(() => { loadGoal(); });
</script>

{#if goal}
<div class="p-6 max-w-4xl mx-auto">
  <a href="/" class="text-sm mb-4 inline-block" style="color: var(--neon-purple); text-decoration: none;">← Goals</a>
  
  <div class="mb-6">
    <div class="flex items-center gap-3 mb-2">
      <span class="status-dot" style="background: var(--neon-purple); box-shadow: 0 0 6px var(--neon-purple);"></span>
      <h1 class="text-xl font-bold" style="color: var(--text-primary);">{goal.title}</h1>
      <span class="chip">{goal.status}</span>
    </div>
    {#if goal.description}
      <p class="text-sm" style="color: var(--text-secondary);">{goal.description}</p>
    {/if}
    <div class="flex gap-1 mt-2">
      {#each (goal.tags || []) as tag}
        <span class="chip">{tag}</span>
      {/each}
    </div>
  </div>

  <!-- Tabs -->
  <div class="flex gap-0 mb-6" style="border-bottom: 1px solid var(--card-border);">
    <button class="tab" class:active={activeTab === 'updates'} onclick={() => activeTab = 'updates'}>Updates ({goal.updates?.length || 0})</button>
    <button class="tab" class:active={activeTab === 'artifacts'} onclick={() => activeTab = 'artifacts'}>Artifacts ({goal.artifacts?.length || 0})</button>
    <button class="tab" class:active={activeTab === 'impact'} onclick={() => activeTab = 'impact'}>Impact</button>
  </div>

  <!-- Updates Tab -->
  {#if activeTab === 'updates'}
    <div class="mb-4">
      <div class="flex gap-2">
        <input
          bind:value={newUpdate}
          class="flex-1 px-3 py-2 rounded text-sm"
          style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);"
          placeholder="What did you accomplish?"
          onkeydown={(e) => e.key === 'Enter' && addUpdate()}
        />
        <button class="btn btn-primary" onclick={addUpdate}>Add</button>
      </div>
    </div>
    
    <div class="flex flex-col gap-2">
      {#each (goal.updates || []) as update}
        <div class="card p-3">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs mono" style="color: var(--text-muted);">{timeAgo(update.created_at)}</span>
            <span class="text-xs px-1.5 py-0.5 rounded" style="background: {update.source === 'agent' ? 'rgba(77,217,242,0.15)' : 'rgba(173,77,255,0.15)'}; color: {update.source === 'agent' ? 'var(--neon-cyan)' : 'var(--neon-purple)'};">{update.source}{update.agent_name ? ` · ${update.agent_name}` : ''}</span>
          </div>
          <p class="text-sm" style="color: var(--text-primary);">{update.summary}</p>
          {#if update.details}
            <p class="text-xs mt-1" style="color: var(--text-secondary);">{update.details}</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Artifacts Tab -->
  {#if activeTab === 'artifacts'}
    <div class="mb-4">
      <div class="flex gap-2">
        <select bind:value={newArtifactType} class="px-2 py-2 rounded text-sm" style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);">
          <option value="pr">PR</option>
          <option value="commit">Commit</option>
          <option value="link">Link</option>
          <option value="file">File</option>
        </select>
        <input bind:value={newArtifactTitle} class="flex-1 px-3 py-2 rounded text-sm" style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);" placeholder="Title" />
        <input bind:value={newArtifactUrl} class="flex-1 px-3 py-2 rounded text-sm" style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);" placeholder="URL (optional)" />
        <button class="btn btn-primary" onclick={addArtifact}>Link</button>
      </div>
    </div>
    
    <div class="flex flex-col gap-2">
      {#each (goal.artifacts || []) as artifact}
        <div class="card p-3 flex items-center gap-3">
          <span class="text-xs font-bold px-2 py-0.5 rounded" style="background: rgba(173,77,255,0.15); color: var(--neon-purple);">{artifact.type.toUpperCase()}</span>
          <span class="text-sm" style="color: var(--text-primary);">{artifact.title}</span>
          {#if artifact.url}
            <a href={artifact.url} target="_blank" class="text-xs mono" style="color: var(--neon-cyan);">↗</a>
          {/if}
          <span class="text-xs mono ml-auto" style="color: var(--text-muted);">{timeAgo(artifact.created_at)}</span>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Impact Tab -->
  {#if activeTab === 'impact'}
    <!-- Metrics -->
    <div class="card p-4 mb-4">
      <h3 class="text-sm font-bold mb-3" style="color: var(--text-secondary);">📊 Metrics</h3>
      
      <div class="flex gap-2 mb-3">
        <input bind:value={newMetricName} class="flex-1 px-3 py-2 rounded text-sm" style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);" placeholder="Metric name" />
        <input bind:value={newMetricBefore} type="number" class="w-20 px-2 py-2 rounded text-sm" style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);" placeholder="Before" />
        <input bind:value={newMetricAfter} type="number" class="w-20 px-2 py-2 rounded text-sm" style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);" placeholder="After" />
        <input bind:value={newMetricUnit} class="w-20 px-2 py-2 rounded text-sm" style="background: var(--bg); border: 1px solid var(--card-border); color: var(--text-primary);" placeholder="Unit" />
        <button class="btn btn-primary" onclick={addMetric}>Add</button>
      </div>

      {#each (goal.metrics || []) as metric}
        <div class="flex items-center gap-4 py-2" style="border-bottom: 1px solid var(--card-border);">
          <span class="text-sm font-medium" style="color: var(--text-primary);">{metric.name}</span>
          <span class="mono text-sm" style="color: var(--text-muted);">{metric.before_val}</span>
          <span style="color: var(--neon-purple);">→</span>
          <span class="mono text-sm" style="color: var(--text-primary);">{metric.after_val}</span>
          {#if metric.unit}<span class="text-xs" style="color: var(--text-muted);">{metric.unit}</span>{/if}
          <span class="text-xs font-bold" style="color: {metric.after_val < metric.before_val ? 'var(--status-green)' : metric.after_val > metric.before_val ? 'var(--status-amber)' : 'var(--text-muted)'};">
            {formatDelta(metric.before_val, metric.after_val)}
          </span>
        </div>
      {/each}
      {#if !goal.metrics?.length}
        <p class="text-xs" style="color: var(--text-muted);">No metrics yet. Add before/after measurements above.</p>
      {/if}
    </div>

    <!-- Outcomes -->
    <div class="card p-4 mb-4">
      <h3 class="text-sm font-bold mb-3" style="color: var(--text-secondary);">🏷️ Outcomes</h3>
      <div class="flex flex-wrap gap-2 mb-3">
        {#each outcomeOptions as tag}
          <button
            class="text-xs px-2 py-1 rounded cursor-pointer transition-all"
            style="background: {(goal.outcome_tags || []).includes(tag) ? 'rgba(77,217,115,0.2)' : 'rgba(97,97,115,0.1)'}; color: {(goal.outcome_tags || []).includes(tag) ? 'var(--status-green)' : 'var(--text-muted)'}; border: 1px solid {(goal.outcome_tags || []).includes(tag) ? 'var(--status-green)' : 'transparent'};"
            onclick={() => toggleOutcome(tag)}
          >
            {outcomeLabels[tag]}
          </button>
        {/each}
      </div>
    </div>

    <!-- Narrative -->
    <div class="card p-4">
      <h3 class="text-sm font-bold mb-3" style="color: var(--text-secondary);">📝 Narrative</h3>
      {#if goal.narrative}
        <p class="text-sm leading-relaxed" style="color: var(--text-primary);">{goal.narrative}</p>
      {:else}
        <p class="text-xs" style="color: var(--text-muted);">AI narrative generation coming soon. Add metrics and outcomes first.</p>
      {/if}
    </div>
  {/if}
</div>
{:else}
  <div class="p-6 text-center" style="color: var(--text-muted);">Loading...</div>
{/if}
