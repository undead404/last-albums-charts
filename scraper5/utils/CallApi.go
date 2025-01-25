package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

type Parameters struct {
	ApiKey      string `json:"api_key"`
	Album       string `json:"album,omitempty"`
	Artist      string `json:"artist,omitempty"`
	Autocorrect string `json:"autocorrect"`
	Format      string `json:"format"`
	Method      string `json:"method"`
	Page        int    `json:"page,omitempty"`
	Tag         string `json:"tag,omitempty"`
}

var LASTFM_API_KEY = os.Getenv("LASTFM_API_KEY")

func init() {
	if len(LASTFM_API_KEY) == 0 {
		panic("LASTFM_API_KEY is required")
	}
}

func newParams() url.Values {
	return url.Values{
		"api_key":     []string{LASTFM_API_KEY},
		"autocorrect": []string{"1"},
		"format":      []string{"json"},
	}
}

const BASE_URL = "http://ws.audioscrobbler.com/2.0/"

func CallApi(parameters Parameters, result interface{}) error {
	// Stringify URL from BASE_URL and parameters

	url := BASE_URL + "?" + url.Values.Encode(parameters)
	jsonParams, err := json.Marshal(params)
	if err != nil {
		return err
	}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonParams))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("HTTP error: %d", resp.StatusCode)
	}
	var apiResponse struct {
		Error  *APIError       `json:"error,omitempty"`
		Result json.RawMessage `json:"result,omitempty"`
	}
	err = json.NewDecoder(resp.Body).Decode(&apiResponse)
	if err != nil {
		return err
	}
	if apiResponse.Error != nil {
		return fmt.Errorf("API error %d: %s", apiResponse.Error.Code, apiResponse.Error.Message)
	}
	err = json.Unmarshal(apiResponse.Result, response)
	if err != nil {
		return err
	}
	return nil
}
