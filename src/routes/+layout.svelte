<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.png";
	import { Menu, X } from "@lucide/svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Footer from "./footer.svelte";
	import { MetaTags } from "svelte-meta-tags";
	import { page } from "$app/state";
	import { slide } from "svelte/transition";
	import Separator from "$lib/components/ui/separator/separator.svelte";

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
			href: "/#layanan-kami",
		},
		{
			name: "Projects",
			href: "/#projects-list",
		},
	];

	const jsonLDServices = [
		{
			name: "Mekanikal",
			description:
				"Layanan mekanikal profesional untuk proyek konstruksi dan subkon jasa konstruksi.",
		},
		{
			name: "Elektrikal",
			description:
				"Jasa elektrikal untuk konstruksi dan subkon jasa konstruksi.",
		},
		{
			name: "Plumbing",
			description:
				"Layanan plumbing untuk konstruksi dan subkon jasa konstruksi.",
		},
		{
			name: "Telekomunikasi",
			description:
				"Solusi telekomunikasi untuk konstruksi dan subkon jasa konstruksi.",
		},
		{
			name: "Sipil",
			description:
				"Jasa konstruksi sipil untuk proyek gedung, jalan, jembatan, dan infrastruktur.",
		},
	];

	// disable right click on image
	if (typeof window !== "undefined") {
		document.addEventListener("contextmenu", (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target && target.tagName === "IMG") {
				e.preventDefault();
			}
		});
	}

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Structured Data JSON-LD -->
{@html `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Metrindo Maju Persada",
  "url": "https://metrindomp.com",
  "logo": "https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/LOGO-HORIZONTAL.png",
  "sameAs": [],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Layanan Konstruksi",
    "itemListElement": [
      ${jsonLDServices
			.map(
				(s) => `{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "${s.name}",
          "description": "${s.description}"
        }
      }`,
			)
			.join(",")}
    ]
  }
}
</script>`}

<MetaTags
	title="PT. Metrindo Maju Persada - Jasa konstruksi & subkon"
	description="Jasa konstruksi mekanikal elektrikal plumbing sipil telekomunikasi"
	openGraph={{
		type: "website",
		url: page.url.href,
		title: "PT. Metrindo Maju Persada",
		description:
			"Sejak 1997, Metrindo Maju Persada telah menjadi mitra terpercaya dalam menghadirkan solusi konstruksi terpadu untuk proyek komersial,  infrastruktur dan residensial. Dengan komitmen terhadap kualitas, inovasi, dan ketepatan waktu, kami siap mewujudkan setiap visi anda.",
		siteName: "Metrindo Maju Persada",
		images: [
			{
				url: "https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/LOGO-HORIZONTAL.png",
				alt: "logo metrindo",
				width: 1700,
				height: 630,
			},
		],
	}}
/>

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
					<img
						src="LOGO-HORIZONTAL.png"
						alt="logo"
						class="h-[60px]"
					/>
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

					<Button
						class="font-bold"
						href="https://wa.me/62811111111"
						target="_blank"
					>
						Hubungi Kami
					</Button>
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
			<Separator class="opacity-55 "></Separator>
			<div
				transition:slide={{ duration: 250 }}
				class="md:hidden px-2 pt-2 pb-3 space-y-1"
			>
				{#each navItems as item}
					<a
						href={item.href}
						class="block px-3 py-2 rounded-md text-foreground hover:bg-gray-100 dark:text-muted-foreground dark:hover:bg-gray-800"
						onclick={() => (isOpen = !isOpen)}
					>
						{item.name}
					</a>
				{/each}
			</div>
		{/if}
	</nav>

	<!-- main content -->
	<main class="mx-8 pt-16 max-w-screen">
		{@render children?.()}
	</main>

	<div class="">
		<Footer></Footer>
	</div>
</div>
