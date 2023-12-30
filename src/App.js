import React, { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import { Box, Typography, Button, ButtonGroup } from "@mui/material";
import keycloak from './keycloak';
import FrameWithButtons from './FrameWithButtons';
import './styles.css';


const App = () => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        keycloak
            .init({ onLoad: 'check-sso' })
            .then((auth) => {
                setAuthenticated(auth);
            })
            .catch((error) => {
                console.error('Błąd autoryzacji:', error);
            });
    }, []);

    return (
        <Container style={{ paddingTop: '20px' }}>
            <Box margin="0 auto" width="fit-content">
                {authenticated ? (
                    <FrameWithButtons />
                ) : (
                    <Box border="1px solid #ccc" borderRadius={4} textAlign="center" padding={2}>
                        <Typography variant="h5" gutterBottom>
                            Logowanie
                        </Typography>
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            <Button onClick={() => keycloak.login()}>Zaloguj</Button>
                        </ButtonGroup>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default App;
