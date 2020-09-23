package main

import (
	"fmt"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/contrib/static"
	"github.com/jinzhu/gorm"
	"log"
)

//id, caption, code, rating, product, brand, style, abv_dbl, description
type Post struct {
	Id string `json:"id"`
	Description string `json:"description"`
	Code string `json:"code"`
	Src string `json:"src"`
	Rating string `json:"rating"`

	Product string `json:"product"`
	Brand string `json:"brand"`
	Style string `json:"style"`
	AbvDbl string `json:"abv_dbl"`
	StyleQP string `json:"styleQP"`


}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dbport := os.Getenv("DB_PORT")
	dbuser := os.Getenv("DB_USER")
	dbpass := os.Getenv("DB_PASS")
	serverport := os.Getenv("SERVER_PORT")

	dbstr := fmt.Sprintf("%s:%s@tcp(127.0.0.1:%s)/beer?charset=utf8mb4&parseTime=True&loc=Local", dbuser, dbpass, dbport )


	db, err := gorm.Open("mysql", dbstr)
	if err != nil {
		log.Fatalf("Got error when connect database, the error is '%v'", err)
	}

	r := gin.Default()
	r.Use(SetDBtoContext(db))
	r.Use(cors.Default())

	r.GET("/", Api)
	r.GET("/brands", Brands)
	r.Use(static.Serve("/th", static.LocalFile("./th", true)))
	r.Run(":"+serverport)

}

func Brands(c *gin.Context)  {
	db := DBInstance(c)

	type B struct{
		Brand string `json:"brand"`
		Nbr int `json:"nbr"`
	}
	var brands []B

	query := "SELECT brand, count(brand) as nbr FROM beer.review1 group by brand order by count(brand) desc;"

	db.Raw(query).Scan(&brands)

	c.JSON(200, brands)
}



func Api(c *gin.Context)  {
	db := DBInstance(c)
	var posts []Post

	ratingFrom, isRatingFrom := c.GetQuery("ratingFrom")
	ratingTo, isRatingTo := c.GetQuery("ratingTo")

	abvFrom, isAbvFrom := c.GetQuery("abvFrom")
	abvTo, isAbvTo := c.GetQuery("abvTo")

	brand, isBrand := c.GetQuery("brand")
	style, isStyle := c.GetQuery("style")

	order, isOrder := c.GetQuery("order")
	orderDirection := c.DefaultQuery("order_dir", "desc")
	limit := c.DefaultQuery("limit", "30")

	query := "SELECT * FROM beer.review1 where 1 "

	if isRatingFrom {
		query = fmt.Sprintf("%s and rating >= %s ", query, ratingFrom)
	}

	if isRatingTo {
		query = fmt.Sprintf("%s and rating <= %s ", query, ratingTo)
	}

	if isAbvFrom {
		query = fmt.Sprintf("%s and abv_dbl >= %s ", query, abvFrom)
	}

	if isAbvTo {
		query = fmt.Sprintf("%s and abv_dbl <= %s ", query, abvTo)
	}

	if isBrand {
		query = fmt.Sprintf("%s and brand = '%s' ", query, brand)
	}

	if isStyle {
		query = fmt.Sprintf("%s and styleQP = '%s' ", query, style)
	}

	if isOrder {
		query = fmt.Sprintf("%s order by %s %s ", query, order, orderDirection)
	}

	query = fmt.Sprintf("%s limit %s", query, limit)

	fmt.Println(query)

	db.Raw(query).Scan(&posts)

	c.JSON(200, posts)
}

func SetDBtoContext(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DB", db)
		c.Next()
	}
}

func DBInstance(c *gin.Context) *gorm.DB {
	return c.MustGet("DB").(*gorm.DB)
}

