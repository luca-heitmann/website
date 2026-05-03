<!-- Colored dot indicator with soft glow -->
<script lang="ts">
	export let color: string;
	export let size: number = 10;
</script>

<span
	class="dot"
	style="--color: {color}; --size: {size}px; --glow: {Math.round(size / 3)}px;"
	aria-hidden="true"
></span>

<style>
	.dot {
		display: inline-block;
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		background: var(--color);
		box-shadow: 0 0 0 var(--glow) color-mix(in srgb, var(--color) 13%, transparent);
		vertical-align: middle;
		flex-shrink: 0;
	}
</style>
