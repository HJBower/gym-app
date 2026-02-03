package main

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/golang-jwt/jwt/v5"
)

var users = map[string]string{
	"myemail@test.com": "MyPassword123@",
}

// TODO: env variable
var secret = []byte("my-secret")

func main() {
	router := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Authorization", "Content-Type"}
	router.Use(cors.New(config))

	router.POST("/login", Login)
	router.POST("/signup", Signup)

	auth := router.Group("/", AuthJWT())
	{
		/**
		* 	Get and set the workouts.
		 */
		auth.GET("/workouts", GetWorkouts)
		// auth.POST("/workouts", SetWorkouts)

		/**
		* 	Get and set the workout templates.
		 */
		// auth.GET("/templates", GetTemplates)
		// auth.POST("/templates", SetTemplates)
	}

	router.Run("localhost:8081")
}

func GetWorkouts(c *gin.Context) {
	count, exists := c.GetQuery("count")

	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "value is required"})
		return
	}

	val, err := strconv.ParseInt(count, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "count is not in valid format"})
		return
	}

	if val > int64(len(MyData.Exercises)) {
		val = int64(len(MyData.Exercises))
	}

	c.JSON(http.StatusOK, MyData)
}

// func SetWorkouts(c *gin.Context) {

// 	var newWorkouts []Workout
// 	if err := c.ShouldBindJSON(&newWorkouts); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON for new workouts"})
// 		return
// 	}

// 	Workouts = newWorkouts

// 	c.JSON(http.StatusAccepted, gin.H{"accepted": "Workouts accepted"})
// }

// func GetTemplates(c *gin.Context) {
// 	count, exists := c.GetQuery("count")

// 	if !exists {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Value is required"})
// 		return
// 	}

// 	val, err := strconv.ParseInt(count, 10, 64)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Count not in valid format"})
// 		return
// 	}

// 	if val > int64(len(WorkoutTemplates)) {
// 		val = int64(len(WorkoutTemplates))
// 	}

// 	c.JSON(http.StatusOK, WorkoutTemplates[0:val])
// }

// func SetTemplates(c *gin.Context) {

// 	var newWorkoutTemplates []WorkoutTemplate
// 	if err := c.ShouldBindJSON(&newWorkoutTemplates); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON for new workout templates"})
// 		return
// 	}

// 	WorkoutTemplates = newWorkoutTemplates

// 	c.JSON(http.StatusAccepted, gin.H{"accepted": "Workout templates accepted"})
// }

func Signup(c *gin.Context) {

	type CreateUserRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON for sign-up request"})
		return
	}

	// Does user already exist
	_, exists := users[req.Username]
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": "user is already registered"})
		return
	}

	// Save user
	users[req.Username] = req.Password

	c.JSON(http.StatusOK, gin.H{"accept": "user has been created"})
}

func Login(c *gin.Context) {

	type LoginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON for login request"})
		return
	}

	// Validate user; obviously extend to be more intricate
	password, exists := users[req.Username]
	if !exists || password != req.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Create JWT
	// TODO: create UUID for the JTI field.
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(8 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		Subject:   req.Username,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(secret)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": signedToken})
}

func AuthJWT() gin.HandlerFunc {
	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing or invalid"})
			c.Abort() // Everything else after middleware is not called
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Perform type assertion of signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return secret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort() // Everything else after middleware is not called
			return
		}

		c.Next()
	}
}
