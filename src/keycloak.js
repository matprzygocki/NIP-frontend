import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    realm: 'nip',
    url: 'http://localhost:8079/auth',
    clientId: 'microservice-proxy',
});

export default keycloak;
