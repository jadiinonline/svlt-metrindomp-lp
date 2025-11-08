<script lang="ts">
	import { toTitleCase } from "$lib/utils/utils";

	// component and icons
	import { Button } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import {
		Building,
		Wrench,
		DraftingCompass,
		Users,
		ArrowLeft,
		ArrowRight,
	} from "@lucide/svelte";

	let { data } = $props();

	// console.log(companies);
	let services = $state(data.services.serviceCategories ?? []);

	let nextpage = $state(data.services.pageNext ?? 1);
	let previouspage = $state(data.services.pagePrevious ?? 1);

	// console.log({ nextpage, previouspage });

	async function refetchServices(page: number) {
		try {
			const res = await fetch(
				`/api/service-category/with-project?limit=1&page=${page}`,
				{
					headers: {
						// authorization: `Bearer ${token}`,
						accept: "application/json",
					},
				},
			);

			if (!res.ok) throw new Error("Failed to fetch services");

			const responseData = await res.json();

			console.log({ responseData });
			// Update the Svelte store
			services = responseData.serviceCategories ?? [];
			nextpage = responseData.pageNext ?? 1;
			previouspage = responseData.pagePrevious ?? 1;
		} catch (error) {
			console.error("Error fetching services:", error);
		}
	}
</script>

{#if services.length === 0}
	<p class="text-center text-muted-foreground py-20">
		Tidak ada layanan yang tersedia saat ini. Database masih kosong
	</p>
{:else}
	<div class="pt-10">
		{#each services as service}
			<div class="flex justify-between mb-10">
				<Button
					variant="outline"
					onclick={() => refetchServices(previouspage)}
				>
					<ArrowLeft /></Button
				>
				<h1
					class="uppercase font-bold text-center text-3xl xl:text-6xl text-primary"
				>
					{service.name}
				</h1>
				<Button
					variant="outline"
					onclick={() => refetchServices(nextpage)}
				>
					<ArrowRight /></Button
				>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
				<img src={service.imageLink} alt="service" class="w-full" />

				<h2 class="self-center text-2xl text-muted-foreground p-4">
					{service.description}
				</h2>
			</div>

			<Separator class="my-10" />
			<h3 class="text-center text-2xl font-bold text-muted-foreground">
				List Proyek {toTitleCase(service.name)}
			</h3>
			<div
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr"
			>
				{#each service.projects as ea}
					<Dialog.Root>
						<Dialog.Trigger>
							<div
								class="p-4 border rounded-lg hover:border-primary hover:border-4"
							>
								<h4
									class="text-right text-muted-foreground font-bold"
								>
									{ea.client.name}
								</h4>
								<h4
									class="font-semibold text-lg mb-2 line-clamp-2"
								>
									{ea.name}
									<span class="text-muted-foreground text-sm"
										>({ea.location})</span
									>
								</h4>

								<div
									class="w-full h-[200px] overflow-hidden rounded-md"
								>
									<img
										src={ea.projectImages?.find(
											(img: any) => img.isCover === true,
										)?.imageLink ??
											"https://placehold.co/600x400/png?text=No+Cover+Image+found"}
										alt="projects thumbnail"
										class="w-full h-full object-cover object-center"
									/>
								</div>
							</div>
						</Dialog.Trigger>
						<Dialog.Content class="min-w-[90vw] max-h-[95vh] ">
							<Dialog.Header>
								<Dialog.Title>
									{ea.name}
									<span class="text-muted-foreground"
										>({ea.year ?? "abad 21"})
									</span>
								</Dialog.Title>
								<Dialog.Description>
									<h4>
										{ea.location} | Rp. {Number(
											ea.poPrice,
										).toLocaleString("id-ID")}
									</h4>

									<p class="my-4 text-sm">{ea.description}</p>
									<h5 class="font-bold mb-2">
										Gallery Proyek
										<ScrollArea
											class="h-[400px] w-full mt-2 p-2 border rounded-md"
										>
											<div
												class="grid grid-cols-1 lg:grid-cols-3 gap-4"
											>
												{#each ea.projectImages as img}
													<img
														src={img.imageLink}
														alt="list of projects documentation"
														class="w-[600px] my-2"
													/>
												{/each}
											</div>
										</ScrollArea>
									</h5></Dialog.Description
								>
							</Dialog.Header>
						</Dialog.Content>
					</Dialog.Root>
				{/each}
			</div>
		{/each}
	</div>
{/if}
