import React, { useState } from 'react';

const FrameWithButtons = () => {
    const [selectedFile, setSelectedFile] = useState(null);

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

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#4F4F4F' // Kolor tła
        }}>
            <div style={{
                width: '600px',
                border: '1px solid #ccc',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#7F7F7F', // Kolor tła ramki
            }}>
                <h2>Wybierz plik:</h2>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload} style={{ marginTop: '10px' }}>Prześlij plik</button>

                <div style={{ marginTop: '20px' }}>
                    {/* Przyciski do wyboru gotowych plików */}
                    <button onClick={() => handlePredefinedFile('Naucz sieć dla Bitcona')}>Naucz sieć dla Bitcona</button>
                    <button onClick={() => handlePredefinedFile('Naucz sieć dla Ethernum')}>Naucz sieć dla Ethernum</button>
                    <button onClick={() => handlePredefinedFile('Naucz sieć dla Krypto 3')}>Inny krypto 1</button>
                    <button onClick={() => handlePredefinedFile('Naucz sieć dla Krypto 4')}>Inny krypto 2</button>
                </div>
            </div>
        </div>
    );
};

export default FrameWithButtons;
