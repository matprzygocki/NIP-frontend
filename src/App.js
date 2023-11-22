import React, {useState} from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from '@mui/material/Container';
import {Box, Card, CircularProgress, Grid, Typography} from "@mui/material";
import {LineChart} from "@mui/x-charts";

const FrameWithButtons = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [chartConfig, setChartConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("http://localhost:8000/predict"); 

    const getPredictions = () => {
        console.log("Collecting data...")
        setLoading(true)
        fetch(url)
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                console.log(data);
                const config = {};
                const chartData = {
                    train: [],
                    test: []
                };
                for (let i = 0; i < data.train.x.length; i++) {
                    chartData.train.push({
                        key: "train",
                        x: data.train.x[i],
                        y: data.train.y[i]
                    });
                }
                for (let i = 0; i < data.test.x.length; i++) {
                    chartData.test.push({
                        key: "test",
                        x: data.test.x[i],
                        y: data.test.y[i]
                    });
                }
                chartData.test.sort((left, right) => left.x - right.x);
                chartData.train.sort((left, right) => left.x - right.x);
                console.log(chartData);
                config.data = chartData;
                config.series = {
                    train: [{
                        type: "line",
                        dataKey: "y",
                        label: "Train",
                        color: colorByKey["train"],
                        showMark: false
                    }],
                    test: [{
                        type: "line",
                        dataKey: "y",
                        label: "Test",
                        color: colorByKey["test"],
                        showMark: false
                    }]
                }
                config.xAxis = [{
                    scaleType: "point",
                    dataKey: 'x',
                    valueFormatter: (v) => v.toString(),
                    min: 0,
                    max: 1,
                }];
                setChartConfig(config);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = () => {
        if (selectedFile) {
            console.log('Wybrany plik:', selectedFile);
        } else {
            console.log('Nie wybrano pliku.');
        }
    };

    const handlePredefinedFile = (fileName) => {
        // Obsługa wyboru gotowych plików
        console.log(`Wybrany gotowy plik: ${fileName}`);
    };

    const customize = {
        height: 300,
        legend: {hidden: false},
        margin: {top: 5},
        stackingOrder: 'ascending',
    };

    const colorByKey = {
        train: "blue",
        test: "green"
    }

    return (
        <Container>
            <Box p={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card>
                            <Box p={2}>
                                <Typography variant="h5" gutterBottom>
                                    Indywidualny plik CSV
                                </Typography>
                                <Button variant="contained" component="label" onClick={handleUpload}>
                                    Wczytaj CSV
                                    <input type="file" hidden onChange={handleFileChange}/>
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <Box p={2}>
                                <Typography variant="h5" gutterBottom>
                                    Predefiniowane pliki CSV
                                </Typography>
                                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                    <Button onClick={() => handlePredefinedFile('Naucz sieć dla Bitcona')}>Naucz sieć
                                        dla Bitcona</Button>
                                    <Button onClick={() => handlePredefinedFile('Naucz sieć dla Ethernum')}>Naucz sieć
                                        dla Ethernum</Button>
                                    <Button onClick={() => {setUrl("http://localhost:8000/predict");}}>Naucz sieć
                                        dla Krypto 3</Button>
                                    <Button onClick={() => {setUrl("http://localhost:8000/predict2");}}>Naucz sieć
                                        dla Krypto 4
                                    </Button>

                                </ButtonGroup>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <Box p={2}>
                                <Typography variant="h5" gutterBottom>
                                    Rezultat predykcji
                                </Typography>
                                <Grid container direction={"row"}>
                                    <Button variant="outlined" onClick={() => getPredictions()} disabled={loading}>Pobierz
                                        wyniki</Button>
                                    {loading && <Box ml={2}>
                                        <CircularProgress ml={2}/>
                                    </Box>}
                                </Grid>
                                <Box mt={2}>{chartConfig && <LineChart xAxis={chartConfig.xAxis}
                                                                       series={chartConfig.series.train}
                                                                       dataset={chartConfig.data.train}
                                                                       {...customize}/>}</Box>
                                <Box mt={2}>{chartConfig && <LineChart xAxis={chartConfig.xAxis}
                                                                       series={chartConfig.series.test}
                                                                       dataset={chartConfig.data.test}
                                                                       {...customize}/>}</Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default FrameWithButtons;
