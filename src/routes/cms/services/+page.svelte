<script lang="ts">
	// components
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { toast } from "svelte-sonner";

	// icons
	import { Pencil } from "@lucide/svelte";
	import MediaPicker from "./MediaPicker.svelte";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

	let { data } = $props();

	let serviceCategoriesResponse: any[any] = $state(data.fetchOneData);

	let newUrl = $state("");
	let drawerOpen = $state(false);
	let dialogOpen = $state(false);
	let isProcessing = $state(false);

	function captureNewImageUrl(url: string) {
		newUrl = url;
		// console.log({ newUrl });
		drawerOpen = false;
	}

	async function fetchServiceCategory() {
		try {
			isProcessing = true;
			const res = await fetch(`/api/service-category?limit=100`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				// body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(
					err.error || "Failed to update service category",
				);
			}
			// toast.info("refetching data");
			const data = await res.json();

			serviceCategoriesResponse = data;
			// dialogOpen = false;
			// return data;
		} catch (error) {
			console.error("refetchServiceCategory error:", error);
			toast.error("error on refetch service categories");

			// throw error;
		} finally {
			isProcessing = false;
		}
	}

	async function updateServiceCategory(
		id: number | string,
		payload: {
			name?: string;
			description?: string;
			mediaId?: number | string;
			mediaUrl?: string;
		},
	) {
		try {
			isProcessing = true;
			const res = await fetch(`/api/service-category?id=${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(
					err.error || "Failed to update service category",
				);
			}
			toast.success("successfully update service");
			const data = await res.json();
			dialogOpen = false;
			newUrl = "";
			// return data;
			fetchServiceCategory();
		} catch (error) {
			console.error("updateServiceCategory error:", error);
			toast.error("error on update service");

			// throw error;
		} finally {
			isProcessing = false;
		}
	}

	// console.log({ serviceCategoriesResponse });
</script>

<h1 class="font-bold text-center text-2xl m-6">Services Management</h1>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
	{#each serviceCategoriesResponse.serviceCategories as x}
		<div class="shadow-sm border rounded-2xl p-2">
			<div class="grid grid-cols-3 items-center">
				<div></div>
				<h3 class=" text-center font-bold">{x.name}</h3>

				<Dialog.Root>
					<Dialog.Trigger
						class={buttonVariants({
							variant: "outline",
							class: "justify-self-end",
						})}
					>
						<Pencil />
					</Dialog.Trigger>
					<Dialog.Content class="min-w-[90vw] lg:min-w-[70vw]">
						<Dialog.Header>
							<Dialog.Title>Edit</Dialog.Title>
							<Dialog.Description>
								Make changes to your service categories. Click
								save when you're done.
							</Dialog.Description>
						</Dialog.Header>
						<div class="grid gap-4 py-4">
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="name" class="text-end">Name</Label>
								<Input
									id="name"
									bind:value={x.name}
									class="col-span-3"
								/>
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="description" class="text-end"
									>Description</Label
								>
								<Textarea
									id="description"
									bind:value={x.description}
									class="col-span-3"
								/>
							</div>
							<div class=" grid grid-cols-4">
								<Label for="image" class="text-end">image</Label
								>
								<Drawer.Root bind:open={drawerOpen}>
									<Drawer.Trigger
										class={buttonVariants({
											variant: "outline",
											class: "justify-self-start",
										})}>change image</Drawer.Trigger
									>
									<Drawer.Content>
										<Drawer.Header>
											<Drawer.Title
												>Choose the image</Drawer.Title
											>
											<Drawer.Description>
												<MediaPicker
													onSelected={(url: string) =>
														captureNewImageUrl(url)}
												/>
											</Drawer.Description>
										</Drawer.Header>
										<Drawer.Footer>
											<Button>Submit</Button>
											<Drawer.Close>Cancel</Drawer.Close>
										</Drawer.Footer>
									</Drawer.Content>
								</Drawer.Root>
							</div>

							<ScrollArea class="h-[300px]">
								<div class="grid grid-cols-2 gap-5">
									<div>
										<h4 class="text-center">
											previous image
										</h4>
										<img
											src={x.media.url}
											alt={x.media.altText}
											class="mx-auto h-[200px]"
										/>
									</div>
									<div>
										{#if newUrl != ""}
											<h4 class="text-center">
												selected image
											</h4>
											<img
												src={newUrl}
												alt={x.media.altText}
												class="mx-auto h-[200px]"
											/>
										{/if}
									</div>
								</div>
							</ScrollArea>
						</div>
						<Dialog.Footer>
							<Button
								disabled={isProcessing}
								onclick={() =>
									updateServiceCategory(x.id, {
										name: x.name,
										description: x.description,
										mediaUrl: newUrl,
									})}
							>
								{#if isProcessing}
									<span
										class="animate-spin border-2 border-white border-t-transparent rounded-full h-4 w-4"
									></span>
									processing changes...
								{:else}
									Save Changes
								{/if}
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>

			<span class="text-muted-foreground">{x.description}</span>

			<img src={x.media.url} alt={x.media.altText} class="my-2" />
		</div>
	{/each}
</div>
