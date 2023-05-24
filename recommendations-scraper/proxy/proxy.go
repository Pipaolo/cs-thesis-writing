package proxy

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/schollz/progressbar/v3"
)

func fetchProxiesFromFile(fileName string) ([]string, error) {
	// Read file
	file, err := os.ReadFile(fileName)
	if err != nil {
		return nil, err
	}
	// Start reading the file
	content := string(file)
	// Split the content by new line
	lines := strings.Split(content, "\n")

	return lines, nil
}

func isProxyValid(proxy string) bool {
	proxyUrl, _ := url.Parse(proxy)
	transport := &http.Transport{
		Proxy: http.ProxyURL(proxyUrl),
	}
	client := &http.Client{
		Transport: transport,
	}
	resp, err := client.Get("https://ipinfo.io/json")

	if resp.StatusCode == 200 {
		return true
	}

	return err == nil
}

func GetValidProxies(saveProxiesToFile bool) ([]string, error) {
	proxies, _ := fetchProxiesFromFile("proxies.txt")
	proxies = proxies[0 : len(proxies)/2]
	validProxies := []string{}
	bar := progressbar.Default(int64(len(proxies)))

	for _, proxy := range proxies {
		if isProxyValid(proxy) {
			validProxies = append(validProxies, proxy)
		}
		bar.Add(1)
	}

	if saveProxiesToFile {
		fmt.Println("Saving valid proxies to file")
		file, err := os.Create("valid-proxies.txt")
		file.WriteString(strings.Join(validProxies, "\n"))

		if err != nil {
			return nil, err
		}
		defer file.Close()
	}
	return validProxies, nil
}
func GetSavedProxies() ([]string, error) {
	proxies, _ := fetchProxiesFromFile("valid-proxies.txt")

	return proxies, nil
}
