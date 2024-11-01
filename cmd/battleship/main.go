package main

import "github.com/gin-gonic/gin"

func main() {

	router := gin.Default()

	v1_group := router.Group("/v1")
	web_v1_group := v1_group.Group("/web")
	// api_v1_group := v1_group.Group("/api")

	router.LoadHTMLGlob("web/templates/*")
	router.Static("/v1/web/static", "./web/dist")

	web_v1_group.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", gin.H{})
	})

	router.Run(":3000")
}
