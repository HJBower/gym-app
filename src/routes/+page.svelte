<script lang="ts">
    import { onMount, setContext } from "svelte";
    import Workout from "./Workout.svelte";
	import { Accordion, AccordionItem, Modal } from "flowbite-svelte";
	import { EXERCISE_CONTEXT }  from "$lib/contexts/exercise";
	import { NUM_REQUESTED, WEBSITE_URL, WEEKDAYS } from "$lib/constants";
    import { workoutTemplates } from "$lib/templates.svelte";

	let templateModal = $state(false);
	let description = $state("");

	let focus = $state(false);

	let searchTerm = $state("");

	let workouts: WorkoutType[] = $state([]);
	let exerciseNames: string[] = $state([]);

	setContext(EXERCISE_CONTEXT, {
		exerciseNames,

			addExerciseName(newName: string) {
				if (exerciseNames.includes(newName)) return;
    			exerciseNames.push(newName);
			}
		}
	)

	/**
	 * Add a new workout with the name set to the day of the week and the date set. 
	 */
	function addWorkout() {

		let date = new Date();
		let weekday = WEEKDAYS[date.getDay()];

		const dd: string = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate().toString();
		const mm: string = (date.getMonth() + 1 < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
		const yy: string = date.getFullYear().toString();

		workouts.push({
			name: weekday,
			date: `${dd}/${mm}/${yy}`,
			exercises: [{
				name: "",
				reps: [0],
				weights: [0.0]
			}]});
	}

	/**
	 * Get workouts from the server.
	 * 
	 * @param count number of workouts to fetch
	 */
	async function getWorkouts(count: number) {
		const params = new URLSearchParams({
			count: `${count}`
		});

		try {
			const res = await fetch(`${WEBSITE_URL}/workouts?${params}`, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
					"Content-Type": "application/json"
				}
			});

			if (!res.ok) {
				throw new Error("Request failed.");
			}

			await res.json()
			.then(data => workoutDataExtraction(data)) 
			.catch((reason) => console.log(reason));

		} catch (error) {
			throw error;
		}

	}
	/**
	 * TODO: do not fetch workouts when switching between different tabs.
	*/
	onMount(() => getWorkouts(NUM_REQUESTED));

	function workoutDataExtraction(workoutData: any) {

		/**
		 * Temporary solution to extract exercise names to create exercise list
		 * for when adding exercises. It might be better to later have the exercise list
		 * sent by the server in either a seperate request or in the initial fetch data.
		*/
		let names: Set<string> = new Set([]);
		for (let i = 0; i < workoutData.length; i++) {
			let workout = workoutData[i];
			
			for (let j = 0; j < workout.exercises.length; j++) {
				names.add(workout.exercises[j].name);
			}
		}

		exerciseNames.push(...names);

		// Mutate the workout array and not reassign or reactivity breaks
		workouts.splice(workouts.length, 0, ...workoutData);
	}

	async function sendWorkouts() {

		try {
			await fetch(`${WEBSITE_URL}/workouts`, {
				method: "POST",
				body: JSON.stringify(workouts),
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


	function addTemplateWorkout(templateName: string) {

		for (const template of workoutTemplates) {
			if (template.name == templateName) {

				let date = new Date();
				let weekday = WEEKDAYS[date.getDay()];

				const dd: string = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate().toString();
				const mm: string = (date.getMonth() + 1 < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
				const yy: string = date.getFullYear().toString();

				let exercises: ExerciseType[] = []

				for (let i = 0; i < template.exercises.length; i++) {	// Each exercise of the template
					exercises.push({
						name: template.exercises[i].name,
						reps: new Array(template.exercises[i].sets).fill(0),
						weights: new Array(template.exercises[i].sets).fill(0.0)
					})
				}

				workouts.push({
					name: `${template.name}-${weekday}`,
					date: `${dd}/${mm}/${yy}`,
					exercises: exercises
				});
			}
		}
	}

	function createDescription(template: WorkoutTemplateType) {
		let name = template.name;

		let descrip: string = "";
		for (const exercise of template.exercises) {
			descrip = descrip.concat(exercise.name + ": " + exercise.sets.toString(), ", ");
		}
		descrip = descrip.slice(0, descrip.length - 2)

		return name.concat(" - ", descrip);
	} 

	function search() {

		let searchEntries: SearchEntryType[] = [];

		let filteredNames = exerciseNames.filter((name: string) => 
            name.toLowerCase().includes(searchTerm.toLowerCase()))

		/**
		 * O(n^3) but likely not an issue.
		*/
		for (const name of filteredNames) {
			let dates: string[] = [];
			let weightEffort: WeightEffortType[] = [];

			for (const workout of workouts) {
				for (const exercise of workout.exercises) {

					if (name == exercise.name) {
						dates.push(workout.date);
						weightEffort.push({
							reps: exercise.reps,
							weights: exercise.weights
						})
					}
				}
			}

			searchEntries.push({
				name: name,
				dates: dates,
				effortMeasure: weightEffort
			})
		}

		console.log(searchEntries);

		return searchEntries;
	}


</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div>

	<!-- Add a workout: either Default of from Templates -->
	<div class="workout-addition">
		<div >
			<button class="left" onclick={addWorkout}>Default</button>
			<div class="addition"><span class="material-symbols--add-circle-outline-rounded"></span></div>
			<button class="right" onclick={() => templateModal = true}>Template</button>
		</div>
    </div>

	<!-- Search bar for exercises -->
	<div class="search-bar">
		<div data-focus={focus}>
			<span class="material-symbols--search-rounded" ></span>
			<input bind:value={searchTerm} placeholder="Search..." onfocus={() => focus = true} onblur={() => focus = false}>
			<button aria-label="Clear search" class="material-symbols--cancel-outline-rounded" onclick={() => searchTerm = ""}></button>
		</div>
	</div>

	<!-- Modal for Templates -->
	<Modal title="Add template workout" form bind:open={templateModal}>
		<p>{description}</p>
		<ul class="templates">
			{#each workoutTemplates as template}
				<li class="m-2">
					<button onclick={() => addTemplateWorkout(template.name)} onmouseenter={() => description = createDescription(template)}>{template.name}</button>
				</li>
			{/each}
		</ul>
	</Modal>

	{#if searchTerm === ""}
		<!-- List of workouts -->
		<ul>
			{#each workouts as _, i}
				<li class="p-4">
					<Workout bind:workout={workouts[workouts.length - 1 - i]}/>
				</li>
			{/each}
		</ul>
	{:else}
		<ul>
			{#each search() as entry}
				<li>
					<Accordion flush multiple>
						<AccordionItem open>
							{#snippet header()}
								<h1 class="font-bold text-xl">{entry.name}</h1>
							{/snippet}
							
							{#each Array.from({length: entry.dates.length}) as _, i}
								<div class="entry-data">
									<div class="w-16">{entry.dates[i]}</div>
									<div class="labels">
										<h>Weight</h>
										<h>Reps</h>
									</div>

									<ul class="w-60/100">
										{#each Array.from({length: entry.effortMeasure[i].reps.length}) as _, j}
											<li>
												<div class="set">
													<div>{entry.effortMeasure[i].weights[j]}</div>
													<div>{entry.effortMeasure[i].reps[j]}</div>
												</div>
											</li>
										{/each}
									</ul>
								</div>
							{/each}
						</AccordionItem>	
					</Accordion>
				</li>	
			{/each}
		</ul>
	{/if}

	<p>{JSON.stringify(workouts, null, 2)}</p>
	<p>{exerciseNames}</p>

	<div class="data">
		<button class="bg-amber-300" onclick={sendWorkouts}>Send Data</button>
	</div>

</div>

<style>

	.set {
        display: flex;
        flex-direction: column;
        width: 2.4rem;
    }

	.labels {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-weight: bold;
    }

	.entry-data {
		display: flex;
		align-items: center;
		
		margin-left: 2rem;
		gap: 2rem;

		font-weight: lighter;
	}

	.entry-data > ul {
		display: flex;
		justify-content: start;

		gap: 0.8rem;

		font-weight: normal;
	}	

	.search-bar {
		display: flex;
		justify-content: center;
		padding: 0.5rem;
	}

	.search-bar input {
		width: 80%;
		border-style: none;
		text-overflow: ellipsis;
	}

	.search-bar input:focus {
		outline: none;
	}

	.search-bar input::placeholder {
		color: rgb(255, 255, 255);
	}

	.search-bar > div {
		display: flex;
		justify-content: space-evenly;
		align-items: center;

		border-radius: var(--border-radius);
		border-color: var(--border-color);
		background-color: var(--bg-color-primary);

		padding-inline: 0.2rem;
		padding-block: 0.3rem;
		
		width: 25%;
	}

	.search-bar > div:hover {
		background-color: var(--bg-color-secondary);
	}

	.search-bar > div[data-focus="true"] {
		background-color: var(--bg-color-secondary);
	}

	p {
		height: 1.5rem; /* should be text height */
		overflow-x: hidden;
		overflow-y: hidden;
	}

	.templates {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-wrap: nowrap;
		overflow-y: auto;
		height: 12rem;
	}

	.templates > li {
		display: flex;
		justify-content: center;
		width: 25%;
	}

	.templates button {
		background-color: var(--button-color-default);
		border-radius: var(--border-radius);
		color: black;
		width: 100%;

		padding-inline: 1em;
		text-overflow: ellipsis;

		overflow-y: hidden;
		overflow-x: hidden;
		min-height: auto;
		max-height: 3rem;
	}

	.templates button:hover {
		background-color: var(--button-color-hover);
	}

	.data {
		position: fixed;
		bottom: 0;
		right: 0;
	}

	.addition {
		position: absolute;
		left: calc(50% - 1rem);
		bottom: calc(50% - 1rem);

		background-color: white;
		width: 2rem;
		height: 2rem;

		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 2rem;
	}

	.workout-addition {
		display: flex;
		justify-content: center;
		position: relative;
	}

	.workout-addition > div {
		background-color: black;
		color: white;
		width: 25%;
		display: flex;
		justify-content: space-between;
		border: 0.1rem solid;
		border-radius: 2rem;
		border-color: grey;
	}

	.workout-addition button {
		width: 50%;
	}

	.left {
		border-right-color: rgba(255, 255, 255, 0);
	}

	.right {
		border-left-color: rgba(255, 255, 255, 0);
	}

	.left:hover {
		background-image: linear-gradient(to left, var(--button-color-hover), rgba(255, 255, 255, 0));
	}

	.right:hover {
		background-image: linear-gradient(to right, var(--button-color-hover),  rgba(255, 255, 255, 0));
	}

	.material-symbols--add-circle-outline-rounded {
        width: 2rem;
		height: 2rem;

        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M11 13v3q0 .425.288.713T12 17t.713-.288T13 16v-3h3q.425 0 .713-.288T17 12t-.288-.712T16 11h-3V8q0-.425-.288-.712T12 7t-.712.288T11 8v3H8q-.425 0-.712.288T7 12t.288.713T8 13zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8'/%3E%3C/svg%3E");
        
		background-color: var(--button-color-default);
        
		-webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

	.material-symbols--search-rounded {
		width: 1rem;
		height: 1rem;

		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14'/%3E%3C/svg%3E");

		background-color: black;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}

	.material-symbols--cancel-outline-rounded {
		width: 1rem;
		height: 1rem;

		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m12 13.4l2.9 2.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7L13.4 12l2.9-2.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275L12 10.6L9.1 7.7q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l2.9 2.9l-2.9 2.9q-.275.275-.275.7t.275.7t.7.275t.7-.275zm0 8.6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8'/%3E%3C/svg%3E");
		
		background-color: black;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}

	.material-symbols--cancel-outline-rounded:hover {
		background-color: white;
	}

</style>