<script lang="ts">

    import { Modal } from "flowbite-svelte";
    import { EXERCISE_CONTEXT, type ExerciseContext }  from "$lib/contexts/exercise";
    import { getContext } from "svelte";
    import { DATA, type WorkoutData } from "$lib/contexts/data";

	const workoutData = getContext<WorkoutData>(DATA);

    const { exerciseNames, addExerciseName } = getContext<ExerciseContext>(EXERCISE_CONTEXT);

    let { exerciseId } = $props<{ exerciseId: ID }>();

    let exercise = $derived.by(() => {
        return workoutData.exercises.get(exerciseId);
    });

    let perfMeasure = $derived.by(() => {
        return [...workoutData.perfMeasures.values()]
            .find(p => p.exerciseId == exerciseId);
    })

    let name = $state("");
    $effect(() => {
        name = exercise?.name ?? "None";
    })
    function updateName() {
        if (!exercise) return;
        workoutData.setExercise({...exercise, name: name});
    }

    let defaultModal = $state(false);
    let deleteModal = $state(false);

    let display = $state(false);

    // let filteredNames = $derived(
    //     exerciseNames.filter((name: string) => 
    //         name.toLowerCase().includes(exercise.name.toLowerCase())));

    function addSet(pm: WeightPerfT | undefined) {
        if (!pm) return;
        workoutData.addToPerfMeasure(pm);
    }

    function removeSet(pm: WeightPerfT | undefined) {
        if (!pm) return;
        workoutData.removeFromPerfMeasure(pm);
    }

    let setList: HTMLUListElement;

    /**
     * TODO: fix scrolling
     */
    function scrollRight() {
        const item = setList.querySelector('li');
        if (!item) return;

        const gap = 48; // match your CSS gap (3rem)
        const amount = item.clientWidth + gap;

        setList.scrollBy({
            left: amount,
            behavior: "smooth"
        });
    }

    function scrollLeft() {
        const item = setList.querySelector('li');
        if (!item) return;

        const gap = 48;
        const amount = item.clientWidth + gap;

        setList.scrollBy({
            left: -amount,
            behavior: "smooth"
        });
    }

    function updateReps(id: string, index: number, value: number) {
        const current = workoutData.perfMeasures.get(id);
        if (!current) return;

        const reps = [...current.reps];
        reps[index] = value;

        workoutData.perfMeasures.set(id, {
            ...current,
            reps
        });
    }

    function updateWeight(id: string, index: number, value: number) {
        const current = workoutData.perfMeasures.get(id);
        if (!current) return;

        const weight = [...current.weight];
        weight[index] = value;

        workoutData.perfMeasures.set(id, {
            ...current,
            weight
        });
    }

</script>

