package main

type WorkoutTemplate struct {
	Name      string             `json:"name"`
	Exercises []ExerciseTemplate `json:"exercises"`
}

type ExerciseTemplate struct {
	Name string `json:"name"`
	Sets int8   `json:"sets"`
}

type WorkoutData struct {
	Workouts     []Workout    `json:"workouts"`
	Exercises    []Exercise   `json:"exercises"`
	PerfMeasures []WeightPerf `json:"perfMeasures"`
}

type Workout struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Date string `json:"date"`
}

type Exercise struct {
	ID        string `json:"id"`
	WorkoutID string `json:"workoutId"`
	Name      string `json:"name"`
	Index     uint16 `json:"index"`
}

type WeightPerf struct {
	ID         string    `json:"id"`
	ExerciseID string    `json:"exerciseId"`
	Reps       []uint16  `json:"reps"`
	Weight     []float32 `json:"weight"`
}

var workout1 = Workout{
	ID:   "xxxx-xxxx-xxxx",
	Name: "Friday Chest Session",
	Date: "2026-01-01T12:30:00.000Z",
}

var workout2 = Workout{
	ID:   "yyyy-yyyy-yyyy",
	Name: "Thursday Leg Session",
	Date: "2026-01-02T12:30:00.000Z",
}

var exercise1 = Exercise{
	ID:        "aa-aa",
	WorkoutID: "xxxx-xxxx-xxxx",
	Name:      "Bench Press",
	Index:     1,
}

var exercise2 = Exercise{
	ID:        "bb-bb",
	WorkoutID: "xxxx-xxxx-xxxx",
	Name:      "Tricep Pushdowns",
	Index:     2,
}

var exercise3 = Exercise{
	ID:        "cc-cc",
	WorkoutID: "yyyy-yyyy-yyyy",
	Name:      "Squats",
	Index:     1,
}

var perfMeasure1 = WeightPerf{
	ID:         "a",
	ExerciseID: "aa-aa",
	Reps:       []uint16{12, 12, 12},
	Weight:     []float32{30, 30, 30},
}

var perfMeasure2 = WeightPerf{
	ID:         "b",
	ExerciseID: "bb-bb",
	Reps:       []uint16{12, 12, 12},
	Weight:     []float32{30, 30, 30},
}

var perfMeasure3 = WeightPerf{
	ID:         "c",
	ExerciseID: "cc-cc",
	Reps:       []uint16{12, 12, 12},
	Weight:     []float32{30, 30, 30},
}

var MyData = WorkoutData{
	Workouts:     []Workout{workout1, workout2},
	Exercises:    []Exercise{exercise1, exercise2, exercise3},
	PerfMeasures: []WeightPerf{perfMeasure1, perfMeasure2, perfMeasure3},
}
