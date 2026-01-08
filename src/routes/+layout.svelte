<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.ico";
	import { onMount } from "svelte";

	import Footer from "./footer.svelte";
	import { MetaTags } from "svelte-meta-tags";
	import { page } from "$app/state";
	import { slide } from "svelte/transition";

	///////// components start /////
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import * as Select from "$lib/components/ui/select/index.js";
	import Button from "$lib/components/ui/button/button.svelte";

	import { Menu, X } from "@lucide/svelte";
	///////// components end /////

	// select data start ///
	import { language } from "$lib/localstorage";

	const languageSelect = [
		{ value: "id", label: "Bahasa Indonesia" },
		{ value: "en", label: "English" },
	];

	let languageSelectValue = $state($language);

	const triggerContent = $derived(
		languageSelect.find((f) => f.value === languageSelectValue)?.label ??
			"Select a language",
	);

	// store → select
	$effect(() => {
		// console.log({ languageSelectValue });
		if ($language !== languageSelectValue) {
			// console.log({ languageSelectValue, $language });

			language.set(languageSelectValue);
			location.reload(); // force page reload after changing language
		}
	});

	// select → store
	// select data end ///

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
  "logo": "https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/logo_600X600.png",
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
	title="PT. Metrindo Maju Persada | General Contractor"
	description="Jasa konstruksi mekanikal elektrikal plumbing sipil telekomunikasi"
	openGraph={{
		type: "website",
		url: page.url.href,
		title: "PT. Metrindo Maju Persada",
		description:
			"Sejak 1997, PT. Metrindo Maju Persada telah menjadi mitra terpercaya dalam menghadirkan solusi konstruksi terpadu untuk proyek komersial,  infrastruktur dan residensial. Dengan komitmen terhadap kualitas, inovasi, dan ketepatan waktu, kami siap mewujudkan setiap visi anda.",
		siteName: "Metrindo Maju Persada",
		images: [
			{
				url: "https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/logo_600X600.png",
				alt: "logo metrindo",
				width: 600,
				height: 600,
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
						src="https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/logo-horizontal.png"
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
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2">
					<Select.Root
						type="single"
						name="language"
						bind:value={languageSelectValue}
					>
						<Select.Trigger class="w-[120px] ">
							<span class="truncate">{triggerContent}</span>
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Language</Select.Label>
								{#each languageSelect as slct (slct.value)}
									<Select.Item
										value={slct.value}
										label={slct.label}
									>
										{slct.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>

					<Button
						class="font-bold hidden md:flex"
						href="https://wa.me/62816878368?text=Halo,%20saya%20dapat%20informasi%20dari%20website%20metrindomp.com"
						target="_blank"
					>
						Hubungi Kami
					</Button>
				</div>
				<!-- Mobile button -->
				<div class="md:hidden">
					<button
						class=" inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-gray-100 dark:text-muted-foreground dark:hover:bg-gray-800"
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
