<script lang="ts">

    import {Accordion, AccordionItem} from "flowbite-svelte";

    import Down from "@iconify-svelte/material-symbols/keyboard-double-arrow-down-rounded";
    import Up from "@iconify-svelte/material-symbols/chevron-line-up-rounded";

    import Exercise from "./Exercise.svelte";

    let { workout = $bindable() } = $props();

    let edit = $state(false);

    function addExercise() {
        workout.exercises.push({name: "", reps: [0], weights: [0.0]});
    }

    // function removeExercise(name: string) {
    //     workout.exercises.filter(exercise => exercise.name != name);
    // }

</script>

<div>
    <Accordion inactiveClass="border-gray-300 bg-sky-600" activeClass="border-gray-300 bg-sky-400">
    <AccordionItem>
        {#snippet header()}
            <div class="accordion-header">
                <input type="text" 
                    bind:value={workout.name} 
                    data-edit={edit} 
                    onfocus={() => (edit = true)} 
                    onblur={() => (edit = false)}
                    onclick={(e) => (e.stopPropagation())}
                    onkeydown={(e) => (e.stopPropagation())}
                />
                <div class="text-sm">{workout.date}</div>
            </div>    
        {/snippet}
        {#snippet arrowup()}<Up width=1.25rem height=1.25rem/>{/snippet}
        {#snippet arrowdown()}<Down width=1.25rem height=1.25rem/>{/snippet}
        
        {#if workout.exercises.length > 0}
            <ul>
                {#each workout.exercises as _, i}
                    <li>
                        <Exercise bind:exercise={workout.exercises[i]} />
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="flex justify-center p-2">No exercises currently included in workout.</p>
        {/if}

        <div class="flex justify-center">
            <button aria-label="Add exercise" class="material-symbols--library-add-rounded" onclick={addExercise}></button>
        </div>
        
    </AccordionItem>
    </Accordion>
</div>

<style>

    input {
        padding: 0;
        border-style: none;
        background-color: rgba(0, 0, 0, 0);

        font-weight: bold;
        text-overflow: ellipsis;
    }

    input[data-edit="true"] {
        font-weight: bold;
        font-style: italic;
        text-decoration-line: underline;
        text-decoration-thickness: 1px;
        background-color: rgba(0, 0, 0, 0);
    }

    .accordion-header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
    }

    .material-symbols--library-add-rounded {
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

    .material-symbols--library-add-rounded:hover {
        background-color: var(--button-color-hover);
        animation: pulse 1000ms cubic-bezier(0.9, 0.7, 0.5, 0.9) infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 0.4;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.8;
        }
    }

</style>