<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import Autoplay from "embla-carousel-autoplay";

	import {
		CalendarCheck,
		Laugh,
		MessageSquareText,
		ShieldCheck,
	} from "@lucide/svelte";

	const companyYear = 1997;

	const clients = [
		{
			name: "PT. Wijaya Karya",
			logo: "https://storage.googleapis.com/jadiinonline-public/metrindomp/clients/logo-wika.png",
		},
		{
			name: "PT. Waskita Karya",
			logo: "https://storage.googleapis.com/jadiinonline-public/metrindomp/clients/logo-waskita.png",
		},
		{
			name: "PT. Jaya Konstruksi",
			logo: "https://storage.googleapis.com/jadiinonline-public/metrindomp/clients/logo-jakon.jpeg",
		},
		{
			name: "PT. Patra Badak Arun Solusi",
			logo: "https://storage.googleapis.com/jadiinonline-public/metrindomp/clients/logo-pbas.png",
		},
		{
			name: "PT. Hutama Karya",
			logo: "https://storage.googleapis.com/jadiinonline-public/metrindomp/clients/logo-hutamakarya.png",
		},
		{
			name: "PT. Inti Bangun Persada",
			logo: "https://storage.googleapis.com/jadiinonline-public/metrindomp/clients/logo-intibangun.png",
		},
	];

	const paginatedProjects = [
		{
			title: "Revitalizing Construction",
			images: [
				"http://placehold.co/100x100",
				"http://placehold.co/100x100",
				"http://placehold.co/100x100",
			],
			description: "project ini jatuh pada ",
			location: "Jakarta, Indonesia",
			categories: ["civil", "mechanical"],
		},
		{
			title: "Apartemen 48",
			images: [
				"http://placehold.co/100x100",
				"http://placehold.co/100x100",
				"http://placehold.co/100x100",
			],
			description: "project ini jatuh pada ",
			location: "Cikarang, Indonesia",
			categories: ["civil", "mechanical", "elektrikal"],
		},
	];

	const layanan = [
		{
			img: "https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/icon-mechanical-engineering.png",
			alt: "Mechanical",
			title: "Mekanikal",
			description:
				"Layanan mekanikal kami mencakup instalasi, pemeliharaan, dan perbaikan sistem mekanikal untuk berbagai jenis bangunan dan industri.",
		},
		{
			img: "https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/icon-electrical-engineering.png",
			alt: "Electrical",
			title: "Elektrikal",
			description:
				"Kami menyediakan solusi elektrikal lengkap, mulai dari perencanaan, instalasi jaringan listrik, hingga sistem kontrol dan otomatisasi.",
		},
		{
			img: "https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/icon-civil-engineering.png",
			alt: "Civil",
			title: "Sipil",
			description:
				"Layanan sipil kami meliputi pembangunan infrastruktur, struktur bangunan, dan pekerjaan tanah dengan standar kualitas tertinggi.",
		},
		{
			img: "https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/icon-telecommunication-engineering.png",
			alt: "Telecommunication",
			title: "Telekomunikasi",
			description:
				"Layanan telekomunikasi kami meliputi pemasangan tower, pemasangan kabel FO ",
		},
	];
</script>

