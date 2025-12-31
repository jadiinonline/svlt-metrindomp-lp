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
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import * as Empty from "$lib/components/ui/empty/index.js";
	// import FolderCodeIcon from "@tabler/icons-svelte/icons/folder-code";

	// reusable components
	import MediaLibrary from "$lib/components/reusable/MediaLibrary.svelte";

	// icons
	import {
		Folder,
		FolderCode,
		ImageIcon,
		Pencil,
		Plus,
		Trash,
		X,
	} from "@lucide/svelte";
	import Spinner from "$lib/components/ui/spinner/spinner.svelte";
	import ScrollAreaScrollbar from "$lib/components/ui/scroll-area/scroll-area-scrollbar.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";

	let { data } = $props();

	let projectResponse: any[any] = $state(data.fetchOneData);

	let isProcessing = $state(false);
	let isOngoingProject = $state(false);
	let drawerOpen = $state(false);
	let deleteDialog = $state({
		open: false,
		id: null,
	});

	let createDialog = $state({
		open: false,
	});

	let addData: any = $state([]);

	const clientSelect = [
		{ value: "1", label: "1." },
		{ value: "CV", label: "CV." },
		{ value: "Yayasan", label: "Yayasan" },
		{ value: "Perorangan", label: "Perorangan" },
	];

	const triggerSelectContent = $derived(
		clientSelect.find((f) => f.value === addData.classification)?.label ??
			"Select Classification",
	);

	let newUrl = $state("");

	function captureNewProjectImageUrl(url: string) {
		newUrl = url;
		// console.log({ newUrl });
		drawerOpen = false;
	}

	function captureNewTaskImageUrl(url: string, taskId: number) {
		newUrl = url;
		// console.log({ newUrl });
		drawerOpen = false;

		try {
			postCreateProjectTaskImage(
				// {
				// 	// name?: string;
				// 	// description?: string;
				// 	// order?: number | string;
				// 	mediaUrl: newUrl,
				// },
				newUrl,
				taskId,
			);
		} catch (e) {
			console.error(e);
		} finally {
			isProcessing = false;
		}
	}

	function resetAllInput() {
		addData = [];
		// newUrl = "";
		formProjectTasks = [];

		deleteDialog.open = false;
		deleteDialog.id = null;

		createDialog.open = false;
	}

	// // // // // // API CALLS START // // // // // // //
	async function fetchProject() {
		try {
			isProcessing = true;
			const res = await fetch(`/api/project?limit=500`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				// body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to fetch Projects");
			}
			// toast.info("refetching data");
			const data = await res.json();

			projectResponse = data;
			// dialogOpen = false;
			// return data;
		} catch (error) {
			console.error("error:", error);
			toast.error("error on refetch Project");

			// throw error;
		} finally {
			isProcessing = false;
		}
	}

	async function postCreateProject(payload: {
		name?: string;
		classification?: string;
		mediaId?: number | string;
		mediaUrl?: string;
	}) {
		try {
			isProcessing = true;
			const res = await fetch(`/api/Project`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to create Project");
			}
			toast.success("successfully create Project");
			// const data = await res.json();
			drawerOpen = false;
			// return data;

			fetchProject(); //refetch Project list after creating new Project

			resetAllInput(); //clearing all input
		} catch (error) {
			console.error("error:", error);
			toast.error("error on create Project");

			// throw error;
		} finally {
			isProcessing = false;
			// drawerOpen = false;
		}
	}

	async function putUpdateProject(
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
			const res = await fetch(`/api/Project?id=${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to update Project");
			}
			toast.success("successfully update Project");
			// const data = await res.json();
			drawerOpen = false;
			// return data;

			fetchProject(); //refetch Project list after creating new Project

			resetAllInput(); //clearing all input
		} catch (error) {
			console.error("error:", error);
			toast.error("error on update Project");

			// throw error;
		} finally {
			isProcessing = false;
			// drawerOpen = false;
		}
	}

	async function deleteProject(id: number | string) {
		// console.log("deleting Project id:", id);
		try {
			isProcessing = true;
			const res = await fetch(`/api/Project?id=${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				// body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to delete Project");
			}
			toast.success("successfully delete Project");
			// const data = await res.json();

			fetchProject(); //refetch Project list after deleting Project
			resetAllInput(); //clearing all input
		} catch (error) {
			console.error("error:", error);
			toast.error("error on delete Project");

			// throw error;
		} finally {
			isProcessing = false;
		}
	}

	let formProjectTasks: any = $state([]);

	async function postCreateProjectTask(
		payload: {
			name?: string;
			description?: string;
			order?: number | string;
			// mediaUrl?: string;
		},
		projectId: number,
	) {
		// console.log({ payload });
		try {
			isProcessing = true;
			const res = await fetch(`/api/project/${projectId}/task`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to create Task");
			}
			toast.success("successfully create Task ");
			// const data = await res.json();
			drawerOpen = false;
			// return data;

			fetchProject(); //refetch Project list after creating new Project

			resetAllInput(); //clearing all input
		} catch (error) {
			console.error("error:", error);
			toast.error("error on create tasks");

			// throw error;
		} finally {
			isProcessing = false;
			// drawerOpen = false;
		}
	}

	async function putEditProjectTask(
		payload: {
			name?: string;
			description?: string;
			order?: number | string;
			// mediaUrl?: string;
		},
		projectTaskId: number,
	) {
		// console.log({ payload });
		try {
			isProcessing = true;
			const res = await fetch(`/api/project/task/${projectTaskId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to create Task");
			}
			toast.success("Successfully edit Task ");
			// const data = await res.json();
			drawerOpen = false;
			// return data;

			fetchProject(); //refetch Project list after creating new Project

			resetAllInput(); //clearing all input
		} catch (error) {
			console.error("error:", error);
			toast.error("error on create tasks");

			// throw error;
		} finally {
			isProcessing = false;
			// drawerOpen = false;
		}
	}

	async function postCreateProjectTaskImage(url: string, taskId: number) {
		try {
			isProcessing = true;
			const res = await fetch(`/api/project/task-image`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imageLink: url,
					projectsTasksId: taskId,
				}),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to create Task Image");
			}
			toast.success("Successfully add Task Image");
			// const data = await res.json();
			drawerOpen = false;
			// return data;

			fetchProject(); //refetch Project list after creating new Project

			resetAllInput(); //clearing all input
		} catch (error) {
			console.error("error:", error);
			toast.error("error on create task image");

			// throw error;
		} finally {
			isProcessing = false;
			// drawerOpen = false;
		}
	}
	// // // // // // API CALLS END // // // // // // //
</script>

<!-- projects list -->
<section class="m-4">
	<h1 class="font-bold text-center text-2xl">Projects Management</h1>
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
			<Plus /> add project
		</Dialog.Trigger>
		<Dialog.Content class="min-w-[90vw] lg:min-w-[70vw] h-[80vh]">
			<Dialog.Header>
				<Dialog.Title>Add new project</Dialog.Title>
				<Dialog.Description>
					Create new project to show on your landing page
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
								{#each clientSelect as ys (ys.value)}
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
											captureNewProjectImageUrl(url)}
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
							postCreateProject({
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
						Create Project
					{/if}
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
		{#each projectResponse.projects as yolo}
			<div class="p-4 border grid grid-flow-row gap-2 rounded-lg text-sm">
				<div class="flex justify-between items-center">
					<!-- {x.id} -->
					<div>
						<span class="font-bold"
							>{yolo.client.classification}
							{yolo.client.name}</span
						>
						| {yolo.year}
					</div>

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
										Make changes to your project. Click save
										when you're done.
									</Dialog.Description>
								</Dialog.Header>
								<!-- dialog body -->

								<section class="overflow-y-scroll p-2">
									<div class="grid gap-4 py-4">
										<div
											class="grid grid-cols-4 items-center gap-4"
										>
											<Label for="name" class="text-end"
												>Name</Label
											>
											<Textarea
												id="name"
												bind:value={yolo.name}
												class="col-span-3"
											/>
										</div>

										<div
											class="grid grid-cols-4 items-center gap-4"
										>
											<Label for="slug" class="text-end"
												>Slug</Label
											>
											<Input
												disabled
												id="slug"
												bind:value={yolo.slug}
												class="col-span-3"
											/>
										</div>

										<div
											class="grid grid-cols-4 items-center gap-4"
										>
											<Label for="client" class="text-end"
												>Client</Label
											>
											<Select.Root
												type="single"
												name="client"
												bind:value={yolo.client.name}
												required
											>
												<Select.Trigger
													class="w-[200px]"
												>
													{clientSelect.find(
														(f) =>
															f.value ===
															yolo.clientId,
													)?.label ?? "Select Client"}
												</Select.Trigger>
												<Select.Content>
													<Select.Group>
														<Select.Label
															>ClientName</Select.Label
														>
														{#each clientSelect as ys (ys.value)}
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

										<div
											class="grid grid-cols-4 items-center gap-4"
										>
											<Label
												for="description"
												class="text-end"
												>Description</Label
											>
											<Textarea
												id="description"
												bind:value={yolo.description}
												class="col-span-3"
											/>
										</div>

										<div
											class="grid grid-cols-4 items-center gap-4"
										>
											<Label for="year" class="text-end"
												>year</Label
											>
											<Input
												type="number"
												id="year"
												bind:value={yolo.year}
												class="col-span-3"
											/>
										</div>

										<div
											class="grid grid-cols-4 items-center gap-4"
										>
											<Label
												for="poPrice"
												class="text-end">Harga PO</Label
											>
											<Input
												type="number"
												id="poPrice"
												bind:value={yolo.poPrice}
												class="col-span-3"
											/>
										</div>

										<div
											class="grid grid-cols-4 items-center gap-4"
										>
											<Label
												for="poPrice"
												class="text-end">Status</Label
											>
											<Select.Root
												type="single"
												name="status"
												bind:value={yolo.status}
												required
											>
												<Select.Trigger
													class="w-[200px]"
												>
													{yolo.status ??
														"Select Status"}
												</Select.Trigger>
												<Select.Content>
													<Select.Group>
														<Select.Label
															>Status</Select.Label
														>
														<Select.Item
															value="draft"
															label="draft"
														>
															draft
														</Select.Item>
														<Select.Item
															value="planning"
															label="planning"
														>
															planning
														</Select.Item>
														<Select.Item
															value="in progress"
															label="in progress"
														>
															in progress
														</Select.Item>
														<Select.Item
															value="completed"
															label="completed"
														>
															completed
														</Select.Item>
													</Select.Group>
												</Select.Content>
											</Select.Root>
										</div>

										<div
											class="grid grid-cols-4 items-center gap-4"
										>
											<Label
												for="startDate"
												class="text-end"
												>Start Date</Label
											>
											<Input
												type="date"
												id="startDate"
												bind:value={yolo.startDate}
												class="col-span-3"
											/>
										</div>

										<div
											class="grid grid-cols-4 items-center gap-4"
										>
											<Label
												for="isOngoing"
												class="text-end"
												>Ongoing project?</Label
											>
											<Checkbox
												id="isOngoingProject"
												bind:checked={isOngoingProject}
											/>
										</div>

										{#if !isOngoingProject}
											<div
												class="grid grid-cols-4 items-center gap-4"
											>
												<Label
													for="endDate"
													class="text-end"
													>End Date</Label
												>
												<Input
													type="date"
													id="endDate"
													bind:value={yolo.endDate}
													class="col-span-3"
												/>
											</div>
										{/if}

										<section>
											<h3 class="text-center font-bold">
												Project Tasks Display Segment
											</h3>
											<Drawer.Root>
												<Drawer.Trigger
													class={buttonVariants({
														variant: "outline",
													})}
													>Add Tasks</Drawer.Trigger
												>
												<Drawer.Content>
													<Drawer.Header
														class="text-start"
													>
														<Drawer.Title
															>Add tasks</Drawer.Title
														>
														<Drawer.Description>
															add more task to
															display the project
															pictures
														</Drawer.Description>
													</Drawer.Header>
													<form
														class="grid items-start gap-4 px-4"
													>
														<div class="grid gap-2">
															<Label
																for="task-name"
																>Name</Label
															>
															<Input
																type="text"
																id="task-name"
																bind:value={
																	formProjectTasks.name
																}
																placeholder="project task title to shows... example : pekerjaan pemasangan bedeng awal"
															/>
														</div>
														<div class="grid gap-2">
															<Label
																for="task-description"
																>Description</Label
															>
															<Textarea
																id="task-description"
																bind:value={
																	formProjectTasks.description
																}
																placeholder="complete description to tell a story about the images you will show"
															/>
														</div>

														<div class="grid gap-2">
															<Label
																for="task-order"
																>Order Number</Label
															>
															<Input
																type="number"
																id="task-order"
																bind:value={
																	formProjectTasks.order
																}
																placeholder="project task order number"
															/>
														</div>
														<Button
															onclick={() =>
																postCreateProjectTask(
																	{
																		name: formProjectTasks.name,
																		description:
																			formProjectTasks.description,
																		order: formProjectTasks.order,
																	},
																	yolo.id,
																)}
														>
															Save changes
														</Button>
													</form>
													<Drawer.Footer class="pt-2">
														<Drawer.Close
															class={buttonVariants(
																{
																	variant:
																		"outline",
																},
															)}
															>Cancel</Drawer.Close
														>
													</Drawer.Footer>
												</Drawer.Content>
											</Drawer.Root>

											{#if yolo.tasks.length > 0}
												<div class="grid grid-cols-1">
													{#each yolo.tasks as tsk}
														<div
															class="border-2 m-2 p-2 rounded-2xl"
														>
															<div
																class="flex gap-1 mr-auto w-full mx-2 -my-3 justify-end p-2"
															>
																<Drawer.Root>
																	<Drawer.Trigger
																		class={buttonVariants(
																			{
																				variant:
																					"outline",
																			},
																		)}
																		>Edit
																		Tasks</Drawer.Trigger
																	>
																	<Drawer.Content
																	>
																		<Drawer.Header
																			class="text-start"
																		>
																			<Drawer.Title
																				>Edit
																				tasks</Drawer.Title
																			>
																			<Drawer.Description
																			>
																				edit
																				the
																				task
																				to
																				display
																				the
																				project
																				tasks
																				detail
																			</Drawer.Description>
																		</Drawer.Header>
																		<form
																			class="grid items-start gap-4 px-4"
																		>
																			<div
																				class="grid gap-2"
																			>
																				<Label
																					for="task-name"
																					>Name</Label
																				>
																				<Input
																					type="text"
																					id="task-name"
																					bind:value={
																						tsk.name
																					}
																					placeholder="project task title to shows... example : pekerjaan pemasangan bedeng awal"
																				/>
																			</div>
																			<div
																				class="grid gap-2"
																			>
																				<Label
																					for="task-description"
																					>Description</Label
																				>
																				<Textarea
																					id="task-description"
																					bind:value={
																						tsk.description
																					}
																					placeholder="complete description to tell a story about the images you will show"
																				/>
																			</div>

																			<div
																				class="grid gap-2"
																			>
																				<Label
																					for="task-order"
																					>Order
																					Number</Label
																				>
																				<Input
																					type="number"
																					id="task-order"
																					bind:value={
																						tsk.order
																					}
																					placeholder="project task order number"
																				/>
																			</div>
																			<Button
																				onclick={() =>
																					putEditProjectTask(
																						{
																							name: tsk.name,
																							description:
																								tsk.description,
																							order: tsk.order,
																						},
																						tsk.id,
																					)}
																			>
																				Save
																				changes
																			</Button>
																		</form>
																		<Drawer.Footer
																			class="pt-2"
																		>
																			<Drawer.Close
																				class={buttonVariants(
																					{
																						variant:
																							"outline",
																					},
																				)}
																				>Cancel</Drawer.Close
																			>
																		</Drawer.Footer>
																	</Drawer.Content>
																</Drawer.Root>

																<Button
																	variant="destructive"
																>
																	<Trash /> delete</Button
																>
															</div>
															<div class="">
																Task Name :<span
																	class="font-bold"
																	>{tsk.name}</span
																>
																<br />
																Description: {tsk.description}
																<br />
																Order: {tsk.order}
															</div>
															<Separator />
															<div>
																<h3
																	class="font-bold text-center p-2"
																>
																	Task Images
																</h3>

																<Drawer.Root
																	bind:open={
																		drawerOpen
																	}
																>
																	<Drawer.Trigger
																		class={buttonVariants(
																			{
																				variant:
																					"outline",
																			},
																		)}
																	>
																		Add Task
																		Images
																	</Drawer.Trigger>

																	<Drawer.Content
																	>
																		<Drawer.Header
																			class="text-start"
																		>
																			<Drawer.Title
																				>Add
																				Task
																				images</Drawer.Title
																			>
																			<Drawer.Description
																			>
																				add
																				more
																				task
																				images
																				to
																				display
																			</Drawer.Description>
																		</Drawer.Header>

																		<MediaLibrary
																			onSelected={(
																				url: string,
																			) =>
																				captureNewTaskImageUrl(
																					url,
																					tsk.id,
																				)}
																			enableSelect={true}
																		/>

																		<Drawer.Footer
																			class="pt-2"
																		>
																			<Drawer.Close
																				class={buttonVariants(
																					{
																						variant:
																							"outline",
																					},
																				)}
																				>Cancel</Drawer.Close
																			>
																		</Drawer.Footer>
																	</Drawer.Content>
																</Drawer.Root>

																{#if tsk.images.length > 0}
																	<div
																		class="grid grid-cols-4 gap-2"
																	>
																		{#each tsk.images as mediaTask}
																			<!-- transparant  -->
																			<img
																				src={mediaTask
																					.media
																					?.url ??
																					"https://placehold.co/300x300?text=No+Image+/cms/project-task-images"}
																				alt={mediaTask
																					.media
																					?.altText ??
																					"no data"}
																				class="mx-auto h-[100px] opacity-50"
																			/>
																		{/each}
																	</div>
																{:else}
																	<div>
																		<Empty.Root
																			class="opacity-35"
																		>
																			<Empty.Header
																			>
																				<Empty.Media
																					variant="icon"
																				>
																					<FolderCode
																					/>
																				</Empty.Media>
																				<!-- <Empty.Title>Project Media</Empty.Title> -->
																				<Empty.Description
																					>No
																					Images
																					found</Empty.Description
																				>
																			</Empty.Header>
																			<Empty.Content
																			>
																				Add
																				more
																				image
																				using
																				add
																				button
																			</Empty.Content>
																		</Empty.Root>
																	</div>
																{/if}
															</div>
														</div>
													{/each}
												</div>
											{:else}
												<Empty.Root class="opacity-35">
													<Empty.Header>
														<Empty.Media
															variant="icon"
														>
															<FolderCode />
														</Empty.Media>
														<!-- <Empty.Title>Project Media</Empty.Title> -->
														<Empty.Description
															>No task found</Empty.Description
														>
													</Empty.Header>
													<Empty.Content>
														Add more task using add
														button
													</Empty.Content>
												</Empty.Root>
											{/if}
										</section>

										<ScrollArea class="">
											<div>
												<h2
													class="text-center font-bold mx-auto p-2"
												>
													Main Display for Project
													Medias
												</h2>
												<Button>add more image</Button>
											</div>
											{#if yolo.projectMedias.length > 0}
												<div
													class="grid grid-cols-4 gap-1 p-2"
												>
													{#each yolo.projectMedias as xyz}
														<!-- transparant  -->
														<img
															src={xyz.media
																?.url ??
																"https://placehold.co/300x300?text=No+Image+/cms/project"}
															alt={xyz.media
																?.altText ??
																"no data"}
															class="mx-auto h-[100px] opacity-50"
														/>
													{/each}
												</div>
											{:else}
												<Empty.Root class="opacity-35">
													<Empty.Header>
														<Empty.Media
															variant="icon"
														>
															<ImageIcon />
														</Empty.Media>
														<!-- <Empty.Title>Project Media</Empty.Title> -->
														<Empty.Description
															>No image found</Empty.Description
														>
													</Empty.Header>
													<Empty.Content>
														Add more image using add
														button
													</Empty.Content>
												</Empty.Root>
											{/if}
										</ScrollArea>
									</div>
								</section>

								<Dialog.Footer>
									<Button
										disabled={isProcessing}
										onclick={() => {
											putUpdateProject(yolo.id, {
												name: yolo.name,
												// clientId: yolo.clientId,
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
							open={deleteDialog.open &&
								deleteDialog.id === yolo.id}
						>
							<AlertDialog.Trigger
								onclick={() => {
									deleteDialog.open = true;
									deleteDialog.id = yolo.id;
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
										onclick={async () =>
											deleteProject(yolo.id)}
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

				<h2>{yolo.name}</h2>
				{#if yolo.projectMedias.length > 0}
					<div class="grid grid-cols-2 gap-2 overflow-x-auto">
						{#each yolo.projectMedias as gambar}
							<img
								src={gambar?.media?.url ??
									"https://placehold.co/400x400?text=No+Image+/cms/client"}
								alt={gambar?.media?.altText ?? "No image"}
								class="w-[350px] object-cover"
							/>
						{/each}
					</div>
				{:else}
					<Empty.Root class="opacity-35">
						<Empty.Header>
							<Empty.Media variant="icon">
								<ImageIcon />
							</Empty.Media>
							<!-- <Empty.Title>Project Media</Empty.Title> -->
							<Empty.Description>No image found</Empty.Description
							>
						</Empty.Header>
						<Empty.Content>
							Add more image using edit button
						</Empty.Content>
					</Empty.Root>
				{/if}
			</div>
		{/each}
	</div>
</section>
