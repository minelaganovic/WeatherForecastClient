import React, { useState, useEffect } from 'react';
import './WeatherForecast.css'; // Poveži CSS fajl
import { fetchForecasts, addForecast, deleteForecast, updateForecast } from './api'; // Uvoz funkcija iz API fajla

const WeatherForecast = () => {
    const [forecasts, setForecasts] = useState([]);
    const [newForecast, setNewForecast] = useState({
        date: '',
        temperatureC: '',
        summary: ''
    });
    const [editingForecastId, setEditingForecastId] = useState(null); // ID prognoze koja se uređuje

    // Učitaj podatke kada se komponenta kreira
    useEffect(() => {
        const loadForecasts = async () => {
            const data = await fetchForecasts();
            setForecasts(data);
        };
        loadForecasts();
    }, []);

    // Funkcija za dodavanje nove prognoze
    const handleAddForecast = async (e) => {
        e.preventDefault(); // Sprečava osvežavanje stranice
        try {
            await addForecast(newForecast);
            setNewForecast({ date: '', temperatureC: '', summary: '' }); // Očisti formu
            const updatedForecasts = await fetchForecasts();
            setForecasts(updatedForecasts); // Ponovo učitaj prognoze nakon dodavanja
        } catch (error) {
            console.error(error.message);
        }
    };

    // Funkcija za brisanje prognoze
    const handleDeleteForecast = async (id) => {
        try {
            await deleteForecast(id);
            const updatedForecasts = await fetchForecasts();
            setForecasts(updatedForecasts); // Ponovo učitaj prognoze nakon brisanja
        } catch (error) {
            console.error(error.message);
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
    const handleSaveEdit = async (e) => {
        e.preventDefault(); // Sprečava osvežavanje stranice
        try {
            await updateForecast(editingForecastId, newForecast);
            setNewForecast({ date: '', temperatureC: '', summary: '' }); // Očisti formu
            setEditingForecastId(null); // Resetuj ID nakon čuvanja
            const updatedForecasts = await fetchForecasts();
            setForecasts(updatedForecasts); // Ponovo učitaj prognoze nakon izmena
        } catch (error) {
            console.error(error.message);
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
                                <button onClick={() => handleDeleteForecast(forecast.id)} style={{ marginLeft: '10px' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>{editingForecastId ? 'Edit Forecast' : 'Add New Forecast'}</h3>
            <form className="forecast-form" onSubmit={editingForecastId ? handleSaveEdit : handleAddForecast}>
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
