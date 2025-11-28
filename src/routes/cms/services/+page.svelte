<script lang="ts">
	// components
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { toast } from "svelte-sonner";
	import * as HoverCard from "$lib/components/ui/hover-card/index.js";

	// icons
	import { Pencil } from "@lucide/svelte";
	import MediaLibrary from "$lib/components/reusable/MediaLibrary.svelte";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

	let { data } = $props();

	let serviceCategoriesResponse: any[any] = $state(data.fetchOneData);

	let newUrl = $state("");
	let isDialogOpen = $state(false);
	let drawerOpen = $state(false);
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
			// const data = await res.json();
			isDialogOpen = false;
			drawerOpen = false;
			newUrl = "";
			// return data;
			fetchServiceCategory();
		} catch (error) {
			console.error("updateServiceCategory error:", error);
			toast.error("error on update service");

			// throw error;
		} finally {
			isProcessing = false;
			// drawerOpen = false;
		}
	}

	// console.log({ serviceCategoriesResponse });
</script>

<h1 class="font-bold text-center text-2xl m-6">Services Management</h1>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 m-2">
	{#each serviceCategoriesResponse.serviceCategories as x (x.id)}
		<div class="shadow-sm border rounded-2xl p-2">
			<div class="grid grid-cols-3 items-center">
				<h3 class="text-left font-bold">{x.name}</h3>

				<div></div>

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
						<!-- dialog body -->
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
										})}
									>
										change image
									</Drawer.Trigger>
									<Drawer.Content>
										<Drawer.Header>
											<Drawer.Title
												>Choose the image</Drawer.Title
											>
											<Drawer.Description>
												<MediaLibrary
													onSelected={(url: string) =>
														captureNewImageUrl(url)}
													enableSelect={true}
												/>
											</Drawer.Description>
										</Drawer.Header>
										<!-- <Drawer.Footer>
											<Button>Submit</Button>
											<Drawer.Close>Cancel</Drawer.Close>
										</Drawer.Footer> -->
									</Drawer.Content>
								</Drawer.Root>
							</div>

							<ScrollArea class="h-[300px]">
								<div class="grid grid-cols-2 gap-5">
									<div>
										<h4 class="text-center">
											previous image
										</h4>
										{#if newUrl == ""}
											<img
												src={x.media.url}
												alt={x.media.altText}
												class="mx-auto h-[200px]"
											/>
										{:else}
											<!-- transparant  -->
											<img
												src={x.media.url}
												alt={x.media.altText}
												class="mx-auto h-[200px] opacity-50"
											/>
										{/if}
									</div>

									<div>
										{#if newUrl != ""}
											<h4 class="text-center">
												Selected image
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
								onclick={() => {
									try {
										updateServiceCategory(x.id, {
											name: x.name,
											description: x.description,
											mediaUrl: newUrl,
										});
										isDialogOpen = false;
									} catch (e) {
										console.error(e);
									} finally {
										isProcessing = false;
									}
								}}
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

			<HoverCard.Root>
				<HoverCard.Trigger class="text-muted-foreground line-clamp-5"
					>{x.description}</HoverCard.Trigger
				>
				<HoverCard.Content
					class="text-sm text-muted-foreground xl:w-[800px]"
				>
					{x.description}
				</HoverCard.Content>
			</HoverCard.Root>

			<img src={x.media.url} alt={x.media.altText} class="my-2" />
		</div>
	{/each}
</div>
