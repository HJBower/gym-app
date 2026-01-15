<script lang="ts">
	import { resolve } from '$app/paths';
    import { onMount } from 'svelte';
	import { NUM_REQUESTED, WEBSITE_URL } from "$lib/constants";
    import WorkoutTemplate from './WorkoutTemplate.svelte';
    import { workoutTemplates as templates, workoutTemplates } from '$lib/templates.svelte';

	async function getWorkoutTemplates(count: number) {

		const params = new URLSearchParams({
			count: `${count}`
		});

		try {

			const res = await fetch(`${WEBSITE_URL}/templates?${params}`);

			if (!res.ok) {
				throw new Error("Request failed.");
			}

			await res.json()
			.then(data => templates.splice(0, workoutTemplates.length, ...data)) 
			.catch((reason) => console.log(reason));

		} catch (error) {
			throw error;
		}

	}
	onMount(() => getWorkoutTemplates(NUM_REQUESTED));

	async function sendWorkoutTemplates() {

		try {
			await fetch(`${WEBSITE_URL}/templates`, {
				method: "POST",
				body: JSON.stringify(templates),
				headers: {
					"Content-type": "application/json charset=UTF-8"
				}
			})
			.then((success) => console.log(success))
			.catch((reason) => console.log(reason))

		} catch (error) {
			throw error;
		}
	}


	function addTemplate() {
		templates.push({
			name: "",
			exercises: [{
				name: "",
				sets: 0
			}]});
	}

</script>

<svelte:head>
	<title>Templates</title>
	<meta name="description" content="Workout templates" />
</svelte:head>

<div>
	<div class="flex justify-center">
		<button onclick={addTemplate}>Add Template</button>
	</div>

	<ul>
		{#each templates as _, i}
			<li class="p-4">
				<WorkoutTemplate bind:template={templates[i]}/>
			</li>
		{/each}
	</ul>

	<p>{JSON.stringify(templates, null, 2)}</p>

	<div class="data">
		<button class="bg-amber-300" onclick={sendWorkoutTemplates}>Send Data</button>
	</div>

</div>

<style>

	.data {
		position: fixed;
		bottom: 0;
		right: 0;
	}

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 0.1rem solid;
		width: fit-content;
		padding-inline: 0.4rem;
		border-radius: var(--border-radius);
		border-color: var(--color-gray-300);
	}

	button:hover {
		background-image: radial-gradient(circle, var(--button-color-hover) 0%, var(--button-color-default) 20%, white 100%);
	}
</style>