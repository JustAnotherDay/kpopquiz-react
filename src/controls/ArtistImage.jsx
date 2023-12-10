import React, { Component } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import SpotifyAPI from "../services/SpotifyAPIService";

class ArtistImage extends Component {
    constructor(props){
        super();
        this.state = {
            artist_image_url_default: "http://collages.shapecollage.com/shape-collage-iecmk1sb.jpg" ,
            artist_image_url: "http://collages.shapecollage.com/shape-collage-iecmk1sb.jpg" ,
            artist_id: "",
            isZoomed: false,
        };

        this.SpotifyService = new SpotifyAPI();
        this.handleZoomChange = this.handleZoomChange.bind(this);
    }

    async componentDidUpdate(prevProps) {
        console.log(this.props);
        const artist_id = this.props.artist_id;
        const prev_artist_id = prevProps.artist_id;
        if (prev_artist_id !== artist_id) {
            if (artist_id) {
                const artist_image_url = await this.SpotifyService.getArtistImage(artist_id) ?? this.state.artist_image_url_default;

                
                this.setState({
                    artist_image_url: artist_image_url.url
                });
            }
        }
    }

    handleZoomChange (shouldZoom) {
        this.setState({
            isZoomed: true
        });
    };

    render() {
        return (
            <Zoom>
            <img src={this.state.artist_image_url} className="img-auto" alt="Artist" ></img>
            </Zoom>
        );
    }
}

export default ArtistImage;