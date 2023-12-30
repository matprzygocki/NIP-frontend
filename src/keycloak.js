import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    realm: 'frontend',
    url: 'http://localhost:8079/auth',
    clientId: 'frontend_client',
});

export default keycloak;
