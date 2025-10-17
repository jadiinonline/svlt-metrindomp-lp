<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { Menu, X } from "@lucide/svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Footer from "./footer.svelte";
	let isOpen = $state(false);

	const navItems = [
		{
			name: "Tentang Kami",
			href: "/#tentang-kami",
		},
		{
			name: "Visi Misi",
			href: "/#visi-misi",
		},
		{
			name: "Services",
			href: "/services",
		},
		{
			name: "Projects",
			href: "/projects",
		},
	];

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen max-w-screen overflow-x-hidden">
	<!-- navbar -->

	<nav class="fixed w-full top-0 z-50 bg-white shadow-xl dark:bg-gray-900">
		<div class="mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<!-- Logo -->
				<a
					href="/"
					class="text-xl font-bold text-gray-900 dark:text-white"
				>
					MetrindoMP
				</a>

				<!-- Desktop Menu -->
				<div class="hidden md:flex items-center xl:space-x-6 space-x-4">
					{#each navItems as item}
						<a
							href={item.href}
							class="text-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-white"
						>
							{item.name}
						</a>
					{/each}

					<Button class="font-bold">Hubungi Kami</Button>
				</div>

				<!-- Mobile button -->
				<button
					class="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-gray-100 dark:text-muted-foreground dark:hover:bg-gray-800"
					onclick={() => (isOpen = !isOpen)}
				>
					{#if isOpen}
						<X class="w-6 h-6" />
					{:else}
						<Menu class="w-6 h-6" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if isOpen}
			<div class="md:hidden px-2 pt-2 pb-3 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 dark:text-muted-foreground dark:hover:bg-gray-800"
					>
						{item.name}
					</a>
				{/each}
			</div>
		{/if}
	</nav>

	<!-- main content -->
	<main class="mx-8">
		{@render children?.()}
	</main>

	<div class="">
		<Footer></Footer>
	</div>
</div>
