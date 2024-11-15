import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    fixedAcidity: '',
    volatileAcidity: '',
    citricAcid: '',
    residualSugar: '',
    chlorides: '',
    freeSulfurDioxide: '',
    totalSulfurDioxide: '',
    density: '',
    pH: '',
    sulphates: '',
    alcohol: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePredict = async () => {
    
    if (Object.values(formData).some(value => value === '')) {
      setError('Please fill out all fields before submitting.');
      return;
    }

    setError(''); 

    const response = await fetch('https://wine-ml-project-api.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    const quality = data.quality;
    console.log('Prediction:', quality);
    setResult(quality);  
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log("File uploaded:", file);
  };

  return (
    <div className="App">
      <h1>Wine Quality Prediction Project</h1>
      <div className="App-container">
        <div className='form-container'>
          <h3 style={{ color: "black" }}>Enter your wine Data</h3>

          {Object.keys(formData).map((field) => (
            <div className="row" key={field}>
              <label>{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="inputfield"
                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                required
              />
            </div>
          ))}

          <button onClick={handlePredict}>Predict Quality</button>

          {error && <p style={{ color: 'red' }}>{error}</p>} 
        </div>

        <div className="result-container">
          <div>Predicted Wine Quality: {result !== null ? result : "No wine chosen"}</div>

          <div
            className="quality-chart"
            style={{
              background: `linear-gradient(to right, red, yellow, green)`,
              width: '100%',
              height: '20px',
              borderRadius: '5px',
              position: 'relative',
            }}
          >
            {result !== null && (
              <div
                className="marker"
                style={{
                  position: 'absolute',
                  left: `${(result - 1) * 10}%`,  
                  top: '-10px',
                  width: '5px',
                  height: '30px',
                  backgroundColor: 'black',
                }}
              />
            )}

            <div className="chart-labels">
              <span style={{ position: 'absolute', left: '0%' }}>Bad</span>
              <span style={{ position: 'absolute', left: '45%' }}>Medium</span>
              <span style={{ position: 'absolute', left: '90%' }}>Good</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
