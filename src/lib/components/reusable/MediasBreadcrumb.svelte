<script lang="ts">
	export let path: string = ""; // e.g., "proyek-1/subfolder"
	export let onNavigate: (folder: string) => void;

	// Split the path into parts
	$: parts = path.split("/").filter(Boolean);
</script>

<nav class="text-sm breadcrumbs mb-2">
	<ul class="flex space-x-1">
		<li>
			<button
				on:click={() => onNavigate("")}
				class="text-blue-600 hover:underline"
			>
				root
			</button>
			<span>/</span>
		</li>

		{#each parts as part, i}
			<li>
				<button
					on:click={() => onNavigate(parts.slice(0, i + 1).join("/"))}
					class="text-blue-600 hover:underline"
				>
					{part}
				</button>
				{#if i < parts.length - 1}
					<span>/</span>
				{/if}
			</li>
		{/each}
	</ul>
</nav>
