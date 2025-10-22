<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import Autoplay from "embla-carousel-autoplay";

	import {
		ArrowLeft,
		ArrowRight,
		CalendarCheck,
		Laugh,
		MessageSquareText,
		ShieldCheck,
	} from "@lucide/svelte";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { Badge } from "$lib/components/ui/badge";

	const companyYear = 1997;
	let currentYear = new Date().getFullYear();
	let companyAge = currentYear - companyYear;

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

	const paginatedProjects: ProjectList[] = [
		{
			title: "Proyek Transmisi 500 kV New Aur Duri - Peranap Paket -1 Jambi PONDASI PAD & CHIMNEY KELAS 6 ( Borepile)",
			images: [
				"https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/project_jambi_aur_duri.jpg",
			],
			year: 2018,
			description:
				"Proyek ini merupakan pekerjaan pondasi PAD dan chimney kelas 6 (borepile) untuk Transmisi 500 kV New Aur Duri – Peranap Paket 1 yang berlokasi di Provinsi Jambi. Pekerjaan meliputi pembangunan pondasi struktur transmisi tegangan ekstra tinggi dengan sistem borepile, yang berfungsi sebagai penopang utama menara transmisi. Pelaksanaan proyek dilakukan dengan standar mutu tinggi untuk menjamin kestabilan struktur, ketepatan dimensi, dan ketahanan jangka panjang, serta mengikuti jadwal kerja yang ketat agar seluruh target dapat diselesaikan tepat waktu.",
			location: "Jambi, Indonesia",
			categories: ["civil", "mechanical"],
			client: "PT. WASKITA KARYA PERSERO ",
		},
		{
			title: "Pekerjaan Pembangunan 9 unit rumah Type 36 (Blok C. 3 No. 4, 6, 8, 10 dan 12 ( 5 unit ) Blok C. 5 No. 10, 12, 14 dan 16 ( 4 unit) Proyek Taman Dhika Batu Tulis - Bogor",
			images: [
				"https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/project_tamandhika.jpg",
			],
			description:
				"Proyek ini merupakan pekerjaan pembangunan kompleks rumah hunian tipe 36 yang berlokasi di Batu Tulis, Bogor. Pekerjaan meliputi pembangunan struktur utama serta instalasi pendukung untuk menciptakan lingkungan hunian yang nyaman, fungsional, dan sesuai dengan standar kualitas konstruksi modern.",
			location: "Bogor, Indonesia",
			categories: ["civil", "mechanical"],
			client: "PT. ADHI PERSADA PROPERTI",
			year: 2017,
		},
		{
			title: "Pekerjaan pengadaan dan pemasangan Instalasi Listrik pada proyek pembangunan tol Soroja Bandung",
			images: [
				"https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/project_tol_soroja.jpg",
			],
			description:
				"Proyek ini meliputi pekerjaan pengadaan dan pemasangan instalasi listrik pada pembangunan Jalan Tol Soreang – Pasir Koja (Soroja), Bandung. Ruang lingkup pekerjaan mencakup penyediaan material, pemasangan sistem kelistrikan utama dan penerangan, serta penyaluran daya untuk fasilitas tol, gerbang, dan area pendukung operasional. Pelaksanaan dilakukan dengan standar keselamatan dan mutu tinggi, memastikan sistem listrik berfungsi secara andal, efisien, dan aman untuk mendukung operasional jalan tol secara berkelanjutan dan tepat waktu.",
			location: "Jakarta, Indonesia",
			categories: ["civil", "mechanical"],
			client: "PT. GUNUNG GAYA PERSADA",
			year: 2017,
		},

		{
			title: "Penyambungan daya Listrik PLN di tower BTS BSD Serpong",
			images: [
				"https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/project_listrik_bts.jpg",
			],
			year: 2017,
			description:
				"Proyek ini mencakup pekerjaan penyambungan daya listrik PLN pada menara BTS (Base Transceiver Station) yang berlokasi di BSD, Serpong. Lingkup pekerjaan meliputi koordinasi dengan pihak PLN, pemasangan instalasi kelistrikan dari sumber utama ke panel distribusi BTS, serta pengujian sistem untuk memastikan pasokan daya yang stabil, aman, dan sesuai standar teknis. Pekerjaan dilaksanakan dengan memperhatikan ketepatan waktu, keselamatan kerja, dan keandalan sistem guna mendukung operasional jaringan telekomunikasi secara optimal.",
			location: "Tangerang Selatan, Indonesia",
			categories: ["elektrikal"],
			client: "PT. INTI BANGUN SEJAHTERA",
		},
		{
			title: "Pekerjaan Mekanikal , Elektrikal dan Plumbing Pembangunan Gerbang Tol Bogor 2 Pada jalan Tol Jagorawi Baranangsiang",
			images: [
				"https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/project_tol_bogor_2.jpg",
			],
			year: 2017,
			description: "xxxxx",
			location: "Bogor, Indonesia",
			categories: ["elektrikal", "mekanikal", "plumbing"],
			client: "PT. MITRA SETYA UTAMA",
		},
		{
			title: "Pekerjaan Jasa dan Material Elektikal Pemindahan Genset Universitas Pertamina",
			images: [
				"https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/project_universitas_pertamina.jpeg",
			],
			year: 2016,
			description: "xxxxx",
			location: "Jakarta Selatan, Indonesia",
			categories: ["elektrikal"],
			client: "PT. PATRA BADAK ARUN SOLUSI",
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
		class="relative bg-[url('https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/hero-content-2.avif')] bg-cover bg-center w-screen xl:-mx-8 p-2 xl:p-20
		scroll-mt-[15vh]"
	>
		<div
			class="absolute inset-0 bg-gradient-to-r from-white to-transparent"
		></div>

		<div
			class="relative flex flex-col space-y-3 p-2 md:p-8 w-[80%] xl:w-[60%]"
		>
			<h2
				class="italic font-bold text-lg md:text-3xl bg-black text-white w-[250px] md:w-[400px] text-center p-2 rounded-sm"
			>
				"Quality & Schedule"
			</h2>

			<h1
				class="uppercase text-4xl md:text-4xl lg:text-8xl font-extrabold lg:font-bold text-shadow-md"
			>
				general contractor & <br />engineering services
			</h1>

			<p class="md:text-2xl">
				PT. Metrindo Majupersada menyediakan layanan <b>konstruksi</b> untuk
				proyek menengah hingga besar. Perusahaan ini dikenal dengan kemampuan
				menjaga kualitas, kepuasan pelanggan, dan hubungan baik dengan para
				mitra kerja. Keberhasilan ini didukung oleh tenaga ahli yang kompeten
				di bidangnya
			</p>

			<Button
				class="right-0 w-[200px] text-lg "
				size="lg"
				href="https://wa.me/62816878368?text=Halo,%20saya%20dapat%20informasi%20dari%20website%20metrindomp.com"
				target="_blank"
			>
				Konsultasi Gratis <MessageSquareText />
			</Button>
		</div>
	</section>

	<Separator></Separator>

	<section id="tentang-kami" class="m-2 w-full scroll-mt-[15vh]">
		<div
			class="grid lg:grid-cols-2 space-x-8 items-center justify-between w-full gap-2"
		>
			<div class="flex-shrink-0">
				<img
					src="https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/hero-content-1.avif"
					alt="section2"
					class="rounded-lg w-full"
				/>
			</div>

			<div class="">
				<div class="flex space-x-4 items-center justify-self-start">
					<div
						class="text-primary font-extrabold text-6xl md:text-8xl"
					>
						{companyYear}
					</div>

					<Separator orientation="vertical" class="w-[200px]" />

					<div class="flex flex-col space-y-2">
						<div class="text-muted-foreground text-xl md:text-2xl">
							<b>{companyAge} years of </b>
						</div>
						<div class="text-2xl md:text-4xl font-bold uppercase">
							success in experience
						</div>
					</div>
				</div>

				<p class="text-md md:text-xl p-2">
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
					<b>"Quality & Schedule"</b>, perusahaan ini terus berupaya
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

	<section id="visi-misi" class="m-2 scroll-mt-[15vh]">
		<h2 class="text-center font-extrabold text-4xl md:text-6xl mb-8">
			Quality & Schedule
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-1 gap-8">
			<div class="grid grid-cols-1 lg:grid-cols-2 items-center">
				<div class=" p-8 flex flex-col items-center text-center">
					<div class="relative w-full h-full">
						<img
							src="https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/worker-beta.jpeg"
							alt="visi"
							class="absolute top-0 lg:left-0 z-1 w-[50%] xl:w-[30%] h-auto rounded-2xl border-white border-6"
						/>
						<div class="p-4 md:p-10">
							<img
								src="https://storage.googleapis.com/jadiinonline-public/metrindomp/assets/worker-alpha.png"
								alt="visi"
								class="relative z-0 w-[100%] xl:w-[70%] xl:h-[70%] my-auto mx-auto rounded-2xl border-white border-6"
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
					<h3 class="text-3xl font-extrabold mb-4 text-primary">
						Visi
					</h3>
					<ul
						class="list-disc list-inside text-left text-md md:text-lg space-y-2"
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

			<div class="grid grid-cols-1 lg:grid-cols-2 items-center">
				<div class=" p-8 flex flex-col items-center text-center">
					<h3 class="text-3xl font-extrabold mb-4 text-primary">
						Misi
					</h3>
					<ul
						class="list-disc list-inside text-left text-md md:text-lg space-y-2"
					>
						<li>
							Memberikan hasil kerja berkualitas tinggi melalui
							penerapan standar teknis dan prosedur kerja terbaik.
						</li>
						<li>
							Menyelesaikan setiap proyek tepat waktu dengan
							perencanaan yang efisien dan koordinasi yang
							efektif.
						</li>
						<li>
							Meningkatkan kompetensi sumber daya manusia melalui
							pelatihan berkelanjutan dan budaya kerja
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
							class="relative z-0 xl:w-[70%] xl:h-[70%] my-auto mx-auto rounded-2xl border-white border-6 scale-x-[-1]"
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
			<a
				href="/#services"
				class="pointer-events-none text-muted-foreground cursor-default"
				>lihat semua</a
			>
		</p>
	</section>

	<section class="m-2" id="projects-list">
		<h2 class="text-center font-bold text-4xl mb-8">Projects</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each paginatedProjects as project}
				<div class="">
					{#if project.images && project.images.length > 0}
						<!-- gambar2 project dengan overlay 10% putih-->
						<div
							class="relative w-full h-[250px] xl:h-[400px] overflow-hidden shadow-md"
						>
							<img
								src={project.images[0]}
								alt={project.title}
								class="w-full h-full object-cover brightness-[1.05] contrast-[1.1] saturate-[1.05] transition-all duration-300 hover:scale-[1.02] hover:brightness-[1.1]"
							/>
							<div class="absolute inset-0 bg-white/10"></div>
						</div>
					{:else}
						<Skeleton
							class="mb-4 rounded-md w-full h-48 object-cover"
						></Skeleton>
					{/if}
					<div class="bg-primary text-white p-4 h-[120px]">
						<div class="flex justify-between">
							<h3
								class="text-md md:text-lg lg:text-xl font-extrabold mb-2"
							>
								{project.client}
							</h3>

							<h2 class="text-xs md:text-md md:font-bold p-1">
								{project.year}
							</h2>
						</div>

						<p
							class="text-sm md:text-md self-center text-accent line-clamp-2 xl:line-clamp-3"
						>
							{project.title}
						</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="flex justify-between gap-4 mt-4">
			<Button variant="ghost">
				<ArrowLeft class="text-primary" size="lg" />
			</Button>

			<Button variant="ghost">
				<ArrowRight class="text-primary" size="200" />
			</Button>
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
					<Carousel.Item class="p-5  md:basis-1/3 lg:basis-1/4 ">
						<div
							class="flex items-center justify-center bg-white p-4 rounded-lg shadow-md gap-3"
						>
							<img
								src={client.logo}
								alt={client.name}
								class="h-16 object-contain"
							/>
							{client.name}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>
	</section>
</div>
