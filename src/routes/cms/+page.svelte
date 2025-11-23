<script lang="ts">
	import FolderGrid from "$lib/components/reusable/FolderGrid.svelte";
	import ImageGrid from "$lib/components/reusable/ImageGrid.svelte";
	import Breadcrumb from "$lib/components/reusable/MediasBreadcrumb.svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	import { Upload } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

	let folders: string[] = $state([]);
	let activeFolder = $state("");
	let medias: any[] = $state([]);
	let isLoading = $state(false);

	// upload form
	let imageFiles = $state<FileList | null>(null);

	// Convert FileList → array of object URLs
	let previewImageFiles = $derived(
		imageFiles
			? Array.from(imageFiles).map((f) => URL.createObjectURL(f))
			: [],
	);

	async function uploadMedia() {
		try {
			if (!imageFiles || imageFiles.length === 0) {
				alert("Select at least 1 image");
				return;
			}

			isLoading = true;
			const formData = new FormData();
			formData.append("folder", activeFolder);

			for (const file of imageFiles) {
				formData.append("imageFiles", file);
			}

			const res = await fetch("/api/media", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
			console.log(data);
			//storage.googleapis.com/jadiinonline-public/metrindomp/api/media/proyek-2/1763833403993-af63ebe099b5.webp
			toast.success("Upload successful");
			imageFiles = null; //reset image data
			fetchNavigation(activeFolder);
		} catch (err) {
			console.error(err);
			alert("Upload failed");
		} finally {
			isLoading = false;
		}
	}

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
	<div class="relative mt-6">
		<h1 class="uppercase text-2xl text-center font-bold">Medias</h1>

		<!-- Right-aligned button -->
		<div class="absolute right-0 top-0">
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
					<Upload />
					Upload
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[80vw]">
					<Dialog.Header>
						<Dialog.Title>Upload Images</Dialog.Title>
						<Dialog.Description>
							upload more images to your landing page
						</Dialog.Description>
					</Dialog.Header>
					<div class="grid gap-4 py-4">
						<div class="grid grid-cols-3 items-center gap-4">
							<Label for="folder" class="text-end">Folder</Label>
							<Input
								type="text"
								placeholder="Folder name"
								bind:value={activeFolder}
								class="border p-2 w-full"
								disabled
							/>
						</div>
						<div class="grid grid-cols-3 items-center gap-4">
							<Label for="imageFiles" class="text-end"
								>imageFiles</Label
							>
							<Input
								id="imageFiles"
								type="file"
								accept="image/*"
								multiple
								onchange={(e) => (imageFiles = e.target.files)}
								class="border p-2 "
							/>
						</div>
						<!-- GRID PREVIEW -->
						<div
							class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"
						>
							{#each previewImageFiles as src, i}
								<div class="relative">
									<div
										class="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded"
									>
										{i + 1}
									</div>

									<div
										class="w-full h-32 overflow-hidden rounded-lg border"
									>
										<img
											{src}
											alt=""
											class="w-full h-full object-scale-down"
										/>
									</div>
								</div>
							{/each}
						</div>
					</div>
					<Dialog.Footer>
						<Button
							type="button"
							disabled={isLoading}
							onclick={uploadMedia}
						>
							{#if isLoading}
								<span
									class="animate-spin border-2 border-white border-t-transparent rounded-full h-4 w-4"
								></span>
								Uploading...
							{:else}
								Upload
							{/if}
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>

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
