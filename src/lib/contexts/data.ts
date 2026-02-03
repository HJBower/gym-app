export const DATA = Symbol("data-context");
export type WorkoutData = ReturnType<typeof import("../workoutData.svelte").createWorkoutData>;