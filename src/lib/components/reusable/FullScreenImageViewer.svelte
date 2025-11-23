<script lang="ts">
	import { ZoomIn, ZoomOut } from "@lucide/svelte";
	import { onMount } from "svelte";

	export let src: string;
	export let alt: string = "";
	export let onClose: () => void;

	let scale = 1;
	let translateX = 0;
	let translateY = 0;

	let isDragging = false;
	let startX = 0;
	let startY = 0;

	function zoom(delta: number) {
		scale = Math.min(5, Math.max(0.1, scale + delta));
	}

	function startDrag(e: MouseEvent | TouchEvent) {
		isDragging = true;

		if (e instanceof MouseEvent) {
			startX = e.clientX - translateX;
			startY = e.clientY - translateY;
		} else {
			startX = e.touches[0].clientX - translateX;
			startY = e.touches[0].clientY - translateY;
		}
	}

	function moveDrag(e: MouseEvent | TouchEvent) {
		if (!isDragging) return;

		if (e instanceof MouseEvent) {
			translateX = e.clientX - startX;
			translateY = e.clientY - startY;
		} else {
			translateX = e.touches[0].clientX - startX;
			translateY = e.touches[0].clientY - startY;
		}
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();

		const zoomIntensity = 0.15;
		const delta = e.deltaY < 0 ? zoomIntensity : -zoomIntensity;

		const newScale = Math.min(5, Math.max(0.1, scale + delta));

		scale = newScale;
	}

	function stopDrag() {
		isDragging = false;
	}

	onMount(() => {
		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape") onClose?.();
		});
	});
</script>

<div class="fixed inset-0 bg-black/90 z-100 flex flex-col">
	<!-- Close Button -->
	<button
		class="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 font-bold rounded-full h-10 w-10 text-sm z-20 border-2"
		onclick={onClose}
	>
		✕
	</button>

	<!-- Zoom Controls -->
	<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
		<button
			class="bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-xl border-2"
			onclick={() => zoom(0.2)}
		>
			<ZoomIn />
		</button>
		<button
			class="bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-xl border-2"
			onclick={() => zoom(-0.2)}
		>
			<ZoomOut />
		</button>
	</div>

	<!-- Image Area -->
	<button
		class="flex-1 flex items-center justify-center overflow-hidden"
		onmousedown={startDrag}
		onmousemove={moveDrag}
		onmouseup={stopDrag}
		onmouseleave={stopDrag}
		ontouchstart={startDrag}
		ontouchmove={moveDrag}
		ontouchend={stopDrag}
		onwheel={onWheel}
	>
		<img
			{src}
			{alt}
			draggable="false"
			class="select-none max-w-none transition-transform duration-[10]"
			style="
				transform:
					translate({translateX}px, {translateY}px)
					scale({scale});
			"
		/>
	</button>
</div>

<style>
	img {
		touch-action: none;
	}
</style>
