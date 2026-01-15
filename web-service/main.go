package main

import (
	"strconv"

	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	router.Use(cors.New(config))

	/**
	 * 	Get and set the workouts.
	 */
	router.GET("/workouts", getWorkouts)
	router.POST("/workouts", setWorkouts)

	/**
	 * 	Get and set the workout templates.
	 */
	router.GET("/templates", getTemplates)
	router.POST("/templates", setTemplates)

	router.Run("localhost:8081")
}

func getWorkouts(c *gin.Context) {
	count, exists := c.GetQuery("count")

	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "value is required"})
		return
	}

	val, err := strconv.ParseInt(count, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "count is not in valid format"})
	}

	if val > int64(len(Workouts)) {
		val = int64(len(Workouts))
	}

	c.JSON(http.StatusOK, Workouts[0:val])
}

func setWorkouts(c *gin.Context) {

	var newWorkouts []Workout
	if err := c.ShouldBindJSON(&newWorkouts); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON for new workouts"})
	}

	Workouts = newWorkouts

	c.JSON(http.StatusAccepted, gin.H{"accepted": "workouts accepted"})
}

func getTemplates(c *gin.Context) {
	count, exists := c.GetQuery("count")

	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "value is required"})
		return
	}

	val, err := strconv.ParseInt(count, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "count is not in valid format"})
	}

	if val > int64(len(WorkoutTemplates)) {
		val = int64(len(WorkoutTemplates))
	}

	c.JSON(http.StatusOK, WorkoutTemplates[0:val])
}

func setTemplates(c *gin.Context) {

	var newWorkoutTemplates []WorkoutTemplate
	if err := c.ShouldBindJSON(&newWorkoutTemplates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON for new workout templates"})
	}

	WorkoutTemplates = newWorkoutTemplates

	c.JSON(http.StatusAccepted, gin.H{"accepted": "workout templates accepted"})
}
