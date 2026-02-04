<script lang="ts">

    import { getContext } from "svelte";
    import { Accordion, AccordionItem } from "flowbite-svelte";
    import Down from "@iconify-svelte/material-symbols/keyboard-double-arrow-down-rounded";
    import Up from "@iconify-svelte/material-symbols/chevron-line-up-rounded";
    import Exercise from "./Exercise.svelte";
    import BatchUpdate from "$lib/BatchUpdate";
    import { DATA, type WorkoutData } from "$lib/contexts/data";

    const workoutData = getContext<WorkoutData>(DATA);
    let { workoutId } = $props();
    let workout = $derived.by(() => {
        const workout = workoutData.workouts.get(workoutId);
        if (!workout) return null;
        return workout;
    });

    let exercises = $derived.by(() => {
        return [...workoutData.exercises.values()]
            .filter(e => e.workoutId == workoutId)
            .sort((a, b) => a.index - b.index);
    })

    let name = $state("");
    function updateName() {
        if (!workout) return;
        workoutData.setWorkout({...workout, name: name});

        batchUpdate.updateWorkoutName(name, workoutId);
    }
    $effect(() => {
        name = workout?.name ?? "None";
    })

    let batchUpdate = BatchUpdate.getInstance();

    function calcDisplayDate() {

        if (!workout) {
            console.log("Error in displaying date");
            return "dd\\mm\\yy";
        }

        let date: string = workout.date;
        date = date.substring(0, 10);

        let parts = date.split("-");

        if (parts.length < 3) {
            console.log("Error in displaying date");
            return "dd\\mm\\yy";
        }

        return `${parts[2]}\\${parts[1]}\\${parts[0]}`;
    }

    function addExercise() {
        let exercise: ExerciseT = {
            id: crypto.randomUUID(),
            workoutId: workoutId,
            name: "",
            index: workoutData.workouts.size + 1,
        }

        let perfMeasure: WeightPerfT = {
            id: crypto.randomUUID(),
            exerciseId: exercise.id,
            reps: [0],
            weight: [0],
        }

        workoutData.setExercise(exercise);
        workoutData.setPerfMeasure(perfMeasure);

        batchUpdate.addExercise(exercise);
    }

    function deleteWorkout() {
        for (const e of exercises) {
            const perfMeasure = [...workoutData.perfMeasures.values()]
                .find((pm) => pm.exerciseId == e.id);
            
            if (perfMeasure) workoutData.perfMeasures.delete(perfMeasure?.id);
            workoutData.exercises.delete(e.id);
        }
        workoutData.workouts.delete(workoutId);
    }

</script>

<Accordion inactiveClass="bg-[var(--button-color-hover)]" activeClass="bg-[var(--button-color-default)]" class="border-0 divide-y-0">
    <AccordionItem classes={{ content: "bg-[var(--bg-color-secondary)] text-white" }}>
        {#snippet header()}
            <div class="accordion-header">
                <input type="text"
                    bind:value={name} 
                    onblur={updateName}
                    onclick={(e) => (e.stopPropagation())}
                    onkeydown={(e) => (e.stopPropagation())}
                />
                <div class="text-sm">{calcDisplayDate()}</div>
            </div>    
        {/snippet}
        {#snippet arrowup()}<Up width=1.25rem height=1.25rem/>{/snippet}
        {#snippet arrowdown()}<Down width=1.25rem height=1.25rem/>{/snippet}
        
        <div class="flex justify-end">
            <button aria-label="Delete workout" class="delete-workout" onclick={deleteWorkout}></button>
        </div>

        {#if workout}
            <ul >
                {#each exercises as e}
                    <li>
                        <Exercise exerciseId={e.id} />
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="flex justify-center p-2">No exercises currently included in workout.</p>
        {/if}

        <div class="flex justify-center">
            <button aria-label="Add exercise" class="add-exercise" onclick={addExercise}></button>
        </div>
    </AccordionItem>
</Accordion>

<style>

    input {
        padding: 0;
        border-style: none;
        background-color: transparent;

        font-weight: bold;
        text-overflow: ellipsis;
    }

    input:focus {
        font-weight: bold;
        font-style: italic;

        text-decoration-line: underline;
        text-decoration-thickness: 1px;
        background-color: transparent;
    }

    .accordion-header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
    }

    .add-exercise{
        display: inline-block;

        width: 2rem;
        height: 2rem;

        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M14 14q.425 0 .713-.288T15 13v-2h2q.425 0 .713-.288T18 10t-.288-.712T17 9h-2V7q0-.425-.288-.712T14 6t-.712.288T13 7v2h-2q-.425 0-.712.288T10 10t.288.713T11 11h2v2q0 .425.288.713T14 14m-6 4q-.825 0-1.412-.587T6 16V4q0-.825.588-1.412T8 2h12q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-4 4q-.825 0-1.412-.587T2 20V7q0-.425.288-.712T3 6t.713.288T4 7v13h13q.425 0 .713.288T18 21t-.288.713T17 22z'/%3E%3C/svg%3E");
        background-color: var(--button-color-default);
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .add-exercise:hover {
        background-color: var(--button-color-hover);
        animation: pulse 1000ms cubic-bezier(0.9, 0.7, 0.5, 0.9) infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 0.4;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.8;
        }
    }

    .delete-workout {
        display: inline-block;

        width: 1.5rem;
        height: 1.5rem;

        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m19 19.425l-1.425 1.4q-.275.275-.687.288t-.713-.288q-.275-.275-.275-.7t.275-.7l1.4-1.425l-1.4-1.425q-.275-.275-.288-.687t.288-.713q.275-.275.7-.275t.7.275l1.425 1.4l1.425-1.4q.275-.275.688-.288t.712.288q.275.275.275.7t-.275.7L20.425 18l1.4 1.425q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275zM6 22q-1.25 0-2.125-.875T3 19v-1q0-.825.588-1.412T5 16h1V4q0-.825.588-1.412T8 2h11q.825 0 1.413.588T21 4v8q0 .425-.288.713T20 13t-.712-.288T19 12V4H8v12h5q.425 0 .713.288T14 17t-.288.713T13 18H5v1q0 .425.288.713T6 20h7q.425 0 .713.288T14 21t-.288.713T13 22zm7.875-2H5zM10 9q-.425 0-.712-.288T9 8t.288-.712T10 7h7q.425 0 .713.288T18 8t-.288.713T17 9zm0 3q-.425 0-.712-.288T9 11t.288-.712T10 10h7q.425 0 .713.288T18 11t-.288.713T17 12z'/%3E%3C/svg%3E");
        background-color: var(--button-color-negative-default);
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .delete-workout:hover {
        background-color: var(--button-color-negative-hover);
    }

</style>