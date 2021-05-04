import React, { Component } from 'react';
import SpotifyAPI from "../services/SpotifyAPIService";
import Checkbox from '../controls/Checkbox'
import { shuffle } from 'underscore';

import Button from '../controls/Button'

class ArtistQuizChoices extends Component {
    constructor(props) {
        super(props);

        this.state = {
            choicesData: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }],
            isAnswerCorrect: false
        };

        this.SpotifyService = new SpotifyAPI();
        this.handleChoiceClick = this.handleChoiceClick.bind(this);

    };

    async componentDidUpdate(prevProps) {
        const { artist_id } = this.props.artistData;

        if (prevProps.artistData.artist_id !== artist_id) {
            if (artist_id) {
                let choicesData = [];
                if (this.props.choicesData) {
                    choicesData = shuffle(this.props.choicesData).map(choice => {
                        return { bgColor: "white", value: choice, choiceDisabled: false }
                    });
                }

                this.setState({
                    choicesData: choicesData
                });
            }
        }
    }

    handleChoiceClick(e) {
        const correctAnswer = this.props.artistData.artist_name;
        const selectedChoiceValue = e.currentTarget.getAttribute("value");
        const isCorrect = selectedChoiceValue === correctAnswer;

        this.setState(prevState => {
            const choicesData = prevState.choicesData.map(choice => {
                if (choice.value === selectedChoiceValue) {
                    if (isCorrect)
                        return { bgColor: "#4bff4b", value: choice.value, choiceDisabled: true }

                    return { bgColor: "#f35454", value: choice.value, choiceDisabled: true }
                } else {
                    return { bgColor: "#efecec", value: choice.value, choiceDisabled: true }
                }
            });

            return {
                choicesData: choicesData,
                isAnswerCorrect: isCorrect
            };
        })

    }

    render() {
        return (
            <div>
                <div className="list-group">{
                    this.state.choicesData.map((choiceData, index) => {
                        return (<Checkbox
                            key={index}
                            choice={choiceData}
                            checked={false}
                            handleChoiceClick={this.handleChoiceClick}
                        />)
                    })
                }</div>


                <br />
                <Button
                    onClick={() => this.props.handleNextClick(this.state.isAnswerCorrect)}
                    data={{ text: "Next" }} />
            </div>
        );
    }
}

export default ArtistQuizChoices;