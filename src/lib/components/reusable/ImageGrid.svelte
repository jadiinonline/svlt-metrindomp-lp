<script lang="ts">
	import FullScreenImageViewer from "./FullScreenImageViewer.svelte";
	import { toast } from "svelte-sonner";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import { Trash2 } from "@lucide/svelte";

	export let medias: {
		id: string;
		uuid: string;
		url: string;
		altText: string | null;
		fileName: string;
	}[] = [];

	export let onDelete: (url: string) => void = () => {};
	export let onSelect: ((urls: string[] | string) => void) | undefined =
		undefined; //optional onSelect from parent

	export let enableDelete: boolean = false;
	export let enableSelect: boolean = false;
	export let singleSelect: boolean = false;
	export let useCheckbox: boolean = false;

	let fullscreenSrc: string | null = null;
	let selectedUrls: Set<string> = new Set();

	async function handleDelete(mediaUrl: string, fileName: string) {
		try {
			const res = await fetch(`/api/media`, {
				method: "DELETE",
				body: JSON.stringify({ url: mediaUrl }),
			});
			const data = await res.json();

			if (data.ok) {
				onDelete?.(mediaUrl);
				toast.success(`Image ${fileName} deleted successfully`);
				selectedUrls.delete(mediaUrl);
				emitSelection();
			} else {
				toast.error(
					`Failed to delete image: ${data.error ?? "Unknown error"}`,
				);
			}
		} catch (err) {
			console.error(err);
			toast.error(`Failed to delete image ${fileName}`);
		}
	}

	function toggleSelect(url: string) {
		if (!enableSelect) return;

		if (singleSelect) {
			selectedUrls.clear();
			selectedUrls.add(url);
		} else {
			if (selectedUrls.has(url)) selectedUrls.delete(url);
			else selectedUrls.add(url);
		}

		emitSelection();
	}

	function emitSelection() {
		if (singleSelect) {
			onSelect?.(Array.from(selectedUrls)[0] ?? null);
		} else {
			onSelect?.(Array.from(selectedUrls));
		}
	}
</script>

<div
	class="border rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
>
	{#each medias as item (item.url)}
		<div
			class="bg-muted rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow relative cursor-pointer"
			class:selected={selectedUrls.has(item.url)}
		>
			<button
				class="block p-0 m-0 bg-transparent border-0 w-full h-48 cursor-zoom-in"
				on:click={() => (fullscreenSrc = item.url)}
			>
				<img
					src={item.url}
					alt={item.altText ?? "media image"}
					class="w-full h-48 object-scale-down hover:scale-110 transition-transform duration-150"
					loading="lazy"
				/>
			</button>

			<div
				class="p-2 text-xs text-center flex justify-between items-center"
			>
				<div>{item.fileName}</div>

				{#if enableSelect && singleSelect}
					<Button
						onclick={() => onSelect?.(item.url)}
						class="hover:cursor-grab">select</Button
					>
				{/if}

				{#if enableSelect && useCheckbox}
					<input
						type="checkbox"
						checked={selectedUrls.has(item.url)}
						on:change={() => toggleSelect(item.url)}
					/>
				{/if}
			</div>

			{#if enableDelete}
				<AlertDialog.Root>
					<AlertDialog.Trigger
						class={buttonVariants({
							variant: "destructive",
							class: "absolute top-2 right-2",
						})}
					>
						<Trash2 />
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title
								>Delete image {item.fileName}?</AlertDialog.Title
							>
							<AlertDialog.Description>
								This action cannot be undone. This will
								permanently delete your image from the server.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action
								class={buttonVariants({
									variant: "destructive",
								})}
								onclick={() =>
									handleDelete(item.url, item.fileName)}
								>Continue</AlertDialog.Action
							>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			{/if}
		</div>
	{/each}
</div>

{#if fullscreenSrc}
	<FullScreenImageViewer
		src={fullscreenSrc}
		onClose={() => (fullscreenSrc = null)}
	/>
{/if}

<style>
	.selected {
		border: 10px solid;
	}
</style>
