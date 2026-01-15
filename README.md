# Weight Training Tracker

Simple application to allow the tracking of weight training progress. This application is mainly just for becoming more familiar with Svelte and Golang and does not yet have complete documentation.

## Minimum Desired Functionality

- Create workouts. Workouts have an editbale name and date attached.
- Add exercises to workouts. Exercises consist of sets which contain the repetitions and weight.
- Create workout templates. Templates have an editable name and contain exercises and set counts. This allows for faster creation of a workout.
- Search for a given exercise. This show all the different occurences of that exercise across workouts which allows the user to more easily see their progress for that exercise.
- UI/UX is currently oprimised for desktop usage. These elements must be adapted for mobile use.

## Additional Functionality

- Exercises must have TYPES. For example, a user can select whether the exercise WEIGHT is measuerd in kgs or lbs. Other TYPES that exclude WEIGHT can be TIME, DISTANCE (m or yds), ENERGY (kcal or kJ).

## Run on Localhost

- Front-end: `npm run dev -- --open`
- Back-end: `cd web-service; go run .`