<div class="exercise-content">
    <div class="exercise-editor">

        <!-- Area with the input content -->
        <div id="text-input-area" class="exercise-name-area">
            <button id="input-area-button" class="vert-dots" aria-label="Exercise settings" onclick={() => (defaultModal = true)} ></button>
            <input type="text" required placeholder="Exercise..." class="exercise" bind:value={name} onfocus={() => display = true} onblur={updateName}/>
        </div>

        <!-- Two operation buttons -->
        <button aria-label="Remove set" onclick={() => removeSet(perfMeasure)} class="exercise-operation-button">
            <span class="minus"></span>
        </button>
        <button aria-label="Add set" onclick={() => addSet(perfMeasure)} class="exercise-operation-button">
            <span class="plus"></span>
        </button>

        <!-- Dropdown list-->
        <!-- <div class="dropdown-content" data-display={display}>
            <ul>
                {#if filteredNames.length > 0}
                    {#each filteredNames as item}
                        <li>
                            <button onmousedown={() => exercise.name = item}>{item}</button>
                        </li>
                    {/each}
                {/if}
            </ul>
        </div> -->

    </div>
    
    <div class="set-editor">

        <div class="labels">
            <h>Weight</h>
            <h>Reps</h>
        </div>

        <button aria-label="Go left" onclick={scrollLeft}>
            <span class="left-arrows"></span>
        </button>

        <!-- List with sets -->
        <ul bind:this={setList}>
            {#if perfMeasure}
                {#each perfMeasure?.reps as _, index}
                    <li>
                        <div class="set-values">
                            <input type="number" min=0 max=999 maxlength="3" value={perfMeasure.weight[index]} oninput={(e) => {
                                const value = e.currentTarget.valueAsNumber;
                                if (Number.isNaN(value)) return;
                                updateWeight(perfMeasure.id, index, value)}
                            }/> 
                            <input type="number" min=0 max=999 maxlength="3" value={perfMeasure.reps[index]} oninput={(e) => {
                                const value = e.currentTarget.valueAsNumber;
                                if (Number.isNaN(value)) return;
                                updateReps(perfMeasure.id, index, value)}
                            }/>
                        </div>
                    </li>
                {/each}
            {/if}
        </ul>

        <button aria-label="Go right" onclick={scrollRight}>
            <span class="right-arrows"></span>
        </button>
      
    </div>

    <Modal title="Edit exercise details:" form bind:open={defaultModal}>
        <div class="flex justify-start gap-2">
            <p>Delete this exercise.</p>
            <button class="delete" onclick={() => (deleteModal = true)}>Delete</button>
        </div>
    </Modal>

    <Modal title="Are you sure?" form bind:open={deleteModal}>
        <div class="flex justify-evenly">
            <!-- <button class="delete-yes" onclick={() => (removeExercise(name))}>Yes</button> -->
            <button class="delete-no" onclick={() => (deleteModal = false, defaultModal = true)}>No</button>
        </div>
    </Modal>
</div>

<style>

    li input {
        border: 0.15rem solid;
        border-radius: var(--border-radius);
        padding: 0.2rem 0.4rem;

        background-color: white;
        color: black;

        max-width: 3.8rem;
        min-width: 3rem;
    }

    .delete {
        background-color: var(--button-color-negative-default);
        border-radius: var(--border-radius);
        color: black;
        padding-inline: 0.4rem;
    }

    .delete:hover {
        background-color: var(--button-color-negative-hover);
    }

    .delete-yes {
        background-color: var(--color-green-600);
        border-radius: var(--border-radius);
        padding-inline: 0.4rem;
        color: black;
    }

    .delete-yes:hover {
        background-color: var(--color-green-400);
    }

    .delete-no {
        background-color: var(--color-red-600);
        border-radius: var(--border-radius);
        padding-inline: 0.4rem;
        color: black;
    }

    .delete-no:hover {
        background-color: var(--color-red-400);
    }

    
    /**
     *  Area with exercise editor.
     */
    .exercise-editor {
        display: flex;
        justify-content: start;
        align-items: center;
        margin-top: 0.5rem;
        margin-bottom: 1.2rem;

        position: relative; /* Used for the dropdown content to position itself. */
    }

    .exercise-name-area {
        display: flex;
        align-items: center;
    }

    .exercise-name-area > input {
        padding: 0 0.5rem 0 0;

        background-color: transparent;
        border-style: none;

        min-width: 2em;
        max-width: 12em;

        text-overflow: ellipsis;
    }

    .exercise-name-area > input::placeholder {
        color: grey;
        font-style: italic;
    }

    .exercise-operation-button {
        display: flex;
        align-items: center;
        justify-content: center;

        border: none;
        background: none;
    }

    .plus {
        display: inline-block;

        width: 1.5rem;
        height: 1.5rem;

        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M11 13v3q0 .425.288.713T12 17t.713-.288T13 16v-3h3q.425 0 .713-.288T17 12t-.288-.712T16 11h-3V8q0-.425-.288-.712T12 7t-.712.288T11 8v3H8q-.425 0-.712.288T7 12t.288.713T8 13zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8'/%3E%3C/svg%3E");
        background-color: var(--button-color-default);
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .plus:hover {
       background-color: var(--button-color-hover);
    }

    .minus {
        display: inline-block;

        width: 1.5rem;
        height: 1.5rem;

        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M8 13h8q.425 0 .713-.288T17 12t-.288-.712T16 11H8q-.425 0-.712.288T7 12t.288.713T8 13m4 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8'/%3E%3C/svg%3E");
        background-color: var(--highlight);
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .minus:hover {
        background-color: var(--highlight-dark);
    }

    .dropdown-content {
        display: none;
        position: absolute; /* Other elements act as if this element does not exist. */

        top: 100%;

        background-color: #f1f1f1;
        width: 10rem;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;

        border-radius: var(--border-radius-small);

        /* Enable vertical scrolling when content overflows */
        overflow-y: auto; 
        
        /* Hide horizontal scrollbar if not needed */
        overflow-x: hidden;

        max-height: 10rem;
    }
    
    .dropdown-content[data-display="true"] {
        display: block;
    }

    .dropdown-content button {
        width: 100%;
        background-color: var(--bg-color-tersiary);
        text-align: left;
        padding-inline: 0.5rem;
    }

    .dropdown-content button:hover {
        background-color: var(--highlight);
    }
 
    /**
     *  Area with set details.
     */
    .set-editor {
        display: flex;
        justify-content: start;
        width: 100%;
        height: 100px;
        overflow: hidden;
        gap: 1rem;
    }

    .set-editor ul {
        display: flex;
        justify-content: start;
        flex-wrap: nowrap;
        width: 100%;

        overflow-y: hidden;
        overflow-x: hidden;
    }

    .set-editor li {
        margin-inline: 0.5rem;
    }

    .set-editor button {
        border: none;
        background: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .set-editor button:hover {
        color: var(--button-color-hover);
    }

  
    .labels {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-weight: bold;
    }

    .vert-dots {
        display: inline-block;
        
        width: 1.5rem;
        height: 1.5rem;

        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 20q-.825 0-1.412-.587T10 18t.588-1.412T12 16t1.413.588T14 18t-.587 1.413T12 20m0-6q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m0-6q-.825 0-1.412-.587T10 6t.588-1.412T12 4t1.413.588T14 6t-.587 1.413T12 8'/%3E%3C/svg%3E");
        background-color: grey;
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }


    .left-arrows {
        display: inline-block;

        width:  2rem;
        height: 2rem;

        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m7.825 12l3.875 3.9q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.213-.325T5.426 12t.063-.375t.212-.325l4.6-4.6q.275-.275.688-.287t.712.287q.275.275.275.7t-.275.7zm6.6 0l3.875 3.9q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.213-.325T12.026 12t.063-.375t.212-.325l4.6-4.6q.275-.275.688-.287t.712.287q.275.275.275.7t-.275.7z'/%3E%3C/svg%3E");
        background-color: currentColor;
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .right-arrows {
        display: inline-block;

        width:  2rem;
        height: 2rem;
        
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M9.575 12L5.7 8.1q-.275-.275-.288-.687T5.7 6.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.687.288T5.7 17.3q-.275-.275-.275-.7t.275-.7zm6.6 0L12.3 8.1q-.275-.275-.288-.687T12.3 6.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.687.288T12.3 17.3q-.275-.275-.275-.7t.275-.7z'/%3E%3C/svg%3E");
        background-color: currentColor;
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .set-values {
        display: flex;
        justify-content: space-around;
        flex-direction: column;

        height: 100%;
    }

</style>