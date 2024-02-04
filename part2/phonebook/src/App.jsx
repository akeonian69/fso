import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const found = persons.find(person => person.name == newName)
    if (found === undefined) {
      const newPerson = {
        name: newName
      }
      const newPersons = persons.concat(newPerson)
      setNewName('')
      setPersons(newPersons)
    } else {
      alert(newName + ' is already added to phonebook')
    }
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  console.log(persons);

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => (
        <div key={person.name}>{person.name}</div>
      ))}
    </div>
  )
}

export default App