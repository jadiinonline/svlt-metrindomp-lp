<script lang="ts">
	import FullScreenImageViewer from "./FullScreenImageViewer.svelte";
	import { toast } from "svelte-sonner"; // Optional: For better success/error reporting
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { Trash2 } from "@lucide/svelte";
	export let medias: {
		id: string;
		uuid: string;
		url: string;
		altText: string | null;
		fileName: string;
	}[] = [];

	let fullscreenSrc: string | null = null;
	// Callback prop to notify parent about deletion
	export let onDelete: (url: string) => void;

	async function handleDelete(mediaUrl: string, fileName: string) {
		// if (!confirm("Are you sure you want to delete this image?")) return;

		try {
			const res = await fetch(`/api/media`, {
				method: "DELETE",
				body: JSON.stringify({ url: mediaUrl }),
			});
			const data = await res.json();

			if (data.ok) {
				// Notify parent that a media was deleted
				onDelete?.(mediaUrl);
				toast.success(`Image ${fileName} deleted successfully`);
			} else {
				alert(
					"Failed to delete image: " +
						(data.error ?? "Unknown error"),
				);
			}
		} catch (err) {
			console.error(err);
			toast.error(`Failed to delete image ${fileName}  `);
		}
	}
</script>

<div
	class="border rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
>
	{#each medias as item (item.url)}
		<div
			class="bg-muted rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow relative cursor-pointer"
		>
			<button
				class="block p-0 m-0 bg-transparent border-0 w-full h-48 cursor-zoom-in"
				on:click={() => (fullscreenSrc = item.url)}
			>
				<img
					src={item.url}
					alt={item.altText ?? "media image"}
					class="w-full h-48 object-scale-down"
					loading="lazy"
				/>
			</button>
			<div class="p-2 text-xs">{item.fileName}</div>

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
							>Delete image {item.fileName} ?</AlertDialog.Title
						>
						<AlertDialog.Description>
							This action cannot be undone. This will permanently
							delete your image from our servers.
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
		</div>
	{/each}
</div>

{#if fullscreenSrc}
	<FullScreenImageViewer
		src={fullscreenSrc}
		onClose={() => (fullscreenSrc = null)}
	/>
{/if}
