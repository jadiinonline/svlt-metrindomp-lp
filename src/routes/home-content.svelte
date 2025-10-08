<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import {
		CalendarCheck,
		Laugh,
		MessageSquareText,
		ShieldCheck,
	} from "@lucide/svelte";

	const companyYear = 1997;

	const layanan = [
		{
			img: "https://placehold.co/100x100",
			alt: "Mechanical",
			title: "Mekanikal",
			description:
				"Layanan mekanikal kami mencakup instalasi, pemeliharaan, dan perbaikan sistem mekanikal untuk berbagai jenis bangunan dan industri.",
		},
		{
			img: "https://placehold.co/100x100",
			alt: "Electrical",
			title: "Elektrikal",
			description:
				"Kami menyediakan solusi elektrikal lengkap, mulai dari perencanaan, instalasi jaringan listrik, hingga sistem kontrol dan otomatisasi.",
		},
		{
			img: "https://placehold.co/100x100",
			alt: "Civil",
			title: "Sipil",
			description:
				"Layanan sipil kami meliputi pembangunan infrastruktur, struktur bangunan, dan pekerjaan tanah dengan standar kualitas tertinggi.",
		},
		{
			img: "https://placehold.co/100x100",
			alt: "Telecommunication",
			title: "Telekomunikasi",
			description:
				"Layanan telekomunikasi kami meliputi pemasangan tower, pemasangan kabel FO ",
		},
	];
</script>

<div class="flex flex-col space-y-7">
	<section
		id="section1"
		class="relative bg-[url('https://images.unsplash.com/photo-1712758602405-f8aa7de86cef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center w-[99.1vw] -mx-8 p-20"
	>
		<div
			class="absolute inset-0 bg-gradient-to-r from-white to-transparent"
		></div>

		<div class="relative flex flex-col space-y-3 w-[60%]">
			<h2
				class="italic font-bold text-3xl bg-black text-white w-[400px] text-center p-2"
			>
				"Quality & Schedule"
			</h2>

			<h1 class="uppercase text-8xl font-bold text-shadow-md">
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

	<section id="section2" class="m-2">
		<div
			class="flex flex-row space-x-8 items-center justify-between w-full"
		>
			<div class="w-[45%] flex-shrink-0">
				<img
					src="https://plus.unsplash.com/premium_photo-1661921393343-343742700dd3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="section2"
					class="rounded-lg"
				/>
			</div>

			<div class="flex-1">
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
					<b>PT. Metrindo Majupersada</b> lah perusahaan yang bergerak
					di bidang konstruksi dan layanan engineering. Berdiri pada
					tahun 1997, perusahaan kami didirikan dengan tujuan untuk
					mengembangkan bisnis yang telah ada sebelumnya. Pendirian
					perusahaan disahkan melalui akta pendirian perubahaan no. 64
					pada 17 November 2008. <br />Seiring berjalannya waktu, PT.
					Metrindo Majupersada semakin dipercaya oleh berbagai
					perusahaan besar di sektor mekanikal, elektrikal dan sipil.
					Beberapa di antaranya PT. Waskita Karya, PT. Jaya
					Konstruksi, PT. Wijaya Karya. Perusahaan ini telah berhasil
					mengerjakan proyek proyek penting di seluruh Indonesia,
					termasuk Bandara Gorontalo, Bandara Soekarno-Hatta, dan
					kantor DPRD Riau. Dengan moto "Quality & Schedule",
					perusahaan ini terus berupaya memberikan hasil terbaik
				</p>
			</div>
		</div>
	</section>

	<Separator></Separator>

	<section class="m-2 bg-accent w-[99.1vw] -mx-8 p-8">
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
		<h2 class="text-center font-bold text-4xl mb-8">Visi & Misi Kami</h2>

		<div class="grid grid-cols-1 md:grid-cols-1 gap-8">
			<div class="flex flex-row items-center">
				<div><img src="https://placehold.co/800x800" alt="visi" /></div>
				<div class=" p-8 flex flex-col items-center text-center">
					<h3 class="text-3xl font-bold mb-4 text-primary">Visi</h3>
					<p class="text-lg leading-relaxed">
						Menjadi perusahaan konstruksi terkemuka dan terpercaya
						di Indonesia yang dikenal akan kualitas, inovasi, dan
						komitmen terhadap kepuasan pelanggan.
					</p>
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
								Menyediakan layanan konstruksi berkualitas
								tinggi dengan standar internasional.
							</li>
							<li>
								Mengembangkan solusi inovatif dan berkelanjutan
								untuk setiap proyek.
							</li>
							<li>
								Membangun hubungan jangka panjang dengan klien
								berdasarkan kepercayaan dan integritas.
							</li>
							<li>
								Meningkatkan kompetensi dan kesejahteraan
								karyawan melalui pengembangan profesional.
							</li>
							<li>
								Berperan aktif dalam pembangunan infrastruktur
								nasional dengan memperhatikan aspek lingkungan
								dan sosial.
							</li>
						</ul>
					</div>
					<div>
						<img src="https://placehold.co/800x800" alt="misi" />
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="layanan-kami" class="m-2 bg-accent w-[99.1vw] -mx-8 p-8">
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
						class="mb-4 rounded-full"
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

		<a class="text-primary underline" href="/services"
			><p class="text-center">lihat semua</p></a
		>
	</section>

	<section class="m-2">project</section>
</div>
