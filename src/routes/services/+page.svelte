<script lang="ts">
	import { Building, Wrench, DraftingCompass, Users } from "@lucide/svelte";
	import Button from "$lib/components/ui/button/button.svelte";

	const services = [
		{
			id: "construction",
			icon: Building,
			title: "General Construction",
			description:
				"We provide top-tier general construction services for both residential and commercial projects, ensuring quality from foundation to finish.",
		},
		{
			id: "renovation",
			icon: Wrench,
			title: "Renovation & Remodeling",
			description:
				"Transform your space with our expert renovation and remodeling services. We bring your vision to life with precision and care.",
		},
		{
			id: "design",
			icon: DraftingCompass,
			title: "Engineering Design",
			description:
				"Our experienced engineers provide innovative and practical design solutions for structural, civil, and mechanical systems.",
		},
		{
			id: "management",
			icon: Users,
			title: "Project Management",
			description:
				"From initial planning to final delivery, our project management team ensures your project is completed on time and within budget.",
		},
	];

	const projects = [
		{
			id: "proj-1",
			title: "Downtown High-Rise",
			serviceId: "construction",
			image: "https://placehold.co/800x800",
			description:
				"A 40-story commercial office building constructed with cutting-edge materials and techniques.",
		},
		{
			id: "proj-2",
			title: "Suburban Villa Remodel",
			serviceId: "renovation",
			image: "https://placehold.co/800x800",
			description:
				"Complete interior and exterior renovation of a luxury residential villa, including landscaping.",
		},
		{
			id: "proj-3",
			title: "Industrial Park Design",
			serviceId: "design",
			image: "https://placehold.co/800x800",
			description:
				"Structural and civil engineering design for a 200-acre industrial park development.",
		},
		{
			id: "proj-4",
			title: "Bridge Construction Management",
			serviceId: "management",
			image: "https://placehold.co/800x800",
			description:
				"Oversaw the entire lifecycle of a major city bridge project, ensuring on-time, on-budget delivery.",
		},
		{
			id: "proj-5",
			title: "Historic Building Restoration",
			serviceId: "renovation",
			image: "https://placehold.co/800x800",
			description:
				"Painstaking restoration of a century-old landmark, preserving its historical integrity.",
		},
		{
			id: "proj-6",
			title: "Shopping Mall Construction",
			serviceId: "construction",
			image: "https://placehold.co/800x800",
			description:
				"Lead contractor for a new 500,000 sq. ft. regional shopping center.",
		},
	];

	function getProjectsForService(serviceId: string) {
		return projects.filter((p) => p.serviceId === serviceId);
	}
</script>

<svelte:head>
	<title>Our Services & Projects - MetrindoMP</title>
	<meta
		name="description"
		content="Explore the range of construction and engineering services offered by PT. Metrindo Majupersada."
	/>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<h1 class="text-4xl font-bold text-center mb-4">Our Services & Work</h1>
	<p
		class="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto"
	>
		We offer a comprehensive range of services, each backed by a portfolio
		of successfully completed projects. Explore our expertise below.
	</p>

	<div class="space-y-16">
		{#each services as service}
			<section id={service.id} class="scroll-mt-20">
				<div class="flex items-start gap-4 mb-4">
					<svelte:component
						this={service.icon}
						class="w-10 h-10 text-primary flex-shrink-0 mt-1"
					/>
					<div>
						<h2 class="text-3xl font-bold">{service.title}</h2>
						<p class="mt-2 text-lg text-muted-foreground">
							{service.description}
						</p>
					</div>
				</div>
				<h3
					class="text-xl font-semibold text-card-foreground mt-8 mb-4"
				>
					Related Projects:
				</h3>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{#each getProjectsForService(service.id) as project (project.id)}
						<div
							class="bg-card border border-border rounded-lg shadow-md overflow-hidden"
						>
							<img
								src={project.image}
								alt={project.title}
								class="w-full h-48 object-cover"
							/>
							<div class="p-6">
								<h2
									class="text-2xl font-semibold mb-2 text-card-foreground"
								>
									{project.title}
								</h2>
								<p class="text-muted-foreground">
									{project.description}
								</p>
							</div>
						</div>
					{:else}
						<p
							class="text-muted-foreground md:col-span-2 lg:col-span-3"
						>
							No projects to display for this service yet.
						</p>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</div>
