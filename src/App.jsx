import React, { useState } from 'react';
import './App.css';

function App() {
    const [inputData, setInputData] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({
        alphabets: false,
        numbers: false,
        highestLowercase: false,
    });

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const handleOptionChange = (e) => {
        const { name, checked } = e.target;
        setSelectedOptions((prev) => ({ ...prev, [name]: checked }));
    };

    const validateJSON = (data) => {
        try {
            JSON.parse(data);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateJSON(inputData)) {
            setError('Invalid JSON format');
            return;
        }

        try {
            const response = await fetch('https://newbackend-shhr.onrender.com/bfhl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: inputData,
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            setResponseData(data);
        } catch (error) {
            setError('Failed to fetch data from API');
        }
    };

    const renderResponse = () => {
        if (!responseData) return null;

        return (
            <div>
                {selectedOptions.alphabets && (
                    <div>
                        <h3>Alphabets:</h3>
                        <pre>{JSON.stringify(responseData.alphabets, null, 2)}</pre>
                    </div>
                )}
                {selectedOptions.numbers && (
                    <div>
                        <h3>Numbers:</h3>
                        <pre>{JSON.stringify(responseData.numbers, null, 2)}</pre>
                    </div>
                )}
                {selectedOptions.highestLowercase && (
                    <div>
                        <h3>Highest Lowercase Alphabet:</h3>
                        <pre>{JSON.stringify(responseData.highest_lowercase_alphabet, null, 2)}</pre>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="App">
            <h1>RA2111003010999</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={inputData}
                    onChange={handleInputChange}
                    placeholder='Enter JSON here...'
                    rows="5"
                    cols="50"
                />
                <br /><br /><br />
                <button type="submit">Submit</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {responseData && (
                <div>
                    <h2>Select Options to Display Response:</h2>
                    <label>
                        <input
                            type="checkbox"
                            name="alphabets"
                            checked={selectedOptions.alphabets}
                            onChange={handleOptionChange}
                        />
                        Alphabets
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="numbers"
                            checked={selectedOptions.numbers}
                            onChange={handleOptionChange}
                        />
                        Numbers
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="highestLowercase"
                            checked={selectedOptions.highestLowercase}
                            onChange={handleOptionChange}
                        />
                        Highest Lowercase Alphabet
                    </label>

                    {renderResponse()}
                </div>
            )}
        </div>
    );
}

export default App;