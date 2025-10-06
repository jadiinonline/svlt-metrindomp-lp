<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { MessageSquareText } from "@lucide/svelte";
</script>

<div class="flex flex-col space-y-7">
	<section
		class="bg-[url('https://placehold.co/1920x500')] bg-cover bg-center w-screen text-black -mx-8 p-20"
	>
		<div class="flex flex-col space-y-3 w-[60%]">
			<h2
				class="italic font-bold text-3xl bg-black text-white w-[400px] text-center p-2"
			>
				"Quality & Schedule"
			</h2>

			<h1 class="uppercase text-8xl font-bold">
				general contractor & <br />engineering services
			</h1>

			<p class="text-2xl text-foreground">
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

	<section class="m-2">
		<img src="https://placehold.co/240" alt="2 second" />

		<h1>Welcome to Metrindo Landing Page</h1>
		<p>
			Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a>
			to read the documentation
		</p>

		<Button>tes</Button>
	</section>

	<Separator></Separator>

	<section class="m-2">
		<img src="https://placehold.co/360" alt="3 third" />

		<h1>Welcome to Metrindo Landing Page</h1>
		<p>
			Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a>
			to read the documentation
		</p>

		<Button>tes</Button>
	</section>
</div>
