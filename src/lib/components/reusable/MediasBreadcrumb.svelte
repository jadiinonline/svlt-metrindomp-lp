<script lang="ts">
	import { House } from "@lucide/svelte";

	export let path: string = ""; // e.g., "proyek-1/subfolder"
	export let onNavigate: (folder: string) => void;

	// Split the path into parts
	$: parts = path.split("/").filter(Boolean);
</script>

<nav class="text-sm mb-2 font-bold text-blue-600">
	<ul class="flex items-center space-x-2 h-[20px]">
		<li class="flex items-center space-x-1">
			<button
				on:click={() => onNavigate("")}
				class="hover:underline flex items-center"
			>
				<House size={19} />
			</button>
			<span>/</span>
		</li>

		{#each parts as part, i}
			<li class="flex items-center space-x-1">
				<button
					on:click={() => onNavigate(parts.slice(0, i + 1).join("/"))}
					class="hover:underline"
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
