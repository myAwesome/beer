import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Review from "./components/review";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
    container:{
        maxWidth: 935,
        width: '100%',
        '@media (min-width: 736px)': {
            width: 'calc(100% - 40px)',
            padding: '60px 20px 0',
            boxSizing: 'content-box',
        }
    },
    root: {
        flexGrow: 1,
    },
    post: {
        width: '100%',
        // width:'293px',
        // height:'293px',
        '&:not(:last-child)': {
            marginRight: 28,
        }
    },
    product: {}
}));

export default function App() {
    const API_URL = `http://localhost:4444`;
    // const BRANDS_URL = `${API_URL}/brands`

    const [beers, setBeers]   = useState([]);
    const [brands, setBrands] = useState([]);

    const [searchText, setSearchText]   = React.useState('');
    const [brand, setBrand]   = React.useState('');
    const [style, setStyle]   = React.useState('');
    const [rating, setRating] = React.useState([9, 10]);
    const [abv, setAbv]       = React.useState([3, 13]);
    const classes = useStyles();

    useEffect(() => {
        const loadBrands = async () => {
            const brandsResponse = await fetch('http://localhost:4444/brands');
            const newBrands = await brandsResponse.json();
            setBrands(newBrands);
        }
        loadBrands();
    },[]);

    useEffect(() => {
        const loadData = async () => {
            let url = `${API_URL}?&order=rating&order_dir=desc&limit=50`;
            if (brand) {
                url = `${url}&brand=${brand}`
            }
            if (style) {
                url = `${url}&style=${style}`
            }
            if (rating){
                url = `${url}&ratingFrom=${rating[0]}&ratingTo=${rating[1]}`
            }
            if (abv){
                url = `${url}&abvFrom=${abv[0]}&abvTo=${abv[1]}`
            }
            if (searchText) {
                url = `${url}&searchText=${searchText}`
            }
            const response = await fetch(url);
            const beers = await response.json();
            if (beers && beers.length) {
                const newBeers = beers.map((elem, i) => {
                    return i % 3 ? [] : [beers.slice(i, i + 3)];
                }).reduce((prev, acc) => prev.concat(acc), [])
                setBeers(newBeers);
            }
        }
        loadData();
    }, [brand, style, rating, abv, searchText]);

    const handleChangeRating = (event, newValue) => {
        setRating(newValue)
    }

    const handleChangeAbv = (event, newValue) => {
        setAbv(newValue)
    }

    const handleChangeBrand = (event) => {
        setBrand(event.target.value)
    }

    const handleChangeSearch = (event) => {
        setSearchText(event.target.value)
    }

    const handleChangeStyle = (event) => {
        setStyle(event.target.value)
    }

    return (
        <Container className={classes.container}>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Brand</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={brand}
                    onChange={handleChangeBrand}
                    label="Brand"
                >
                    <MenuItem value={""}><em>Все</em></MenuItem>
                    {brands.map((brand) => (
                        <MenuItem key={brand.brand} value={brand.brand}>{brand.brand} ({brand.nbr})</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Style</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={style}
                    onChange={handleChangeStyle}
                    label="Style"
                >
                    <MenuItem value={""}><em>Все</em></MenuItem>
                    <MenuItem value={1}>Bocks</MenuItem>
                    <MenuItem value={2}>Brown Ales</MenuItem>
                    <MenuItem value={3}>Dark Ales</MenuItem>
                    <MenuItem value={4}>Dark Lagers</MenuItem>
                    <MenuItem value={5}>Hybrid Beers</MenuItem>
                    <MenuItem value={6}>IPA</MenuItem>
                    <MenuItem value={7}>Pale Ales</MenuItem>
                    <MenuItem value={8}>Pale Lager</MenuItem>
                    <MenuItem value={9}>Porters</MenuItem>
                    <MenuItem value={10}>Specialty Beers</MenuItem>
                    <MenuItem value={11}>Stouts</MenuItem>
                    <MenuItem value={12}>Strong Ales</MenuItem>
                    <MenuItem value={13}>Wheat Beers</MenuItem>
                    <MenuItem value={14}>Wild/Sour Beers</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                    id="outlined-secondary"
                    label="Search"
                    variant="outlined"
                    color="secondary"
                    value={searchText}
                    onChange={handleChangeSearch}
                />
            </FormControl>

<br/>
<br/>
            <Typography id="rank-slider" gutterBottom>
                Rating
            </Typography>
            <Slider
                value={rating}
                onChange={handleChangeRating}
                // onChangeCommitted={handleChangeRating}
                aria-labelledby="rank-slider"
                valueLabelDisplay="auto"
                aria-label="Abv"
                color = "secondary"
                marks ={true}
                step={0.5}
                min={0}
                max={10}
            />

            <Typography id="abv-slider" gutterBottom>
                Abv
            </Typography>
            <Slider
                value={abv}
                // onChangeCommitted={handleChangeAbv}
                onChange={handleChangeAbv}
                aria-labelledby="abv-slider"
                valueLabelDisplay="auto"
                label="Rating"
                marks ={true}

                step={0.5}
                min={3}
                max={13}
            />
            <Grid container className={classes.root} direction="column">
                {beers.map((subarray, i) => (
                    <Grid item container key={i} style={{marginBottom: 50}} alignItems="stretch" wrap="nowrap">
                        {subarray.map((value) => (
                            <Grid item className={classes.post}>
                                <Review data={value}/>
                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}