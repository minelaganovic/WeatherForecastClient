const API_URL = 'https://localhost:7006/weatherforecast';

// Funkcija za učitavanje vremenskih prognoza
export const fetchForecasts = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
};

// Funkcija za dodavanje nove prognoze
export const addForecast = async (forecast) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(forecast),
    });

    if (!response.ok) {
        throw new Error("Error adding forecast");
    }
};

// Funkcija za brisanje prognoze
export const deleteForecast = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error("Error deleting forecast");
    }
};

// Funkcija za ažuriranje prognoze
export const updateForecast = async (id, forecast) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(forecast),
    });

    if (!response.ok) {
        throw new Error("Error updating forecast");
    }
};
