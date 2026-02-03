// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type ID = string;

	type WorkoutT = {
		id: ID;
		name: string;
		date: string;
	}

	type ExerciseT = {
		id: ID;
		workoutId: ID;
		name: string;
		index: number;
	}

	type WeightPerfT = {
		id: ID;
		exerciseId: ID;
		reps: number[];
		weight: number[];
	}

	type WorkoutDataT = {
		workouts: WorkoutT[];
		exercises: ExerciseT[];   
		perfMeasures: WeightPerfT[]; 
	}

	type SearchEntryT = {
		name: string;
		dates: string[];
		effortMeasure: WeightEffortType[]; 
	}

	type ExerciseTemplateT = {
		name: string;
		sets: number;
	}

	type WorkoutTemplateT = {
		name: string;
		exercises: ExerciseTemplateT[];
	}
}

export {};
