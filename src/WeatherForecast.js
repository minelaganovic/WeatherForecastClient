import React, { useState, useEffect } from 'react';
import './WeatherForecast.css'; // Poveži CSS fajl

const WeatherForecast = () => {
    const [forecasts, setForecasts] = useState([]);
    const [newForecast, setNewForecast] = useState({
        date: '',
        temperatureC: '',
        summary: ''
    });
    const [editingForecastId, setEditingForecastId] = useState(null); // ID prognoze koja se uređuje

    // Funkcija za učitavanje vremenskih prognoza
    const fetchForecasts = async () => {
        const response = await fetch('https://localhost:7006/weatherforecast');
        const data = await response.json();
        setForecasts(data);
    };

    // Učitaj podatke kada se komponenta montira
    useEffect(() => {
        fetchForecasts();
    }, []);

    // Funkcija za dodavanje nove prognoze
    const addForecast = async (e) => {
        e.preventDefault(); // Sprečava osvežavanje stranice

        const response = await fetch('https://localhost:7006/weatherforecast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newForecast),
        });

        if (response.ok) {
            fetchForecasts(); // Ponovo učitaj prognoze nakon dodavanja
            setNewForecast({ date: '', temperatureC: '', summary: '' }); // Očisti formu
        } else {
            console.error("Error adding forecast");
        }
    };

    // Funkcija za brisanje prognoze
    const deleteForecast = async (id) => {
        const response = await fetch(`https://localhost:7006/weatherforecast/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchForecasts(); // Ponovo učitaj prognoze nakon brisanja
        } else {
            console.error("Error deleting forecast");
        }
    };

    // Funkcija za izmenu prognoze
    const editForecast = (forecast) => {
        setNewForecast({
            date: forecast.date,
            temperatureC: forecast.temperatureC,
            summary: forecast.summary
        });
        setEditingForecastId(forecast.id); // Postavi ID prognoze koja se uređuje
    };

    // Funkcija za čuvanje izmenjene prognoze
    const saveEdit = async (e) => {
        e.preventDefault(); // Sprečava osvežavanje stranice

        const response = await fetch(`https://localhost:7006/weatherforecast/${editingForecastId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newForecast),
        });

        if (response.ok) {
            fetchForecasts(); // Ponovo učitaj prognoze nakon izmena
            setNewForecast({ date: '', temperatureC: '', summary: '' }); // Očisti formu
            setEditingForecastId(null); // Resetuj ID nakon čuvanja
        } else {
            console.error("Error updating forecast");
        }
    };

    return (
        <div className="weather-forecast-container">
            <h2>Weather Forecasts</h2>

            {/* Tabela za prikaz podataka */}
            <table className="forecast-table">
                <thead>
                    <tr>
                        <th>Datum prognoze</th>
                        <th>Temperatura (°C)</th>
                        <th>Opis</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast => (
                        <tr key={forecast.id}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}°C</td>
                            <td>{forecast.summary}</td>
                            <td>
                                <button onClick={() => editForecast(forecast)} style={{ marginLeft: '10px' }}>
                                    Edit
                                </button>
                                <button onClick={() => deleteForecast(forecast.id)} style={{ marginLeft: '10px' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>{editingForecastId ? 'Edit Forecast' : 'Add New Forecast'}</h3>
            <form className="forecast-form" onSubmit={editingForecastId ? saveEdit : addForecast}>
                <input
                    type="date"
                    value={newForecast.date}
                    onChange={(e) => setNewForecast({ ...newForecast, date: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Temperature (C)"
                    value={newForecast.temperatureC}
                    onChange={(e) => setNewForecast({ ...newForecast, temperatureC: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Summary"
                    value={newForecast.summary}
                    onChange={(e) => setNewForecast({ ...newForecast, summary: e.target.value })}
                    required
                />
                <button type="submit">{editingForecastId ? 'Save Changes' : 'Add Forecast'}</button>
            </form>
        </div>
    );
};

export default WeatherForecast;
