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

	type ExerciseType = {
		name: string;
		reps: number[];
		weights: number[];
	}

	type WorkoutType = {
		name: string;
		date: string;
		exercises: ExerciseType[];
	}

	type ExerciseTemplateType = {
		name: string;
		sets: number;
	}

	type WorkoutTemplateType = {
		name: string;
		exercises: ExerciseTemplateType[];
	}

	type SearchEntryType = {
		name: string;
		dates: string[];
		effortMeasure: WeightEffortType[]; 
	}

	type WeightEffortType = {
		reps: number[];
		weights: number[];
	}
}

export {};
