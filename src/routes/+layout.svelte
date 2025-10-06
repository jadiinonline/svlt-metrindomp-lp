<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { Menu, X } from "@lucide/svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	let isOpen = $state(false);

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- navbar -->

<nav class="sticky top-0 z-50 bg-white shadow-xl dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="text-xl font-bold text-gray-900 dark:text-white">
				MetrindoMP
			</a>

			<!-- Desktop Menu -->
			<div class="hidden md:flex items-center xl:space-x-6 space-x-4">
				<a
					href="/tentang-kami"
					class="text-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-white"
				>
					Tentang Kami
				</a>
				<a
					href="/visi-misi"
					class="text-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-white"
				>
					Visi Misi
				</a>
				<a
					href="/services"
					class="text-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-white"
				>
					Services
				</a>
				<a
					href="/projects"
					class="text-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-white"
				>
					Projects
				</a>

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
			<a
				href="/"
				class="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 dark:text-muted-foreground dark:hover:bg-gray-800"
			>
				Home
			</a>

			<a
				href="/tentang-kami"
				class="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 dark:text-muted-foreground dark:hover:bg-gray-800"
			>
				Tentang Kami
			</a>

			<a
				href="/visi-misi"
				class="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 dark:text-muted-foreground dark:hover:bg-gray-800"
			>
				Visi Misi
			</a>

			<a
				href="/projects"
				class="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 dark:text-muted-foreground dark:hover:bg-gray-800"
			>
				Projects
			</a>
		</div>
	{/if}
</nav>

<!-- main content -->
<main class="m-8">
	{@render children?.()}
</main>
