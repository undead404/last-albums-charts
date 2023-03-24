package database

import (
	"database/sql"
	"lac/scraper5/utils"

	_ "github.com/lib/pq"
)

var connString = "postgres://pqgotest:password@localhost/pqgotest?sslmode=verify-full"

var Database *sql.DB

func init() {
	var err error
	Database, err = sql.Open("postgres", connString)
	utils.HandleError(err)
}
