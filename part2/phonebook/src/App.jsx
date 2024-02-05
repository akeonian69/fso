import { useState } from 'react'

const Filter = (props) => {
  const { search, onChange } = props
  return <div>
    filter shown with
    <input value={search} onChange={onChange}/>
    </div>
}

const Person = (props) => {
  const { person } = props
  const { name, number } = person
  return <div>{name} {number}</div>
}

const Persons = (props) => {
  const { persons } = props
  return persons.map(person => (
    <Person key={person.id} person={person} />
  ))
}

const PersonForm = (props) => {
  const { name, number, onNameChange, onNumberChange, onSubmit } = props
  return ( 
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={name} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={number} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

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
    const found = persons.find(person => person.name === newName)
    if (found === undefined) {
      const newPerson = {
        id: persons.length + 1,
        name: newName,
        number: newNumber
      }
      const newPersons = persons.concat(newPerson)
      setNewName('')
      setNewNumber('')
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
      <Filter search={search} onChange={handleSearchChange} />
      <h3>add a new</h3>
      <PersonForm name={newName} onNameChange={handleNameChange}
        number={newNumber} onNumberChange={handleNumberChange}
        onSubmit={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={filtered} />
    </div>
  )
}

export default App