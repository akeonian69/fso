import { useState, useEffect } from 'react'
import countries from './services/countries'
import weather from './services/weather'

const SearchBar = ({ search, onChange }) => {
  return <div>
    find countries <input value={search} onChange={onChange} />
  </div>
}

const CountryItem = (props) => {
  const { name, onShow } = props
  return <div>
    {name} <button onClick={() => onShow(name)}>Show</button>
  </div>
}

const CountryList = (props) => {
  const { countries, onShow } = props
  return <div>
    {countries.map(country => {
        const name = country.name.common  
        return <CountryItem key={name} name={name} onShow={onShow} />
      }
    )}
  </div>
}

const BasicData = (props) => {
  const { country, countryWeather } = props
  const name = country.name.common
  const capital = country.capital[0]
  const area = country.area
  const languages = Object.entries(country.languages)
  const flagSource = country.flags.png
  return <div>
    <h1>{name}</h1>
    <p>capital {capital}</p>
    <p>area {area}</p>
    <h4>languages:</h4>
    <ul>
      {languages.map(l => <li key={l[0]}>{l[1]}</li>)}
    </ul>
    <img src={flagSource} />
    <Weather countryWeather={countryWeather} />
  </div>
}

const Weather = (props) => {
  const { countryWeather } = props
  if (countryWeather == null) {
    return <></>
  }
  const temp = (countryWeather.weather.main.temp - 273.15).toFixed(2)
  const windSpeed = countryWeather.weather.wind.speed
  const icon = countryWeather.weather.weather[0].icon
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
  return <>
    <h3>Weather in {countryWeather.country}</h3>
    <p>temperature {temp} Celcius</p>
    <img src={iconUrl}></img>
    <p>wind {windSpeed} m/s</p>
  </>
}

const Results = (props) => {
  const { results, countryWeather, onShow } = props
  if (results.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (results.length === 1) {
    return <BasicData country={results[0]} countryWeather={countryWeather} />
  }
  return <CountryList countries={results} onShow={onShow} />
}

const App = () => {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [countryWeather, setCountryWeather] = useState(null)

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const loadAllCountries = () => {
    countries
      .getAll()
      .then(data => {
        setResults(data)
      })
      .catch(error => {
        console.log(error)
      })
  }
  useEffect(loadAllCountries, [])

  const handleShow = name => setSearch(name)

  const filteredResult = results.filter(country => {
    return country.name.common.toLowerCase().startsWith(search.toLowerCase())
  })
  if (filteredResult.length == 1) {
    const name = filteredResult[0].name.common
    if (countryWeather == null || countryWeather.country != name)
      weather
        .getWeather(name)
        .then((data) => {
          setCountryWeather({
            country: name,
            weather: data
          })
        })
  }

  return <div>
      <SearchBar search={search} onChange={handleSearchChange} />
      <Results results={filteredResult} countryWeather={countryWeather} onShow={handleShow}/>
    </div>
}

export default App
