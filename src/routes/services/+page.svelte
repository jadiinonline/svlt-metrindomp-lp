<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog/index.js";

	import { Building, Wrench, DraftingCompass, Users } from "@lucide/svelte";

	let { data } = $props();

	// console.log(companies);
	let services = $state(data.services.serviceCategories ?? []);
</script>

<div class="pt-10">
	{#each services as service}
		<div class="flex justify-between mb-10">
			<Button>prev</Button>
			<Button>next</Button>
		</div>
		<h1 class="uppercase font-bold text-center text-6xl text-primary">
			{service.name}
		</h1>
		<div class="grid grid-cols-2 gap-4 my-10">
			<img src={service.imageLink} alt="service" class="w-full" />

			<h2
				class="self-center text-2xl text-muted-foreground p-4 rounded-2xl outline-4"
			>
				{service.description}
			</h2>
		</div>

		<h3 class="text-center text-2xl">Service Related Projects</h3>
		<div class="grid grid-cols-3 gap-4">
			{#each service.projects as ea}
				<Dialog.Root>
					<Dialog.Trigger>
						<div
							class="p-4 border rounded-lg hover:border-primary hover:border-4"
						>
							<h4 class="text-right text-muted-foreground">
								{ea.client.name}
							</h4>
							<h4 class="font-semibold text-lg mb-2">
								{ea.name}
							</h4>

							<div
								class="w-full h-[200px] overflow-hidden rounded-md"
							>
								<img
									src={ea.projectImages?.[0]?.imageLink ??
										"https://placehold.co/600x400/png?text=No+Image+found"}
									alt="projects thumbnail"
									class="w-full h-full object-cover object-center"
								/>
							</div>
						</div>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>
								{ea.name}
								<span class="text-muted-foreground"
									>({ea.year ?? "abad 21"})
								</span></Dialog.Title
							>
							<Dialog.Description>
								{ea.description}

								<div class="grid grid-cols-3 gap-4">
									{#each ea.projectImages as img}
										<img
											src={img.imageLink}
											alt="list of projects documentation"
											class="w-full my-2"
										/>
									{/each}
								</div>
							</Dialog.Description>
						</Dialog.Header>
					</Dialog.Content>
				</Dialog.Root>
			{/each}
		</div>
	{/each}
</div>
