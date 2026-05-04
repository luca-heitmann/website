<script lang="ts">
	import { onMount } from 'svelte';

	let email = '';

	onMount(() => {
		// mail@luca-heitmann.de — XOR-encoded with key 42, no @ in source
		const k = 42;
		const e = [71, 75, 67, 70, 106, 70, 95, 73, 75, 7, 66, 79, 67, 94, 71, 75, 68, 68, 4, 78, 79];
		email = e.map(c => String.fromCharCode(c ^ k)).join('');
	});
</script>

<span>{email}</span>
