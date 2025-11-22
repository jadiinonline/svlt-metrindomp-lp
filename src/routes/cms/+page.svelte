<script lang="ts">
	import FolderGrid from "$lib/components/reusable/FolderGrid.svelte";
	import ImageGrid from "$lib/components/reusable/ImageGrid.svelte";
	import Breadcrumb from "$lib/components/reusable/MediasBreadcrumb.svelte";
	import { onMount } from "svelte";

	let folders: string[] = [];
	let activeFolder = "";
	let medias: any[] = [];

	async function fetchNavigation(folder = "") {
		const res = await fetch(
			`/api/media/navigation?folder=${encodeURIComponent(folder)}`,
		);
		const data = await res.json();
		folders = data.folders;
		medias = data.mediaFiles;
		activeFolder = folder;
	}

	function handleFolderClick(folder: string) {
		const newPath = activeFolder ? activeFolder + "/" + folder : folder;
		fetchNavigation(newPath);
	}

	function handleBreadcrumbNavigate(folder: string) {
		fetchNavigation(folder);
	}

	onMount(() => {
		fetchNavigation();
	});
</script>

<div class="shadow-md p-4 m-4 rounded-2xl border-primary border-2">
	<h1 class="uppercase text-2xl text-center font-bold mt-6">Medias</h1>
	<div class="flex flex-col space-y-4 min-h-[90vh]">
		<!-- Breadcrumb -->
		<Breadcrumb path={activeFolder} onNavigate={handleBreadcrumbNavigate} />

		<!-- Folders -->
		{#if folders.length > 0}
			<FolderGrid {folders} onSelect={handleFolderClick} />
		{/if}

		<!-- Images -->
		{#if medias.length > 0}
			<ImageGrid
				{medias}
				onDelete={(url) => {
					// Option 1: Filter locally
					medias = medias.filter((m) => m.url !== url);

					// Option 2: Re-fetch the current folder/page
					fetchNavigation(activeFolder); // or any page-based fetch function
				}}
			/>
		{/if}
	</div>
</div>
