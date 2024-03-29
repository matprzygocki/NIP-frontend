import React, {useState} from "react";
import Container from "@mui/material/Container";
import {Box, Card, CircularProgress, Grid, Slider, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import {LineChart} from "@mui/x-charts";
import keycloak from "./keycloak";

const FrameWithButtons = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [chartConfig, setChartConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("http://localhost:8080/proxy/predict-ai");
    const [splitPercentage, setSplitPercentage] = useState(0.67);
    const [predictionsData, setPredictionsData] = useState(null)

    const getPredictions = () => {
        setLoading(true);
        let formData = null;

        if (selectedFile !== undefined && selectedFile !== null) {
            formData = new FormData();
            formData.append('file', selectedFile);
        }

        fetch(
            `${url}?splitPercentage=${splitPercentage}`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': 'Bearer ' + keycloak.token
                },
            }
        )
            .then(response => {
                return response.json();
            })
            .then(data => {
                    setPredictionsData(data)
                    const config = {};
                    const chartData = new Map();
                    for (let i = 0; i < data.train.x.length; i++) {
                        const num = data.train.x[i];
                        chartData.set(num, {
                            x: num,
                            train: data.train.y[i],
                            test: null
                        });
                    }
                    for (let i = 0; i < data.test.x.length; i++) {
                        const num = data.test.x[i];
                        if (chartData.has(num)) {
                            const existingData = chartData.get(num);
                            existingData.test = data.test.y[i];
                            chartData.set(num, existingData);
                        } else {
                            chartData.set(num, {
                                x: num,
                                train: null,
                                test: data.test.y[i]
                            });
                        }
                    }
                    config.data = Array.from(chartData, ([key, value]) => value);
                    config.series = ["train", "test"].map(key => {
                        return {
                            type: "line",
                            dataKey: key,
                            label: key,
                            color: colorByKey[key],
                            showMark: false
                        }
                    });
                    config.xAxis = [{
                        scaleType: "point",
                        dataKey: 'x',
                        min: 0,
                        max: 1,
                    }];
                    setChartConfig(config);
                    setLoading(false);
                }
            )
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file !== undefined && file !== null) {
            setUrl("http://localhost:8080/proxy/predict-ai")
        }
    };

    const handlePredefinedFile = urlWithPredefinedFile => {
        setUrl(urlWithPredefinedFile);
        setSelectedFile(null);
    };

    const handleSliderChange = (event, newValue) => {
        setSplitPercentage(newValue);
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
                            <Box p={2} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Button variant="contained" onClick={() => keycloak.logout()}>
                                    Wyloguj
                                </Button>
                            </Box>
                        </Card>
                    </Grid>

                    {keycloak.hasRealmRole('technician') &&  //UKRYWAM KAWAŁEK JEŻELI ROLA JEST INNA OD ADMIN
                        <Grid item xs={12}>
                            <Card>
                                <Box p={2}>
                                    <Typography variant="h5" gutterBottom>
                                        Indywidualny plik CSV (admin)
                                    </Typography>
                                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <Button variant="contained" component="label">
                                            Wczytaj CSV
                                            <input type="file" hidden onChange={handleFileChange}/>
                                        </Button>
                                        {selectedFile &&
                                            <Typography ml={2}>Nazwa wybranego pliku: {selectedFile.name}</Typography>}
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>}

                    {(keycloak.hasRealmRole('user') || keycloak.hasRealmRole('technician')) && ( //UKRYWAM KAWAŁEK JEŻELI ROLA JEST INNA OD ADMIN
                        <Grid item xs={12}>
                            <Card>
                                <Box p={2}>
                                    <Typography variant="h5" gutterBottom>
                                        Predefiniowane pliki CSV
                                    </Typography>
                                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                        <Button
                                            onClick={() => handlePredefinedFile("http://localhost:8080/proxy/predict-ai/BitcoinUSD.csv")}>Naucz
                                            sieć
                                            dla Bitcoin</Button>
                                        <Button
                                            onClick={() => handlePredefinedFile("http://localhost:8080/proxy/predict-ai/EtherUSD.csv")}>Naucz
                                            sieć
                                            dla Etherneum</Button>
                                        <Button
                                            onClick={() => handlePredefinedFile("http://localhost:8080/proxy/predict-ai/AcalaUSD.csv")}>Naucz
                                            sieć
                                            dla Acala Coin</Button>
                                        <Button
                                            onClick={() => handlePredefinedFile("http://localhost:8080/proxy/predict-ai/HarvestUSD.csv")}>Naucz
                                            sieć dla Harvest Coin</Button>
                                    </ButtonGroup>
                                </Box>
                            </Card>
                        </Grid>
                    )}

                    {(keycloak.hasRealmRole('user') || keycloak.hasRealmRole('technician')) && ( //UKRYWAM KAWAŁEK JEŻELI ROLA JEST INNA OD ADMIN
                        <Grid item xs={12}>
                            <Card>
                                <Box p={2}>
                                    <Typography variant="h5" gutterBottom>
                                        {"Aktualny wybór: " + url}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    )}

                    {(keycloak.hasRealmRole('user') || keycloak.hasRealmRole('technician')) && ( //UKRYWAM KAWAŁEK JEŻELI ROLA JEST INNA OD ADMIN
                        <Grid item xs={12}>
                            <Card>
                                <Box p={2}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={8}>
                                            <Typography variant="h5" gutterBottom>
                                                Podział procentowy zbioru danych
                                            </Typography>
                                            <Slider
                                                value={splitPercentage}
                                                onChange={handleSliderChange}
                                                step={0.01}
                                                marks
                                                min={0.1}
                                                max={0.9}
                                                valueLabelDisplay="auto"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="h5">
                                                {`Wybrany podział:  ${(splitPercentage * 100).toFixed()}%`}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    )}

                    {(keycloak.hasRealmRole('user') || keycloak.hasRealmRole('technician')) && ( //UKRYWAM KAWAŁEK JEŻELI ROLA JEST INNA OD ADMIN
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
                                                                           series={chartConfig.series}
                                                                           dataset={chartConfig.data}
                                                                           {...customize}/>}</Box>
                                </Box>
                            </Card>
                        </Grid>
                    )}

                    {((keycloak.hasRealmRole('user') || keycloak.hasRealmRole('technician')) && predictionsData) && (
                        <Grid item xs={12}>
                            <Card>
                                <Box p={2}>
                                    <Typography variant="h5" gutterBottom>
                                        Ewaluacja modelu
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        RMSE
                                    </Typography>
                                    <Typography variant="body1" gutterBottom ml={4}>
                                        {'Trening: ' + predictionsData.meanSquaredError.train} <br/>
                                        {'Test: ' + predictionsData.meanSquaredError.test} <br/>
                                    </Typography>
                                    <Typography variant="h6">
                                        R2
                                    </Typography>
                                    <Typography variant="body1" gutterBottom ml={4}>
                                        {'Trening: ' + predictionsData.r2.train} <br/>
                                        {'Test: ' + predictionsData.r2.test} <br/>
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>)}
                </Grid>
            </Box>
        </Container>
    );
};
export default FrameWithButtons;
