package main

import (
	"encoding/json"
	"fmt"
	"image/jpeg"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type Review struct {
	AccessibilityCaption string      `json:"accessibilityCaption"`
	Attribution          interface{} `json:"attribution"`
	Caption              string      `json:"caption"`
	Code                 string      `json:"code"`
	CommentsDisabled     bool        `json:"commentsDisabled"`
	Dimensions           struct {
		Height int `json:"height"`
		Width  int `json:"width"`
	} `json:"dimensions"`
	DisplayResources []struct {
		Src          string `json:"src"`
		ConfigWidth  int    `json:"configWidth"`
		ConfigHeight int    `json:"configHeight"`
	} `json:"displayResources"`
	FollowHashtagInfo      interface{} `json:"followHashtagInfo"`
	FactCheckOverallRating interface{} `json:"factCheckOverallRating"`
	FactCheckInfo          interface{} `json:"factCheckInfo"`
	HasAudio               bool        `json:"hasAudio"`
	HasRankedComments      bool        `json:"hasRankedComments"`
	ID                     string      `json:"id"`
	IsSidecar              bool        `json:"isSidecar"`
	IsVideo                bool        `json:"isVideo"`
	LikedByViewer          bool        `json:"likedByViewer"`
	Likers                 []struct {
		Counts struct {
		} `json:"counts"`
		ID                string `json:"id"`
		IsNew             bool   `json:"isNew"`
		ProfilePictureURL string `json:"profilePictureUrl"`
		Username          string `json:"username"`
	} `json:"likers"`
	Location         interface{} `json:"location"`
	MediaOverlayInfo interface{} `json:"mediaOverlayInfo"`
	MediaPreview     string      `json:"mediaPreview"`
	NumComments      int         `json:"numComments"`
	NumPreviewLikes  int         `json:"numPreviewLikes"`
	OverlayImageSrc  interface{} `json:"overlayImageSrc"`
	Owner            struct {
		Counts struct {
		} `json:"counts"`
		FullName          string `json:"fullName"`
		ID                string `json:"id"`
		IsNew             bool   `json:"isNew"`
		IsPrivate         bool   `json:"isPrivate"`
		ProfilePictureURL string `json:"profilePictureUrl"`
		Username          string `json:"username"`
	} `json:"owner"`
	RelatedMedia              []interface{} `json:"relatedMedia"`
	PostedAt                  int           `json:"postedAt"`
	PreviewCommentIds         []string      `json:"previewCommentIds"`
	SavedByViewer             bool          `json:"savedByViewer"`
	SavedByViewerToCollection bool          `json:"savedByViewerToCollection"`
	Sponsors                  []interface{} `json:"sponsors"`
	Src                       string        `json:"src"`
	TrackingToken             string        `json:"trackingToken"`
	Usertags                  []struct {
		User struct {
			Username          string `json:"username"`
			ID                string `json:"id"`
			IsVerified        bool   `json:"isVerified"`
			ProfilePictureURL string `json:"profilePictureUrl"`
			FullName          string `json:"fullName"`
		} `json:"user"`
		X float64 `json:"x"`
		Y float64 `json:"y"`
	} `json:"usertags"`
	ViewerInPhotoOfYou      bool        `json:"viewerInPhotoOfYou"`
	ViewerCanReshare        bool        `json:"viewerCanReshare"`
	SensitivityFrictionInfo interface{} `json:"sensitivityFrictionInfo"`
	ThumbnailResources      []struct {
		Src          string `json:"src"`
		ConfigWidth  int    `json:"configWidth"`
		ConfigHeight int    `json:"configHeight"`
	} `json:"thumbnailResources"`
	ThumbnailSrc string `json:"thumbnailSrc"`
	NumLikes     int    `json:"numLikes"`
}

func loop() {
	fmt.Println("main...")
	dat, _ := ioutil.ReadFile("ph.json")
	var reviews []Review
	_ = json.Unmarshal(dat, &reviews)

	for _, r := range reviews {
		fmt.Println(" ")
		fmt.Println(" ")
		fmt.Println(r.ThumbnailResources[3].Src)

		break
	}

}

func thumbnailSaver() {
	dat, _ := ioutil.ReadFile("ph.json")
	var reviews []Review

	_ = json.Unmarshal(dat, &reviews)

	for i, r := range reviews {
		fmt.Println(i, r.Code)

		resp, err := http.Get(r.ThumbnailResources[3].Src)
		if err != nil {
			log.Panic(err)
		}
		defer resp.Body.Close()

		// Keep an in memory copy.
		myImage, err := jpeg.Decode(resp.Body)

		if err != nil {
			log.Panic(err)
		}

		f, err := os.Create("th/" + r.Code + ".jpg")
		if err != nil {
			panic(err)
		}
		defer f.Close()
		_ = jpeg.Encode(f, myImage, nil)
	}
}

func imgSaver() {
	fmt.Println("Starting...")

	dat, _ := ioutil.ReadFile("ph.json")
	var reviews []Review

	_ = json.Unmarshal(dat, &reviews)

	for i, r := range reviews {
		fmt.Println(i, r.Code)

		resp, err := http.Get(r.Src)
		if err != nil {
			log.Panic(err)
		}
		defer resp.Body.Close()

		// Keep an in memory copy.
		myImage, err := jpeg.Decode(resp.Body)

		if err != nil {
			log.Panic(err)
		}

		f, err := os.Create("img/" + r.Code + ".jpg")
		if err != nil {
			panic(err)
		}
		defer f.Close()
		_ = jpeg.Encode(f, myImage, nil)
	}

	fmt.Println("End...")

}
