import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
    picture: {
        width: '100%',
        height: '100%',
    },
    brand: {
        fontStyle: "italic",
        color: "green"
    },
    product: {}
}));

export default function App() {
    const API_URL = `http://localhost:4444`;
    // const BRANDS_URL = `${API_URL}/brands`

    const [beers, setBeers] = useState([]);
    const [brands, setBrands] = useState([]);
    const [brandSelect, setBrandSelect] = useState('');

    const [brand, setBrand] = React.useState('');
    const [style, setStyle] = React.useState('');
    const [rating, setRating] = React.useState([7, 10]);
    const classes = useStyles();

    useEffect(() => {
        const loadBrands = async () => {
            const brandsResponse = await fetch('http://localhost:4444/brands');
            const newBrands = await brandsResponse.json();
            if (newBrands.length !== brands.length){
                setBrands(brands);
                let bs = (<Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={brand}
                    onChange={handleChangeBrand}
                    label="Brand"
                >
                    <MenuItem value={""}>Все</MenuItem>
                    <MenuItem value={"Мфкмфк"}>Мфкмф</MenuItem>
                    {
                        brands.map((brand, i) => (
                            <MenuItem value={`${brand.brand}`}>{`${brand.brand}(${brand.nbr})`}</MenuItem>
                        ))
                    }
                </Select>)
                setBrandSelect(bs);

            }

        }
        loadBrands();
    },[brands, brandSelect]);

    useEffect(() => {
        const loadData = async () => {
            let url = `${API_URL}?&order=rating&order_dir=desc&limit=50`;
            if (brand) {
                url = `${url}&brand=${brand}`
            }
            if (style) {
                url = `${url}&style=${style}`
            }
            if(rating){
                url = `${url}&ratingFrom=${rating[0]}&ratingTo=${rating[1]}`

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
    }, [brand, style, rating]);

    const handleChangeRating = (event, newValue) => {
        setRating(newValue)
    }

    const handleChangeBrand = (event) => {
        setBrand(event.target.value)
    }

    const handleChangeStyle = (event) => {
        setStyle(event.target.value)
    }



    return (
        <Container className={classes.container}>

            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Brand</InputLabel>
                {brandSelect}
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
            <Slider
                value={rating}
                onChange={handleChangeRating}
                aria-labelledby="range-slider"
                valueLabelDisplay="auto"
                label="Rating"

                step={0.5}
                min={0}
                max={10}
            />

            <Grid container className={classes.root} direction="column">
                {beers.map((subarray, i) => (
                    <Grid item container key={i} style={{marginBottom: 50}} alignItems="stretch" wrap="nowrap">
                        {subarray.map((value) => (
                            <Grid item className={classes.post}>
                                {/*<Typography variant="h6" gutterBottom>*/}
                                {/*    <span className={classes.brand}>*/}
                                {/*        {value.brand}</span> - {value.product}*/}
                                {/*</Typography>*/}

                                <img src={`${API_URL}/img/${value.code}.jpg`} className={classes.picture}/>
                                <Typography >{value.rating}</Typography>
                                <Link href={`https://www.instagram.com/p/${value.code}/`} target="_blank"
                                      rel="noreferrer">Link</Link>

                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}