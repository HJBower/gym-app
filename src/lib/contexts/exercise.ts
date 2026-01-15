export const EXERCISE_CONTEXT = Symbol("exercise-context");

export type ExerciseContext = {
    exerciseNames: string[];
    addExerciseName: (name: string) => void;
}