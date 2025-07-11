package profile

type ProfileResponse struct {
	User struct {
		Email        string `json:"email"`
		ProfileImage string `json:"profile_image"`
	} `json:"user"`
	Contributions []Contribution `json:"contributions,omitempty"`
	FavoriteSpots []FavoriteSpot `json:"favorite_spots,omitempty"`
}

type Contribution struct {
	Review       string   `json:"review"`
	Rating       float64  `json:"rating"`
	ImageURLs    []string `json:"image_urls"`
	SpotID       int      `json:"spot_id"`
	SpotName     string   `json:"spot_name"`
	LocationType string   `json:"location_type"`
}

type FavoriteSpot struct {
	Description  string   `json:"description"`
	Rating       float64  `json:"rating"`
	ImageURLs    []string `json:"image_urls"`
	LocationType string   `json:"location_type"`
}

