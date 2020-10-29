import React from 'react';
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    picture: {
        width: '320px',
        height: '320px',
    },
    brand: {
        fontStyle: "italic",
        color: "green"
    }
}));

const Review = (props) => {
    const API_URL = `http://localhost:4444`;
    const classes = useStyles();
    const {data} = props

    return (
        <Link href={`https://www.instagram.com/p/${data.code}/`} target="_blank"
              rel="noreferrer">
            <img src={`${API_URL}/th/${data.code}.jpg`} className={classes.picture}/>
            <Typography variant="h6" gutterBottom>
                                    <span className={classes.brand}>
                                        {data.brand}</span> - {data.product}
            </Typography>
            <Typography >({data.rating} / 10) - abv:{data.abv_dbl}%</Typography>
        </Link>
    );
}

export default Review