<div class="flex flex-col space-y-7">
	<section
		id="hero"
		class="relative bg-[url('https://images.unsplash.com/photo-1712758602405-f8aa7de86cef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center w-screen xl:w-[99.1vw] xl:-mx-8 p-2 xl:p-20"
	>
		<div
			class="absolute inset-0 bg-gradient-to-r from-white to-transparent"
		></div>

		<div class="relative flex flex-col space-y-3 p-8 xl:w-[60%]">
			<h2
				class="italic font-bold text-3xl bg-black text-white w-[400px] text-center p-2 rounded-sm"
			>
				"Quality & Schedule"
			</h2>

			<h1 class="uppercase text-4xl lg:text-8xl font-bold text-shadow-md">
				general contractor & <br />engineering services
			</h1>

			<p class="text-2xl">
				PT. Metrindo Majupersada menyediakan layanan <b>konstruksi</b> untuk
				proyek menengah hingga besar. Perusahaan ini dikenal dengan kemampuan
				menjaga kualitas, kepuasan pelanggan, dan hubungan baik dengan para
				mitra kerja. Keberhasilan ini didukung oleh tenaga ahli yang kompeten
				di bindangnya
			</p>

			<Button class="right-0 w-[200px] text-lg " size="lg">
				Konsultasi Gratis <MessageSquareText />
			</Button>
		</div>
	</section>

	<Separator></Separator>

	<section id="tentang-kami" class="m-2">
		<div
			class="grid md:grid-cols-2 space-x-8 items-center justify-between w-full"
		>
			<div class=" flex-shrink-0">
				<img
					src="https://plus.unsplash.com/premium_photo-1661921393343-343742700dd3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="section2"
					class="rounded-lg"
				/>
			</div>

			<div class="">
				<div class="flex space-x-4 items-center justify-self-start">
					<div class="text-primary font-extrabold text-8xl">
						{companyYear}
					</div>

					<Separator orientation="vertical" class="w-[200px]" />

					<div class="flex flex-col space-y-2">
						<div class="text-muted-foreground text-2xl">
							27 years of experience
						</div>
						<div class="text-4xl font-bold uppercase">
							success in experience
						</div>
					</div>
				</div>

				<p class="text-2xl p-2">
					<b>PT. Metrindo Majupersada</b> adalah perusahaan yang
					bergerak di bidang konstruksi dan layanan engineering.
					Berdiri pada tahun 1997, perusahaan kami didirikan dengan
					tujuan untuk mengembangkan bisnis yang telah ada sebelumnya.
					Pendirian perusahaan disahkan melalui akta pendirian
					perubahaan no. 64 pada 17 November 2008. <br />Seiring
					berjalannya waktu, PT. Metrindo Majupersada semakin
					dipercaya oleh berbagai perusahaan besar di sektor
					mekanikal, elektrikal dan sipil. Beberapa di antaranya PT.
					Waskita Karya, PT. Jaya Konstruksi, PT. Wijaya Karya.
					Perusahaan ini telah berhasil mengerjakan proyek proyek
					penting di seluruh Indonesia, termasuk Bandara Gorontalo,
					Bandara Soekarno-Hatta, dan kantor DPRD Riau. Dengan moto
					"Quality & Schedule", perusahaan ini terus berupaya
					memberikan hasil terbaik
				</p>
			</div>
		</div>
	</section>

	<Separator></Separator>

	<section class="bg-accent w-screen -mx-8 p-8">
		<h2 class="text-center font-bold text-4xl">Our Reputation</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
			<div class="bg-white p-6 rounded-lg shadow-md">
				<ShieldCheck class="text-primary" />
				<h3 class="text-xl font-semibold mb-2">Kualitas Terjamin</h3>
				<p class="text-muted-foreground">
					Kami selalu mengedepankan kualitas terbaik dalam setiap
					proyek yang kami kerjakan, memastikan hasil yang memuaskan
					dan tahan lama.
				</p>
			</div>
			<div class="bg-white p-6 rounded-lg shadow-md">
				<CalendarCheck class="text-primary" />
				<h3 class="text-xl font-semibold mb-2">Ketepatan Waktu</h3>
				<p class="text-muted-foreground">
					Komitmen kami terhadap jadwal proyek adalah prioritas. Kami
					memastikan setiap pekerjaan selesai tepat waktu sesuai
					kesepakatan.
				</p>
			</div>
			<div class="bg-white p-6 rounded-lg shadow-md">
				<Laugh class="text-primary" />

				<h3 class="text-xl font-semibold mb-2">Kepuasan Pelanggan</h3>
				<p class="text-muted-foreground">
					Hubungan baik dengan klien adalah kunci. Kami selalu
					berusaha memahami dan memenuhi kebutuhan pelanggan untuk
					mencapai kepuasan maksimal.
				</p>
			</div>
		</div>
	</section>

	<section id="visi-misi" class="m-2">
		<h2 class="text-center font-extrabold text-6xl mb-8">
			Quality & Schedule
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-1 gap-8">
			<div class="flex flex-row items-center">
				<div class=" p-8 flex flex-col items-center text-center">
					<div class="relative w-full h-full">
						<img
							src="https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/worker-beta.jpeg"
							alt="visi"
							class="absolute top-0 left-0 z-1 w-[30%] h-auto rounded-2xl border-white border-6"
						/>
						<div class="p-10">
							<img
								src="https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/worker-alpha.png"
								alt="visi"
								class="relative z-0 w-[70%] h-[70%] my-auto mx-auto rounded-2xl border-white border-6"
							/>
						</div>
						<img
							src="https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/worker-charlie.jpg"
							alt="visi"
							class="absolute bottom-0 right-0 z-1 w-[40%] h-auto rounded-2xl border-white border-6"
						/>
					</div>
				</div>
				<div class=" p-8 flex flex-col items-center text-center">
					<h3 class="text-3xl font-bold mb-4 text-primary">Visi</h3>
					<ul
						class="list-disc list-inside text-left text-lg space-y-2"
					>
						<li>
							Menjadi perusahaan konstruksi mekanikal dan
							elektrikal yang unggul dalam kualitas dan ketepatan
							waktu.
						</li>
						<li>
							Memberikan hasil kerja terbaik melalui standar mutu
							yang tinggi di setiap proyek.
						</li>
						<li>
							Membangun hubungan jangka panjang dengan klien
							berdasarkan kepercayaan dan integritas.
						</li>
						<li>
							Menjadi mitra terpercaya dalam pembangunan
							infrastruktur dengan komitmen terhadap efisiensi dan
							profesionalisme.
						</li>
						<li>
							Mewujudkan kepercayaan pelanggan melalui
							penyelesaian proyek yang tepat waktu dan sesuai
							spesifikasi.
						</li>
					</ul>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-1 gap-8">
				<div class="flex flex-row items-center">
					<div class=" p-8 flex flex-col items-center text-center">
						<h3 class="text-3xl font-bold mb-4 text-primary">
							Misi
						</h3>
						<ul
							class="list-disc list-inside text-left text-lg space-y-2"
						>
							<li>
								Memberikan hasil kerja berkualitas tinggi
								melalui penerapan standar teknis dan prosedur
								kerja terbaik.
							</li>
							<li>
								Menyelesaikan setiap proyek tepat waktu dengan
								perencanaan yang efisien dan koordinasi yang
								efektif.
							</li>
							<li>
								Meningkatkan kompetensi sumber daya manusia
								melalui pelatihan berkelanjutan dan budaya kerja
								profesional.
							</li>
							<li>
								Menjaga keselamatan kerja serta memastikan
								lingkungan kerja yang aman dan produktif.
							</li>
							<li>
								Mengutamakan kepuasan dan kepercayaan pelanggan
								melalui komunikasi yang transparan dan pelayanan
								yang responsif.
							</li>
							<li>
								Mengimplementasikan teknologi dan inovasi untuk
								meningkatkan efisiensi serta kualitas hasil
								pekerjaan.
							</li>
						</ul>
					</div>

					<div class="relative">
						<img
							src="https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/ducting-alpha.jpg"
							alt="visi"
							class="absolute top-0 right-0 z-1 w-[35%] h-auto rounded-2xl border-white border-6"
						/>
						<div class="p-10">
							<img
								src="https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/worker-mekanikal-alpha.png"
								alt="visi"
								class="relative z-0 w-[70%] h-[70%] my-auto mx-auto rounded-2xl border-white border-6 scale-x-[-1]"
							/>
						</div>
						<img
							src="https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/pompa-alpha.webp"
							alt="visi"
							class="absolute bottom-0 left-0 z-1 w-[40%] h-auto rounded-2xl border-white border-6"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="layanan-kami" class="bg-accent w-screen -mx-8 p-8">
		<h2 class="text-center font-bold text-4xl mb-8">Layanan Kami</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-foreground">
			{#each layanan as item, i}
				<div
					class="p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-colors {i %
						2 !==
					0
						? 'bg-primary text-primary-foreground'
						: 'bg-white dark:bg-card'}"
				>
					<img
						src={item.img}
						alt={item.alt}
						class="mb-4 rounded-full w-[100px]"
					/>
					<h3 class="text-xl font-semibold mb-2">{item.title}</h3>
					<p
						class:text-muted-foreground={i % 2 === 0}
						class:text-primary-foreground={i % 2 !== 0}
					>
						{item.description}
					</p>
				</div>
			{/each}
		</div>

		<p class="text-center text-primary underline">
			<a href="/services">lihat semua</a>
		</p>
	</section>

	<section class="m-2">
		<h2 class="text-center font-bold text-4xl mb-8">Projects</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each paginatedProjects as project}
				<div class="bg-card p-6 rounded-lg shadow-md">
					<img
						src={project.images[1]}
						alt={project.title}
						class="mb-4 rounded-md w-full h-48 object-cover"
					/>
					<h3 class="text-xl font-semibold mb-2">{project.title}</h3>
					<p class="text-muted-foreground mb-4">
						{project.description}
					</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="m-2">
		<h2 class="text-center font-bold text-4xl mb-8">Clients</h2>
		<Carousel.Root
			opts={{
				align: "center",
				loop: true,
				skipSnaps: true,
			}}
			class="w-full"
			plugins={[
				Autoplay({
					delay: 2500,
				}),
			]}
		>
			<Carousel.Content>
				{#each clients as client}
					<Carousel.Item class="p-5 md:basis-1/3 lg:basis-1/4 ">
						<div
							class="flex items-center justify-center bg-white p-4 rounded-lg shadow-md gap-3"
						>
							<img
								src={client.logo}
								alt={client.name}
								class="h-16 object-containproject"
							/>
							{client.name}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>
	</section>
</div>
