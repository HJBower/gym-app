import { idGenerator } from "flowbite-svelte";

type ID = string;

type WeightPerf = {
    reps: number;
    weight: number;
}

type Workout = {
    id: ID;

    name: string;
    date: Date;
}

type Exercise = {
    id: ID;
    workoutId: ID;

    name: string;
    index: number;
}

type PerfMeasure = {
    id: ID;
    exerciseId: ID;

    weightPerf: WeightPerf;
    index: number;
}


type BatchPayload = {
    workouts: {
        add: Workout[];
        remove: ID[];
        update: { id: ID, name: string }[];
    };
    exercises: {
        add: Exercise[];
        remove: ID[];
        update: { id: ID; name: string }[];
    }
    perfMeasrues: {
        add: PerfMeasure[];
        remove: ID[];
        update: { id: ID; weightPerf: WeightPerf }[];
    }
}

export default class BatchUpdate {

    private static instance: BatchUpdate;
    
    private workouts: Workout[] = [];
    private remWorkouts: ID[] = [];
    private upWorkouts: Map<ID, string> = new Map<ID, string>();

    private exercises: Exercise[] = [];
    private remExercises: ID[] = [];
    private upExercises: Map<ID, string> = new Map<ID, string>();

    private perfMeasures: PerfMeasure[] = [];
    private remPerfMeasures: ID[] = [];
    private upPerfMeasures: Map<ID, WeightPerf> = new Map<ID, WeightPerf>(); 

    private batching: boolean = false;

    private constructor() {}

    public static getInstance(): BatchUpdate {
        if (!BatchUpdate.instance) {
            BatchUpdate.instance = new BatchUpdate();
        }
        return BatchUpdate.instance;
    }

    public addWorkout(workout: Workout) {
        this.startCollection();
        this.workouts.push(workout);
    }

    public removeWorkout(workoutId: ID) {
        this.startCollection();
        this.remWorkouts.push(workoutId);
    }

    public updateWorkoutName(name: string, workoutId: ID) {
        this.startCollection();
        this.upWorkouts.set(workoutId, name);
    }

    public addExercise(exercise: Exercise) {
        this.startCollection();
        this.exercises.push(exercise);
    }

    public removeExercise(exerciseId: ID) {
        this.startCollection();
        this.remExercises.push(exerciseId);
    }

    public updateExerciseName(name: string, exerciseId: ID) {
        this.startCollection();
        this.upExercises.set(exerciseId, name);
    }

    public addPerfMeasure(perfMeasure: PerfMeasure) {
        this.startCollection();
        this.perfMeasures.push(perfMeasure);
    }   

    public removePerfMeasure(perfMeasureId: ID) {
        this.startCollection();
        this.remPerfMeasures.push(perfMeasureId);
    }

    public updatePerfMeasure(weightPerf: WeightPerf, perfMeasureId: ID) {
        this.startCollection();
        this.upPerfMeasures.set(perfMeasureId, weightPerf);
    }

    private startCollection(): void {
        if (!this.batching) {
			setTimeout(() => this.sendCollection(), 5000);
			this.batching = true;
		}
    }

    private sendCollection() {

        const payload: BatchPayload = {
            workouts: {
                add: this.workouts,
                remove: this.remWorkouts,
                update: [...this.upWorkouts.entries()].map(([id, name]) => ({
                    id,
                    name
                }))
            },
            exercises: {
                add: this.exercises,
                remove: this.remExercises,
                update: [...this.upExercises.entries()].map(([id, name]) => ({
                    id,
                    name
                }))
            },
            perfMeasrues: {
                add: this.perfMeasures,
                remove: this.remExercises,
                update: [...this.upPerfMeasures.entries()].map(([id, weightPerf]) => ({
                    id,
                    weightPerf
                }))
            }
        }

        console.log(payload)

        this.batching = false;        
    }
}