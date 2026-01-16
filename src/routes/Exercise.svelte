<script lang="ts">

    import { Modal } from "flowbite-svelte";
    import { EXERCISE_CONTEXT, type ExerciseContext }  from "$lib/contexts/exercise";
    import { getContext } from "svelte";

    const { exerciseNames, addExerciseName } = getContext<ExerciseContext>(EXERCISE_CONTEXT);

    let { exercise = $bindable() } = $props();

    let defaultModal = $state(false);
    let deleteModal = $state(false);

    let display = $state(false);

    let filteredNames = $derived(
        exerciseNames.filter((name: string) => 
            name.toLowerCase().includes(exercise.name.toLowerCase())));

    function addSet() {
        exercise.reps.push(0);
        exercise.weights.push(0);
    }

    function removeSet() {
        exercise.reps.pop();
        exercise.weights.pop();
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

    function blur() {
        display = false;
        addExerciseName(exercise.name);
    }


</script>

<div class="exercise-content">
    <div class="exercise-editor">
        <!-- Area with the input content -->
        <div class="input-content">
            <button aria-label="Exercise settings" onclick={() => (defaultModal = true)} class="icon-button">
                <span class="material-symbols--more-vert"></span>
            </button>
            <input type="text" required placeholder="Exercise..." class="exercise" bind:value={exercise.name} onfocus={() => display = true} onblur={blur}/>
        </div>

        <!-- Two operation buttons -->
        <button aria-label="Remove set" onclick={removeSet} class="operation-button">
            <span class="material-symbols--do-not-disturb-on-outline-rounded"></span>
        </button>
        <button aria-label="Add set" onclick={addSet} class="operation-button">
            <span class="material-symbols--add-circle-outline-rounded"></span>
        </button>

        <!-- Dropdown list-->
        <div class="dropdown-content" data-display={display}>
            <ul>
                {#if filteredNames.length > 0}
                    {#each filteredNames as item}
                        <li><button class="w-full hover:bg-blue-600 text-left" onmousedown={() => exercise.name = item}>{item}</button></li>
                    {/each}
                {/if}
            </ul>
        </div>

    </div>
    
    <div class="set-content">

        <div class="labels">
            <h>Weight</h>
            <h>Reps</h>
        </div>

        <button aria-label="Go left" onclick={scrollLeft}>
            <span class="material-symbols--keyboard-double-arrow-left-rounded"></span>
        </button>

        <!-- List with sets -->
        <ul bind:this={setList}>
            {#each Array.from({length: exercise.reps.length}) as _, i}
                <li >
                    <div class="set">
                        <input type="number" min=0 max=999 maxlength="3" bind:value={exercise.weights[i]}/> 
                        <input type="number" min=0 max=999 maxlength="3" bind:value={exercise.reps[i]}/>
                    </div>
                </li>
            {/each}
        </ul>

        <button aria-label="Go right" onclick={scrollRight}>
            <span class="material-symbols--keyboard-double-arrow-right-rounded"></span>
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

    .exercise-editor {
        display: flex;
        justify-content: start;
        align-items: center;
        margin-top: 0.5rem;
        margin-bottom: 1.2rem;

        position: relative; /* Used for the dropdown content to position itself. */
    }

    .input-content {
        display: flex;
        align-items: center;
        border-radius: var(--border-radius);
        border: 0.15rem solid;
        border-color: var(--border-color);
    }

    .set-content {
        display: flex;
        justify-content: start;
        width: 100%;
        height: 100px;
        overflow: hidden;
        gap: 1rem;
    }

    .set-content ul {
        display: flex;
        justify-content: start;
        flex-wrap: nowrap;
        width: 100%;

        overflow-y: hidden;
        overflow-x: hidden;
    }

    .set-content li {
        margin-inline: 0.5rem;
    }

    .set-content button {
        border: none;
        background: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .set-content button:hover {
        color: var(--button-color-hover);
    }

    .dropdown-content {
        display: none;
        position: absolute; /* Other elements act as if this element does not exist. */

        top: 100%;

        background-color: #f1f1f1;
        width: 10rem;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;

        /* Enable vertical scrolling when content overflows */
        overflow-y: auto; 
        
        /* Hide horizontal scrollbar if not needed */
        overflow-x: hidden;

        max-height: 10rem;
    }
    

    .dropdown-content[data-display="true"] {
        display: block;
    }

    .dropdown-content button:hover {
        background-color: var(--button-color-hover);
    }

    .labels {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-weight: bold;
    }

    .exercise {
        padding: 0;
        background-color: rgba(255, 0, 0, 0);
        min-width: 2em;
        max-width: 8em;
        border-style: none;
    }

    .exercise::placeholder {
        color: rgb(71, 71, 71);
        font-style: italic;
    }

    .icon-button {
        padding: 0;
        margin: 0;
        border: none;
        background: none;
        line-height: 0; /* IMPORTANT */
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    /* Vertical ellipse operation button*/    
    .operation-button {
        border: none;
        background: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    
    .material-symbols--more-vert {
        display: inline-block;
        width: 24px;
        height: 24px;
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 20q-.825 0-1.412-.587T10 18t.588-1.412T12 16t1.413.588T14 18t-.587 1.413T12 20m0-6q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m0-6q-.825 0-1.412-.587T10 6t.588-1.412T12 4t1.413.588T14 6t-.587 1.413T12 8'/%3E%3C/svg%3E");
        background-color: grey;
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .material-symbols--more-vert:hover {
        background-color: black;
    }


    /* Addition operation button */
    .material-symbols--add-circle-outline-rounded {
        display: inline-block;
        width: 24px;
        height: 24px;
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M11 13v3q0 .425.288.713T12 17t.713-.288T13 16v-3h3q.425 0 .713-.288T17 12t-.288-.712T16 11h-3V8q0-.425-.288-.712T12 7t-.712.288T11 8v3H8q-.425 0-.712.288T7 12t.288.713T8 13zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8'/%3E%3C/svg%3E");
        background-color: var(--button-color-default);
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .material-symbols--add-circle-outline-rounded:hover {
       background-color: var(--button-color-hover);
    }

    /* Remove operation button */
    .material-symbols--do-not-disturb-on-outline-rounded {
        display: inline-block;
        width: 24px;
        height: 24px;
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M8 13h8q.425 0 .713-.288T17 12t-.288-.712T16 11H8q-.425 0-.712.288T7 12t.288.713T8 13m4 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8'/%3E%3C/svg%3E");
        background-color: var(--button-color-negative-default);
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .material-symbols--do-not-disturb-on-outline-rounded:hover {
        background-color: var(--button-color-negative-hover);
    }


    .material-symbols--keyboard-double-arrow-left-rounded {
        display: inline-block;
        width: 24px;
        height: 24px;
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m7.825 12l3.875 3.9q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.213-.325T5.426 12t.063-.375t.212-.325l4.6-4.6q.275-.275.688-.287t.712.287q.275.275.275.7t-.275.7zm6.6 0l3.875 3.9q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.213-.325T12.026 12t.063-.375t.212-.325l4.6-4.6q.275-.275.688-.287t.712.287q.275.275.275.7t-.275.7z'/%3E%3C/svg%3E");
        background-color: currentColor;
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .material-symbols--keyboard-double-arrow-right-rounded {
        display: inline-block;
        width: 24px;
        height: 24px;
        --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M9.575 12L5.7 8.1q-.275-.275-.288-.687T5.7 6.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.687.288T5.7 17.3q-.275-.275-.275-.7t.275-.7zm6.6 0L12.3 8.1q-.275-.275-.288-.687T12.3 6.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.687.288T12.3 17.3q-.275-.275-.275-.7t.275-.7z'/%3E%3C/svg%3E");
        background-color: currentColor;
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    .set {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        height: 100%;
    }

    .set input {
        border: 0.15rem solid;
        border-radius: 0.4rem;
        border-color: var(--border-color);
        padding: 0.2rem 0.4rem;

        max-width: 3.8rem;
        min-width: 3rem;
    }

</style>