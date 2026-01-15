package main

type WorkoutTemplate struct {
	Name      string             `json:"name"`
	Exercises []ExerciseTemplate `json:"exercises"`
}

type ExerciseTemplate struct {
	Name string `json:"name"`
	Sets int8   `json:"sets"`
}

type Workout struct {
	Name      string     `json:"name"`
	Date      string     `json:"date"`
	Exercises []Exercise `json:"exercises"`
}

type Exercise struct {
	Name    string    `json:"name"`
	Reps    []int8    `json:"reps"`
	Weights []float32 `json:"weights"`
}

var exercise1 = Exercise{
	Name:    "Bench Press",
	Reps:    []int8{12, 12, 12, 12},
	Weights: []float32{30.0, 50.0, 60.0, 65.0},
}

var exercise2 = Exercise{
	Name:    "Bicep Curl",
	Reps:    []int8{12, 12, 12, 12},
	Weights: []float32{30.0, 50.0, 60.0, 65.0},
}

var exercise3 = Exercise{
	Name:    "Squat",
	Reps:    []int8{12, 12, 12, 12},
	Weights: []float32{30.0, 50.0, 60.0, 65.0},
}

var Workouts = []Workout{
	{
		Name:      "Friday Chest Session",
		Date:      "01/01/2026",
		Exercises: []Exercise{exercise1, exercise2}},
	{
		Name:      "Thursday Leg Session",
		Date:      "01/02/2026",
		Exercises: []Exercise{exercise3}},
}

var WorkoutTemplates = []WorkoutTemplate{
	{
		Name: "Chest Day",
		Exercises: []ExerciseTemplate{
			{Name: "Bench", Sets: 4},
		},
	},
	{
		Name: "Leg Day",
		Exercises: []ExerciseTemplate{
			{Name: "Squat", Sets: 4},
			{Name: "Leg Press", Sets: 3},
		},
	},
}
