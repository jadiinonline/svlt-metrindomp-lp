<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Facebook, Linkedin, Twitter } from "@lucide/svelte";
</script>

<section id="footer" class="bg-accent w-screen p-10 mt-10">
	<div class="grid xl:grid-cols-2">
		<div class="flex flex-col gap-4">
			<h3>
				Address: <span class="text-muted-foreground"
					>Perkantoran Bintaro 8 Jl. Bintaro Permai Raya No.7 Jakarta
					Selatan 12320 DKI Jakarta</span
				>
			</h3>
			<h3>
				Phone: <span class="text-muted-foreground">+62217871223</span>
			</h3>
			<h3>
				Email: <span class="text-muted-foreground"
					>metrindomp@yahoo.co.id</span
				>
			</h3>
		</div>
		<div class="flex flex-col gap-2">
			<div>
				<h3 class="uppercase font-bold">newsletter :</h3>
				<div class="flex">
					<Input
						type="email"
						placeholder="Your Email Here"
						disabled
					/>
					<Button disabled>Subscribe</Button>
				</div>
			</div>
			<div>
				<h3 class="uppercase font-bold">Social :</h3>
				<div class="flex gap-4">
					<Facebook></Facebook>
					<Twitter></Twitter>
					<Linkedin></Linkedin>
				</div>
			</div>
		</div>
	</div>
</section>
<section class="bg-primary w-screen p-6">
	<h4 class="text-white">Metrindo Maju Persada 2025. All rights reserved.</h4>
</section>
