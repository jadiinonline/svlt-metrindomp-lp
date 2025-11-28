<script lang="ts">
	let { children } = $props();
	import { NAV_ITEMS } from "./nav";
	import { page } from "$app/state";
	import Button from "$lib/components/ui/button/button.svelte";
	import { LogOut } from "@lucide/svelte";

	let mobileSidebarOpen = $state(false);

	function toggleSidebar() {
		mobileSidebarOpen = !mobileSidebarOpen;
	}
	function closeSidebar() {
		mobileSidebarOpen = false;
	}
</script>

<div class="flex min-h-screen -mx-8">
	<!-- Mobile navbar -->
	<!-- Floating Mobile Navbar (sits below main navbar) -->
	<div
		class="
		md:hidden
		fixed right-20
		top-[3px]
		z-[51]
		bg-background
		shadow-xl
		rounded-xl
		border
		p-2
		flex items-center gap-3
		hover:bg-accent
	"
	>
		<button onclick={toggleSidebar} class="p-2 rounded">
			☰ <span class="font-semibold whitespace-nowrap">CMS Menu</span>
		</button>
	</div>

	<!-- Sidebar -->
	<aside
		class="
			fixed md:static inset-y-0 left-0 w-64
			bg-muted backdrop-blur-md border-r
			transform transition-transform duration-300 z-40
			{mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
		"
	>
		<nav class="p-4 space-y-3 pt-20 md:pt-5">
			{#each NAV_ITEMS as item}
				{#if item.children}
					<div
						class="text-xs font-semibold opacity-70 mt-4 mb-1 underline"
					>
						{item.label}
					</div>

					{#each item.children as child}
						<a
							href={child.href}
							class="
								block px-3 py-2 rounded-lg text-sm
								hover:bg-primary/25
								{page.url.pathname === child.href ? 'bg-primary/20 font-semibold' : ''}
							"
							onclick={closeSidebar}
						>
							{child.label}
						</a>
					{/each}
				{:else}
					<a
						href={item.href}
						class="
							block px-3 py-2 rounded-lg text-sm
							hover:bg-primary/25
							{page.url.pathname === item.href ? 'bg-primary/20 font-semibold' : ''}
						"
					>
						{item.label}
					</a>
				{/if}
			{/each}
		</nav>

		<Button variant="destructive" class="mx-auto flex"
			><LogOut /> Log Out</Button
		>
	</aside>

	<!-- Content -->
	<main class="flex-1 py-10">
		{@render children?.()}
	</main>

	<!-- Mobile overlay -->
	{#if mobileSidebarOpen}
		<button
			class="fixed inset-0 bg-black/50 md:hidden mt-16"
			onclick={() => (mobileSidebarOpen = false)}
			><span class="opacity-0">button need text, ignore this</span
			></button
		>
	{/if}
</div>
