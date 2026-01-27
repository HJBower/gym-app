type Workout = {
    name: string;
    date: Date;
}

type Exercise = {
    name: string;
    workout: Workout;
}

type PerfMeasure = {
    reps: number;
    weight: number;
    index: number;
    exercise: Exercise;
}

export default class BatchUpdate {

    private static instance: BatchUpdate;
    
    private workouts: Workout[] = [];
    private revWorkouts: Workout[] = [];
    private upWorkouts: Map<Workout, string> = new Map<Workout, string>();

    private exercises: Exercise[] = [];
    private revExercises: Exercise[] = [];
    private upExercises: Map<Exercise, string> = new Map<Exercise, string>();

    private perfMeasures: PerfMeasure[] = [];
    private revPerfMeasure: PerfMeasure[] = [];
    private upPerfMeasure: Map<PerfMeasure, string> = new Map<PerfMeasure, string>();

    private batching: boolean = false;

    private constructor() {}

    public static getInstance(): BatchUpdate {
        if (!BatchUpdate.instance) {
            BatchUpdate.instance = new BatchUpdate();
        }
        return BatchUpdate.instance;
    }

    /**
     * Add a workout.
     * 
     * @param workout Workout to add.
     */
    public addWorkout(workout: Workout): void {
        this.startLogs();
        this.workouts.push(workout);
    }


    /**
     * Remove a workout. An attempt is made to remove the workout that
     * is currently in memory. Else, it is added to a seperate
     * list of workouts to remove from the database.
     * 
     * @param workout Workout to remove.
     */
    public removeWorkout(workout: Workout): void {
        this.startLogs();

        let lenBefore = this.workouts.length;
        this.workouts = this.workouts.filter((w) =>
            w.name != workout.name || 
            w.date != workout.date
        );

        if (lenBefore == this.workouts.length) {
            this.revWorkouts.push(workout);
        }

        this.exercises = this.exercises.filter((e) => 
            e.workout.name != workout.name || 
            e.workout.date != workout.date
        )

        this.perfMeasures = this.perfMeasures.filter((p) =>
            p.exercise.workout.name != workout.name || 
            p.exercise.workout.date != workout.date
        )
    }

    /**
     * Update the name of a workout. An attempt is made to
     * update the workout that is currently in memory. Else,
     * the new name is added to a seperate map of workouts
     * and new names to update the database.
     * 
     * @param name New name for workout.
     * @param workout Workout to update.
     */
    // public updateWorkoutName(name: string, workout: Workout) {
    //     this.startLogs();

    //     let found = false;
    //     this.workouts.forEach((w) => {
    //         if (w.name == workout.name && w.date == workout.date) {
    //             found = true;
    //             w.name = name;
    //         }
    //     })

    //     if (!found) {
    //         this.upWorkouts.set(workout, name);
    //     }
    // }

    public addExercise(exercise: Exercise) {
        this.startLogs();
        this.exercises.push(exercise);
    }

    public removeExercise(exercise: Exercise) {
        this.startLogs();

        let lenBefore = this.exercises.length;
        this.exercises = this.exercises.filter((e) => 
            e.name != exercise.name || 
            e.workout.name != exercise.workout.name ||
            e.workout.date != exercise.workout.date
        );

        if (lenBefore == this.exercises.length) {
            this.revExercises.push(exercise);
        }

        this.perfMeasures = this.perfMeasures.filter((p) =>
            p.exercise.name != exercise.name ||
            p.exercise.workout.name != exercise.workout.name || 
            p.exercise.workout.date != exercise.workout.date
        )
    }

    public addPerfMeasure(perfMeasure: PerfMeasure) {
        this.startLogs();
        this.addPerfMeasure(perfMeasure);
    }

    public removePerfmeasure(perfMeasure: PerfMeasure) {
        this.startLogs();

        let lenBefore = this.perfMeasures.length;
        this.perfMeasures = this.perfMeasures.filter((p) => p.index != perfMeasure.index || 
            p.exercise.name != perfMeasure.exercise.name ||
            p.exercise.workout.name != perfMeasure.exercise.workout.name ||
            p.exercise.workout.date != perfMeasure.exercise.workout.date 
        );

        if (lenBefore == this.perfMeasures.length) {
            this.revPerfMeasure.push(perfMeasure);
        }
    }


    private startLogs(): void {
        if (!this.batching) {
			setTimeout(() => this.printLogs(), 5000);
			this.batching = true;
		}
    }

    private printLogs() {
        for (const perfMeasure of this.perfMeasures) {
            console.log(perfMeasure);
        }

        for (const exercise of this.exercises) {
            console.log(exercise);
        }

        for (const workout of this.workouts) {
            console.log(workout);
        }

        this.workouts = [];
        this.revWorkouts = [];

        this.exercises = [];
        this.revExercises = [];

        this.perfMeasures = [];
        this.revPerfMeasure = [];

        this.batching = false;        
    }
}