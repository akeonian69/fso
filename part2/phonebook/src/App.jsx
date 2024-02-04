import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const found = persons.find(person => person.name == newName)
    if (found === undefined) {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      const newPersons = persons.concat(newPerson)
      setNewName('')
      setPersons(newPersons)
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }
  console.log(persons);
  const filtered = persons.filter(person => {
    return person.name.toLowerCase().startsWith(search.toLowerCase())
  })

  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with<input value={search} onChange={handleSearchChange}/></div>
      <h3>add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filtered.map(person => (
        <div key={person.id}>
          {person.name} {person.number}
        </div>
      ))}
    </div>
  )
}

export default App