<script lang="ts">
	import { Folder } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";

	export let folders: string[] = [];
	export let onSelect: (folder: string) => void;
</script>

<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4">
	{#each folders as folder}
		<!-- Folder icon -->
		<button
			class="flex flex-col space-y-1 border hover:border-primary hover:shadow-lg rounded-lg p-1 hover:bg-gray-100 transition"
			onclick={() => onSelect(folder)}
		>
			<Folder class="mx-auto self-center" size="30" />
			<br />
			<p class="text-center">{folder}</p>
		</button>
	{/each}
</div>
