import React, { Component } from 'react';
import SpotifyAPI from "../services/SpotifyAPIService";
import ArtistQuizChoices from "./ArtistQuizChoices";
//import { shuffle, uniq } from 'underscore';
import { shuffle, uniq, uniqBy } from 'lodash';
import ArtistImage from '../controls/ArtistImage'

class ArtisQuizMain extends Component {

    constructor() {
        super();

        this.SpotifyService = new SpotifyAPI();

        this.state = {
            artistsList: [{ idx: 0, artist_id: "", artist_name: "Placeholder Artist Name", artist_href: "", artist_image: "" }],
            currentIndex: 0,
            choices: [],
            isDownloadingTracks: true,
            isCorrect: false,
            totalScore: 0
        };


        this.handleNextClick = this.handleNextClick.bind(this);

    };

    async componentDidMount() {
        let getResultArtistTotal = 0;
        let getResultArtistMax = 500;
        let artistsList = [];
        let page = 0;
        while (getResultArtistTotal <= getResultArtistMax) {
            //let newArtistsList = await this.SpotifyService.getKpopPlaylist(offset++) ?? [];
            let newArtistsList = await this.SpotifyService.search(page++) ?? [];
            artistsList = uniqBy(artistsList.concat(newArtistsList.data), 'artist_id');
            getResultArtistTotal = artistsList.length;

            //if api page limit reached then stop
            const maxPage = (newArtistsList.pageInfo.total/newArtistsList.pageInfo.limit);
            if (maxPage <= page || newArtistsList.length === 0)
                break;
        }

        const shuffledArtistList = shuffle(artistsList);
        let correctAnswerName = shuffledArtistList[0].artist_name;

        let choices = this.generateChoices(artistsList, correctAnswerName);
        this.setState({
            artistsList: shuffledArtistList,
            isDownloadingTracks: false,
            choices: choices,
            isCorrect: false
        });

    }

    generateChoices(artistsList, correctAnswerName) {
        let artistNameList = shuffle(artistsList.map(artist => { return artist.artist_name; }));
        let choices = [];
        choices.push(correctAnswerName, ...artistNameList);
        choices = uniq(choices).splice(0, 8);
        return choices;
    }


    handleNextClick(isCorrect) {
        //const isCorrect = this.state.isCorrect;
        const nextIndex = this.state.currentIndex + 1;
        let correctAnswerName = this.state.artistsList[nextIndex].artist_name;
        let choices = this.generateChoices(this.state.artistsList, correctAnswerName);
        const totalScore = isCorrect ? this.state.totalScore + 1 : this.state.totalScore;

        if (nextIndex < this.state.artistsList.length) {
            this.setState({
                currentIndex: nextIndex,
                choices: choices,
                totalScore: totalScore
            });
        }

        //show end


    }

    getCurrentArtistData() {
        return this.state.artistsList[this.state.currentIndex];
    }



    render() {
        return (
            <div className="App container-fluid">
                <div className="header-panel">
                    <h3>Kpop Artist Quiz</h3>
                    <p>Select the correct artist by name or group name</p>
                </div>
                {this.state.isDownloadingTracks ? <h1>Loading data</h1> : ""}
                <h5>Correct: {this.state.totalScore}</h5>
                <div className="row">
                    <div className="col-lg-6 col-sm-8">
                        <ArtistImage artist_id={this.getCurrentArtistData().artist_id} />
                    </div>
                    <div className="col-sm- col-lg-4">
                        <ArtistQuizChoices
                            key={this.state.artistsList.id}
                            artistData={this.getCurrentArtistData()}
                            choicesData={this.state.choices}
                            handleNextClick={this.handleNextClick} />
                    </div>
                   
                </div>
            </div>
        )
    }



}

export default ArtisQuizMain;