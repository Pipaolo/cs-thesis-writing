package main

import (
	"fmt"
	"recommendations/scraper/proxy"
)

func search(query string, proxies []string) {
	fmt.Println("Searching for " + query)
}

func main() {
	fmt.Print("Fetching Proxies: ")
	proxies, _ := proxy.GetSavedProxies()

	// fmt.Print("Fetching results: ")
	// var opts = googlesearch.SearchOptions{CountryCode: "ph", LanguageCode: "en", Limit: 10, Start: 0, OverLimit: false, FollowNextPage: false, UserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"}
	// results, err := googlesearch.Search(nil, "coursera", opts)
	// if err != nil {
	// 	fmt.Print("Error: " + err.Error())
	// 	panic(err)
	// }

	// fmt.Print("Done\n")
	// fmt.Println("Results:")
	// for _, result := range results {
	// 	fmt.Println(result.Title)
	// 	fmt.Println(result.Description)
	// 	fmt.Println(result.URL)
	// 	fmt.Println()
	// }

}
