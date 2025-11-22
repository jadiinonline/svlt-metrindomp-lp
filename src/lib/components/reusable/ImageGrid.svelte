<script lang="ts">
	import { toast } from "svelte-sonner"; // Optional: For better success/error reporting

	export let medias: {
		id: string;
		uuid: string;
		url: string;
		altText: string | null;
		fileName: string;
	}[] = [];

	// Callback prop to notify parent about deletion
	export let onDelete: (url: string) => void;

	async function handleDelete(mediaUrl: string, fileName: string) {
		if (!confirm("Are you sure you want to delete this image?")) return;

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
			alert("Error deleting image");
		}
	}
</script>

<div
	class="border rounded-2xl border-primary min-h-[90vh] p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
>
	{#each medias as item (item.url)}
		<div
			class="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow relative"
		>
			<img
				src={item.url}
				alt={item.altText ?? "media image"}
				class="w-full h-48 object-cover"
				loading="lazy"
			/>
			<div class="p-2 text-xs">{item.fileName}</div>

			<!-- Delete button -->
			<button
				class="absolute top-2 right-2 bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-600"
				on:click={() => handleDelete(item.url, item.fileName)}
			>
				Delete
			</button>
		</div>
	{/each}
</div>
