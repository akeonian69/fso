import axios from 'axios'

const apiKey = import.meta.env.VITE_WEATHER_KEY

const getUrl = country => {
    return `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${country}`
}

const getWeather = country => {
    const request = axios.get(getUrl(country))
    return request.then(response => response.data)
}

export default { getWeather }