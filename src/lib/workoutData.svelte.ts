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
        let current = perfMeasures.get(pm.id);
        if (!current) return;

        perfMeasures.set(pm.id, {
            ...current,
            reps: [...current.reps, 0],
            weight: [...current.weight, 0],
        });
    }

    function removeFromPerfMeasure(pm: WeightPerfT) {
        let current = perfMeasures.get(pm.id);
        if (!current) return;

        current.reps.pop();
        let reps = current.reps;

        current.weight.pop();
        let weight = current.weight;

        perfMeasures.set(pm.id, {
            ...current,
            reps: reps,
            weight: weight
        });
    }

    function setPerfMeasure(pm: WeightPerfT) {
        perfMeasures.set(pm.id, pm);
    }

    return {
        get workouts() {return workouts;},
        get exercises() {return exercises;},
        get perfMeasures() {return perfMeasures;},

        setWorkout,
        setExercise,
        setPerfMeasure,
        addToPerfMeasure,
        removeFromPerfMeasure
    };
}