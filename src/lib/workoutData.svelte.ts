import { SvelteMap } from "svelte/reactivity";

export function createWorkoutData() {
    let workouts: Map<ID, WorkoutT> = new SvelteMap();
    let exercises: Map<ID, ExerciseT> = new SvelteMap();
    let perfMeasures: Map<ID, WeightPerfT> = new SvelteMap();

    function setWorkout(w: WorkoutT) {
        workouts.set(w.id, w);
    }

    function setExercise(e: ExerciseT) {
        exercises.set(e.id, e);
    }

    function addToPerfMeasure(pm: WeightPerfT) {
        let perfMeasure = perfMeasures.get(pm.id);
        if (!perfMeasure) return;

        perfMeasure.reps.push(0);
        perfMeasure.weight.push(0);

        perfMeasures.set(pm.id, perfMeasure);
    }

    function removeFromPerfMeasure(pm: WeightPerfT) {
        perfMeasures.set("xxx", pm)
        let perfMeasure = perfMeasures.get(pm.id);
        if (!perfMeasure) return;

        perfMeasure.reps.pop();
        perfMeasure.weight.pop();

        perfMeasures.set(pm.id, perfMeasure);
    }

    function setPerfMeasure(pm: WeightPerfT) {
        perfMeasures.set(pm.id, pm);
    }

    function setWeight(pm: WeightPerfT, index: number, w: number) {
        let perfMeasure = perfMeasures.get(pm.id);
        if (!perfMeasure) return;

        perfMeasure.weight[index] = w;
        perfMeasures.set(pm.id, perfMeasure);
    }

    return {
        get workouts() {return workouts;},
        get exercises() {return exercises;},
        get perfMeasures() {return perfMeasures;},

        setWorkout,
        setExercise,
        setPerfMeasure,
        setWeight,
        addToPerfMeasure,
        removeFromPerfMeasure
    };
}