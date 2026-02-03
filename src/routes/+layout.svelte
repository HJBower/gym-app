<script lang="ts">
	import Header from './Header.svelte';
	import './layout.css';
	import '../lib/styles/global.css';
    import { createWorkoutData } from '$lib/workoutData.svelte';
    import { setContext } from 'svelte';
    import { DATA, type WorkoutData } from '$lib/contexts/data';
	
	const workoutData = createWorkoutData();
	setContext<WorkoutData>(DATA, workoutData);

	let { children } = $props();
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: auto;
		display: flex;
		flex-direction: column;
		padding: 1rem;

		box-sizing: border-box;

		background-color: #000000;
		background-image: radial-gradient(var(--highlight) 2px, var(--bg-color-secondary) 2px);
		background-size: 40px 40px;
	}
</style>
