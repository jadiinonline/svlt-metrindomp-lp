<script lang="ts">
	// components shadcn
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { toast } from "svelte-sonner";
	import * as HoverCard from "$lib/components/ui/hover-card/index.js";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";

	// reusable components
	import MediaLibrary from "$lib/components/reusable/MediaLibrary.svelte";

	// icons
	import { Pencil, Plus, Trash, X } from "@lucide/svelte";
	import Spinner from "$lib/components/ui/spinner/spinner.svelte";

	let { data } = $props();

	let clientResponse: any[any] = $state(data.fetchOneData);

	let isProcessing = $state(false);
	let drawerOpen = $state(false);
	let deleteDialog = $state({
		open: false,
		id: null,
	});

	let createDialog = $state({
		open: false,
	});

	let addData: any = $state([]);

	const classificationSelect = [
		{ value: "PT", label: "PT." },
		{ value: "CV", label: "CV." },
		{ value: "Yayasan", label: "Yayasan" },
		{ value: "Perorangan", label: "Perorangan" },
	];

	// let clasificationSelectedValue = $state("");

	const triggerSelectContent = $derived(
		classificationSelect.find((f) => f.value === addData.classification)
			?.label ?? "Select Classification",
	);

	let newUrl = $state("");
	function captureNewImageUrl(url: string) {
		newUrl = url;
		// console.log({ newUrl });
		drawerOpen = false;
	}

	function resetAllInput() {
		addData = [];
		newUrl = "";

		deleteDialog.open = false;
		deleteDialog.id = null;

		createDialog.open = false;
	}

	async function fetchClient() {
		try {
			isProcessing = true;
			const res = await fetch(`/api/client?limit=500`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				// body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to fetch clients");
			}
			// toast.info("refetching data");
			const data = await res.json();

			clientResponse = data;
			// dialogOpen = false;
			// return data;
		} catch (error) {
			console.error("error:", error);
			toast.error("error on refetch client");

			// throw error;
		} finally {
			isProcessing = false;
		}
	}

	async function postCreateClient(payload: {
		name?: string;
		classification?: string;
		mediaId?: number | string;
		mediaUrl?: string;
	}) {
		try {
			isProcessing = true;
			const res = await fetch(`/api/client`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to create client");
			}
			toast.success("successfully create client");
			// const data = await res.json();
			drawerOpen = false;
			// return data;

			fetchClient(); //refetch client list after creating new client

			resetAllInput(); //clearing all input
		} catch (error) {
			console.error("error:", error);
			toast.error("error on create client");

			// throw error;
		} finally {
			isProcessing = false;
			// drawerOpen = false;
		}
	}

	async function putUpdateClient(
		id: number | string,
		payload: {
			name?: string;
			classification?: string;
			mediaId?: number | string;
			mediaUrl?: string;
		},
	) {
		try {
			isProcessing = true;
			const res = await fetch(`/api/client?id=${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to update client");
			}
			toast.success("successfully update client");
			// const data = await res.json();
			drawerOpen = false;
			// return data;

			fetchClient(); //refetch client list after creating new client

			resetAllInput(); //clearing all input
		} catch (error) {
			console.error("error:", error);
			toast.error("error on update client");

			// throw error;
		} finally {
			isProcessing = false;
			// drawerOpen = false;
		}
	}

	async function deleteClient(id: number | string) {
		console.log("deleting client id:", id);
		try {
			isProcessing = true;
			const res = await fetch(`/api/client?id=${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				// body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to delete client");
			}
			toast.success("successfully delete client");
			// const data = await res.json();

			fetchClient(); //refetch client list after deleting client
			resetAllInput(); //clearing all input
		} catch (error) {
			console.error("error:", error);
			toast.error("error on delete client");

			// throw error;
		} finally {
			isProcessing = false;
		}
	}
</script>

<section class="m-4">
	<h1 class="font-bold text-center text-2xl">Clients Management</h1>
	<Dialog.Root open={createDialog.open}>
		<Dialog.Trigger
			class={buttonVariants({
				variant: "outline",
				class: "justify-self-start ",
			})}
			onclick={() => {
				createDialog.open = true;
			}}
		>
			<Plus /> add client
		</Dialog.Trigger>
		<Dialog.Content class="min-w-[90vw] lg:min-w-[70vw] h-[80vh]">
			<Dialog.Header>
				<Dialog.Title>Add new client</Dialog.Title>
				<Dialog.Description>
					Create new client to show on your landing page
				</Dialog.Description>
			</Dialog.Header>
			<!-- dialog body -->
			<section class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="classification" class="text-end"
						>Classification</Label
					>
					<Select.Root
						type="single"
						name="classification"
						bind:value={addData.classification}
						required
					>
						<Select.Trigger class="w-[200px]">
							{triggerSelectContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Classification</Select.Label>
								{#each classificationSelect as ys (ys.value)}
									<Select.Item
										value={ys.value}
										label={ys.label}
									>
										{ys.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-end">Name</Label>
					<Input
						id="name"
						bind:value={addData.name}
						class="col-span-3"
					/>
				</div>

				<div class=" grid grid-cols-4">
					<Label for="image" class="text-end">image</Label>
					<Drawer.Root bind:open={drawerOpen}>
						<Drawer.Trigger
							class={buttonVariants({
								variant: "outline",
								class: "justify-self-start",
							})}
						>
							Choose image
						</Drawer.Trigger>
						<Drawer.Content>
							<Drawer.Header>
								<Drawer.Title>Choose the image</Drawer.Title>
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

				<div>
					{#if newUrl != ""}
						<h4 class="text-center">Selected image</h4>
						<img
							src={newUrl}
							alt="selected logo"
							class="mx-auto h-[200px]"
						/>
					{/if}
				</div>

				<div>
					{addData.classification} - {addData.name}
				</div>
			</section>

			<Dialog.Footer>
				<Button
					disabled={isProcessing}
					onclick={() => {
						try {
							postCreateClient({
								name: addData.name,
								classification: addData.classification,
								mediaUrl: newUrl,
							});
							// isDialogOpen = false;
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
						processing create...
					{:else}
						Create Client
					{/if}
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
		{#each clientResponse.clients as x}
			<div class="p-4 border grid grid-flow-row gap-2 rounded-lg text-sm">
				<div class="flex justify-between items-center">
					<!-- {x.id} -->
					<div>{x.classification} | {x.name}</div>
					<div class="flex gap-1">
						<Dialog.Root>
							<Dialog.Trigger
								class={buttonVariants({
									variant: "outline",
									class: "justify-self-end",
								})}
							>
								<Pencil />
							</Dialog.Trigger>
							<Dialog.Content
								class="min-w-[90vw] lg:min-w-[70vw] xl:h-[90vh]"
							>
								<Dialog.Header>
									<Dialog.Title>Edit</Dialog.Title>
									<Dialog.Description>
										Make changes to your clients. Click save
										when you're done.
									</Dialog.Description>
								</Dialog.Header>
								<!-- dialog body -->
								<div class="grid gap-4 py-4">
									<div
										class="grid grid-cols-4 items-center gap-4"
									>
										<Label for="name" class="text-end"
											>Name</Label
										>
										<Input
											id="name"
											bind:value={x.name}
											class="col-span-3"
										/>
									</div>
									<div
										class="grid grid-cols-4 items-center gap-4"
									>
										<Label
											for="classification"
											class="text-end"
											>Classification</Label
										>
										<Select.Root
											type="single"
											name="classification"
											bind:value={x.classification}
											required
										>
											<Select.Trigger class="w-[200px]">
												{classificationSelect.find(
													(f) =>
														f.value ===
														x.classification,
												)?.label ??
													"Select Classification"}
											</Select.Trigger>
											<Select.Content>
												<Select.Group>
													<Select.Label
														>Classification</Select.Label
													>
													{#each classificationSelect as ys (ys.value)}
														<Select.Item
															value={ys.value}
															label={ys.label}
														>
															{ys.label}
														</Select.Item>
													{/each}
												</Select.Group>
											</Select.Content>
										</Select.Root>
									</div>
									<div class=" grid grid-cols-4">
										<Label for="image" class="text-end"
											>image</Label
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
															onSelected={(
																url: string,
															) =>
																captureNewImageUrl(
																	url,
																)}
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

									<ScrollArea class="">
										<div class="grid grid-cols-2 gap-1">
											<div>
												<h4 class="text-center">
													previous image
												</h4>
												{#if newUrl == ""}
													<img
														src={x.media?.url ??
															"https://placehold.co/300x300?text=No+Image+/cms/client"}
														alt={x.media?.altText ??
															"no data"}
													/>
												{:else}
													<!-- transparant  -->
													<img
														src={x.media?.url ??
															"https://placehold.co/300x300?text=No+Image+/cms/client"}
														alt={x.media?.altText ??
															"no data"}
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
														alt={x.media?.altText}
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
											putUpdateClient(x.id, {
												name: x.name,
												classification:
													x.classification,
												mediaUrl: newUrl,
											});
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

						<AlertDialog.Root
							open={deleteDialog.open && deleteDialog.id === x.id}
						>
							<AlertDialog.Trigger
								onclick={() => {
									deleteDialog.open = true;
									deleteDialog.id = x.id;
								}}
							>
								<Trash class="text-destructive" />
							</AlertDialog.Trigger>
							<AlertDialog.Content>
								<AlertDialog.Header>
									<AlertDialog.Title
										>Are you absolutely sure?</AlertDialog.Title
									>
									<AlertDialog.Description>
										This action cannot be undone. This will
										permanently delete a client and remove
										this client data and all projects listed
										to it.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Cancel
										>Cancel</AlertDialog.Cancel
									>
									<AlertDialog.Action
										class={buttonVariants({
											variant: "destructive",
										})}
										onclick={async () => deleteClient(x.id)}
										disabled={isProcessing}
										>{isProcessing
											? "on process..."
											: "delete"}</AlertDialog.Action
									>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</div>
				</div>

				<img
					src={x.media?.url ??
						"https://placehold.co/400x400?text=No+Image+/cms/client"}
					alt={x.media?.altText ?? "No image"}
					class="w-[350px] object-cover"
				/>
			</div>
		{/each}
	</div>
</section>
