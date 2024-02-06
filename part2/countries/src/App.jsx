import { useState, useEffect } from 'react'
import countries from './services/countries'

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
  const { country } = props
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
  </div>
}

const Results = (props) => {
  const { results, onShow } = props
  if (results.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (results.length === 1) {
    return <BasicData country={results[0]} />
  }
  return <CountryList countries={results} onShow={onShow} />
}

const App = () => {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
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
  return <div>
      <SearchBar search={search} onChange={handleSearchChange} />
      <Results results={filteredResult} onShow={handleShow}/>
    </div>
}

export default App
