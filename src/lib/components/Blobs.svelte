<!-- Soft radial gradient blobs — decorative background element -->
<svg
	aria-hidden="true"
	class="blobs"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="xMidYMid slice"
>
	<defs>
		<radialGradient id="blob-sage" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#7fb086" stop-opacity="0.18" />
			<stop offset="100%" stop-color="#7fb086" stop-opacity="0" />
		</radialGradient>
		<radialGradient id="blob-rose" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#d997b6" stop-opacity="0.16" />
			<stop offset="100%" stop-color="#d997b6" stop-opacity="0" />
		</radialGradient>
		<radialGradient id="blob-sky" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#7ca6c4" stop-opacity="0.14" />
			<stop offset="100%" stop-color="#7ca6c4" stop-opacity="0" />
		</radialGradient>
		<radialGradient id="blob-ochre" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#e2b47a" stop-opacity="0.13" />
			<stop offset="100%" stop-color="#e2b47a" stop-opacity="0" />
		</radialGradient>
	</defs>
	<!-- top-left: sage -->
	<ellipse cx="15%" cy="12%" rx="380" ry="280" fill="url(#blob-sage)" />
	<!-- top-right: rose -->
	<ellipse cx="85%" cy="10%" rx="320" ry="240" fill="url(#blob-rose)" />
	<!-- bottom-right: sky -->
	<ellipse cx="90%" cy="70%" rx="360" ry="280" fill="url(#blob-sky)" />
	<!-- bottom-left: ochre -->
	<ellipse cx="10%" cy="85%" rx="320" ry="240" fill="url(#blob-ochre)" />
</svg>

<style>
	.blobs {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 0;
	}
</style>
