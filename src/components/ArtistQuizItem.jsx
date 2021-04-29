import React, { Component } from 'react';
import SpotifyAPI from "../services/SpotifyAPIService";
import ChoiceItem from "./ChoiceItem";
import { shuffle } from "../helpers/arrayHelper";

class ArtistQuizItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            artist_image: { "url": "http://collages.shapecollage.com/shape-collage-iecmk1sb.jpg" },
            choiceData: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }],
            isCorrect: false
        };
        this.SpotifyService = new SpotifyAPI();
        this.handleClick = this.handleClick.bind(this);
    };

    componentDidUpdate(prevProps) {
        const { artist_id } = this.props.artistData
        if (prevProps.artistData.artist_id !== artist_id) {
            if (artist_id) {
                this.SpotifyService.GetArtistImage(this.props.artistData.artist_id)
                    .then(image => {
                        let choiceData = [];
                        if (this.props.choices !== undefined) {

                            let choices = [];
                            const correctAnswer = this.props.artistData.artist_name;
                            choices.push(correctAnswer);
                            choices = choices.concat(this.props.choices);
                            choices = [...new Set(choices)].splice(0, 8);
                            choices = shuffle(choices);
                            choiceData = choices.map(choice => {
                                return { bgColor: "white", value: choice, choiceDisabled: false }
                            });
                        }

                        this.setState({
                            artist_image: image,
                            choiceData: choiceData,
                            isCorrect: false
                        });

                    });
            }
        }
    }

    handleClick(e) {
        const correctAnswer = this.props.artistData.artist_name;
        const selectedChoiceValue = e.currentTarget.getAttribute("value");
        const isCorrect = selectedChoiceValue === correctAnswer;

        this.setState(prevState => {
            const list = prevState.choiceData.map(choice => {
                if (choice.value === selectedChoiceValue) {
                    if (isCorrect)
                        return { bgColor: "#4bff4b", value: choice.value, choiceDisabled: true }

                    return { bgColor: "#f35454", value: choice.value, choiceDisabled: true }
                } else {
                    return { bgColor: "#efecec", value: choice.value, choiceDisabled: true }
                }
            })
            return {
                choiceData: list,
                isCorrect: isCorrect
            };
        })

    }

    render() {
        return (
            <div className="row">
                <div className="col-6">
                    <img src={this.state.artist_image.url} height="500" width="500" alt="Artist" ></img>
                </div>
                <div className="col">
                    <div className="list-group">{
                        this.state.choiceData.map((choiceData, index) => {
                            return (<ChoiceItem
                                key={index}
                                choice={choiceData}
                                checked={false}
                                onChildClick={this.handleClick}
                            />)
                        })
                    }</div>
                    <br/>
                    <button onClick={() => this.props.handleNextClick(this.state.isCorrect)} className="btn col form-control float-right btn-primary btn-lg"> Next</button>
                </div>

            </div>
        );
    }
}

export default ArtistQuizItem;