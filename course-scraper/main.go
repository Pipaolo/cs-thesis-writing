package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"os"
	"recommendations/scraper/proxy"
	"strings"
	"time"

	googlesearch "github.com/rocketlaunchr/google-search"
	"github.com/schollz/progressbar/v3"
	"golang.org/x/time/rate"
)

func search(query string, proxies []string) []googlesearch.Result {
	fmt.Println("Searching for " + query)

	userAgent := "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"

	opts := googlesearch.SearchOptions{
		CountryCode:    "ph",
		LanguageCode:   "en",
		Limit:          50,
		Start:          0,
		OverLimit:      false,
		FollowNextPage: true,
		UserAgent:      userAgent,
	}

	results, err := googlesearch.Search(context.Background(), query, opts)
	if err != nil {
		return []googlesearch.Result{}
	}

	return results
}

func searchAll(proxies []string) []googlesearch.Result {
	results := []googlesearch.Result{}

	// Get the topics from the txt file
	b, _ := os.ReadFile("topics.txt")
	topics := strings.Split(string(b), ",")

	for i, topic := range topics {
		// Add the word "course" to the end of the topic
		//
		// This is to get more relevant results
		topics[i] = strings.TrimSpace(topic) + " course"
	}

	bar := progressbar.Default(int64(len(topics)))

	for _, topic := range topics {
		results = append(results, search(topic, proxies)...)
		bar.Add(1)
	}

	return results
}

func main() {
	// Set a rate limit of 1 request per second
	//
	// This is to circumvent Google's rate limit
	googlesearch.RateLimit = rate.NewLimiter(rate.Every(time.Second), 1)

	proxies, _ := proxy.GetSavedProxies()
	results := searchAll(proxies)

	fmt.Println("Results: ")
	// Save the results to a csv file
	f, _ := os.Create("results.csv")
	csvwriter := csv.NewWriter(f)
	headers := []string{"Title", "Description", "URL"}
	csvwriter.Write(headers)

	for _, result := range results {
		csvwriter.Write([]string{result.Title, result.Description, result.URL})
	}

	csvwriter.Flush()
	defer f.Close()

}
