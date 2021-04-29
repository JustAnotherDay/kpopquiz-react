import React, { Component } from 'react';
import SpotifyAPI from "../services/SpotifyAPIService";
import ArtistQuizItem from "./ArtistQuizItem";
import { shuffle, arrayUnique } from "../helpers/arrayHelper";

class ArtisQuizMain extends Component {

    constructor() {
        super();
        
        this.SpotifyService = new SpotifyAPI();
        this.state = {
            artistsList: [{ idx: 0, artist_id: "", artist_name: "Placeholder Artist Name", href: "", artist_image: "" }],
            currentIndex: 0,
            shuffledIndexes: [0],
            choices: [],
            isDownloadingTracks: true,
            totalScore: 0
        };

        this.handleNextClick = this.handleNextClick.bind(this);

    };

    getArtist(index) {
        return this.state.artistsList[this.state.shuffledIndexes[index]];
    }

    async componentDidMount() {
        this.SpotifyService.Search(0);
        let total = 0;
        let artistsList = [];
        let offset = 0;
        setTimeout(() => {

        }, 5000);
        while (total < 20) {
            let newArtistsList = await this.SpotifyService.GetKpopPlaylist(offset++);

            artistsList = arrayUnique(artistsList.concat(newArtistsList));
            total = artistsList.length;
            if (newArtistsList.length < 50)
                break;
        }
        const shuffledIndexes = shuffle([...Array(artistsList.length).keys()]);

        this.setState({
            shuffledIndexes: shuffledIndexes,
            artistsList: artistsList,
            choices: this.generateChoices(artistsList),
            isDownloadingTracks: false
        });

    }

    generateChoices(artistsList) {
        const choicesIndex = shuffle([...Array(artistsList.length).keys()]);

        let choices = [];

        choicesIndex.forEach(index => {
            const artistName = artistsList[index].artist_name;
            choices.push(artistName);
        });


        return choices;
    }


    handleNextClick(isCorrect) {

        const nextIndex = this.state.currentIndex + 1;

        if(nextIndex < this.state.artistsList.length){
            this.setState(prevState => {

                return {
                    currentIndex: this.state.shuffledIndexes[nextIndex],
                    choices: this.generateChoices(this.state.artistsList),
                    totalScore: isCorrect ? prevState.totalScore + 1 :  prevState.totalScore
                }
            });
        }
        

    }

    render() {
        return (
            <div className="App container">
                <h1>Artist Quiz</h1>
                {this.state.isDownloadingTracks ? <h1>Loading data</h1> : ""}
                <h5>Correct: {this.state.totalScore}</h5>
                <ArtistQuizItem
                    key={this.state.artistsList.id}
                    artistData={this.state.artistsList[this.state.shuffledIndexes[this.state.currentIndex]]}
                    choices={this.state.choices}
                    handleNextClick={this.handleNextClick} />

            </div>
        )
    }



}

export default ArtisQuizMain;