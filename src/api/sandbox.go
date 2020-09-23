package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbport := os.Getenv("DB_PORT")
	serverport := os.Getenv("SERVER_PORT")

	fmt.Println(dbport, serverport)
}