<script lang="ts">

    import { Accordion, AccordionItem } from "flowbite-svelte";

    import Down from "@iconify-svelte/material-symbols/keyboard-double-arrow-down-rounded";
    import Up from "@iconify-svelte/material-symbols/chevron-line-up-rounded";

    let { template = $bindable() } = $props();

    function addExercise() {
        template.exercises.push({
            name: "",
            sets: 0
        });
    }

    let exerciseList: HTMLUListElement;

    /**
     * TODO: fix scrolling
     */
    function scrollRight() {
        const item = exerciseList.querySelector("li");
        if (!item) return;

        const gap = 16*0.4; // match your CSS gap (3rem)
        const amount = item.clientWidth + gap;

        exerciseList.scrollBy({
            left: amount,
            behavior: "smooth"
        });
    }

    function scrollLeft() {
        const item = exerciseList.querySelector("li");
        if (!item) return;

        const gap = 16*0.4;
        const amount = item.clientWidth + gap;

        exerciseList.scrollBy({
            left: -amount,
            behavior: "smooth"
        });
    }

</script>


<div>
    <Accordion inactiveClass="border-gray-300 bg-sky-600" activeClass="border-gray-300 bg-sky-400">
    <AccordionItem>
        {#snippet header()}
           <input class="input-template" bind:value={template.name} placeholder="Enter template name..." />
        {/snippet}
        {#snippet arrowup()}<Up width=1.25rem height=1.25rem/>{/snippet}
        {#snippet arrowdown()}<Down width=1.25rem height=1.25rem/>{/snippet}
        
        <div class="template-content">

            <button aria-label="Go left" onclick={scrollLeft}>
                <span class="material-symbols--keyboard-double-arrow-left-rounded"></span>
            </button>

            <ul bind:this={exerciseList}>
                {#each template.exercises as _, i}
                    <li>
                        <input class="input-name" placeholder="Exercise..." bind:value={template.exercises[i].name}/> <!-- name of exercise -->
                        <input class="input-sets" type="number" defaultValue=0 bind:value={template.exercises[i].sets}/> <!-- number of sets -->
                    </li>
                {/each}
            </ul>

            <button aria-label="Go right" onclick={scrollRight}>
                <span class="material-symbols--keyboard-double-arrow-right-rounded"></span>
            </button>

        </div>

        <div class="flex justify-center pt-[0.4rem]">
            <button aria-label="Add exercise" class="material-symbols--library-add-rounded" onclick={addExercise}></button>
        </div>
               
    </AccordionItem>
    </Accordion>
</div>

<style>

    .template-content {
        display: flex;
        gap: 1rem;
    }

    .template-content button:hover {
        color: var(--button-color-hover);
    }

    .input-template {
        border: none;
        font-weight: bold;
    }

    .input-template:focus {
       outline: none;
    }

    .input-template::placeholder {
        font-style: italic;
    }

    li {
        flex-shrink: 0;

        border-radius: var(--border-radius);
        border: 0.15rem solid;
        border-color: var(--border-color);
        padding-left: 0.8rem;
        padding-right: 0.8rem;
    }

    .input-name {
        width: 10rem;
        border: none;
    }

    .input-name:focus {
        outline: none;
    }

    .input-name::placeholder {
        color: rgb(71, 71, 71);
        font-style: italic;
    }

    ul {
        display: flex;
        justify-content: start;
        flex-wrap: nowrap;
        
        overflow-x: hidden;
        overflow-y: hidden;

        width: 100%;

        gap: 0.4rem;
    }

    .input-sets {
        width: 2rem;
        padding-left: 0;
        padding-right: 0;
        border: none;
        background-color: rgba(255, 255, 255, 0);
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

</style>