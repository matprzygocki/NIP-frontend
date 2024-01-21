import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import reportWebVitals from "./reportWebVitals";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

//
//
//
//
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import keycloak from './keycloak';
//
// const root = ReactDOM.createRoot(document.getElementById('root'));
//
// const renderApp = (authenticated) => {
//     root.render(
//         <React.StrictMode>
//             <App authenticated={authenticated} />
//         </React.StrictMode>
//     );
// };
//
// keycloak.init({ onLoad: 'login-required' })
//     .then((authenticated) => {
//         if (authenticated) {
//             renderApp(authenticated);
//         } else {
//             console.error('Użytkownik nie jest uwierzytelniony.');
//         }
//     })
//     .catch((error) => {
//         console.error('Błąd autoryzacji:', error);
//     });
//
// reportWebVitals();
//



