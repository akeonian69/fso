import { useState, useEffect } from 'react'
import personsService from './services/persons'

const ErrNotification = (props) => {
  const { msg } = props
  if (msg == null) {
    return null
  }
  const notificationStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return <div style={notificationStyle}>{msg}</div>
}
const Notification = (props) => {
  const { msg } = props
  if (msg == null) {
    return null
  }
  const notificationStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return <div style={notificationStyle}>{msg}</div>
}
const Filter = (props) => {
  const { search, onChange } = props
  return <div>
    filter shown with
    <input value={search} onChange={onChange}/>
    </div>
}

const Person = (props) => {
  const { person, onDelete } = props
  const { name, number } = person
  return <div>{name} {number} <button onClick={() => onDelete(person)}>delete</button></div>
}

const Persons = (props) => {
  const { persons, onDelete } = props
  return persons.map(person => (
    <Person key={person.id} person={person} onDelete={onDelete} />
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
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    console.log('effect')
    personsService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }
  useEffect(hook, [])

  console.log('render', persons.length, 'persons')
  const showMessage = msg => {
    setMessage(msg)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }
  const showErrorMessage = msg => {
    setErrorMessage(msg)
    setTimeout(() => {
      setErrorMessage(null)
    }, 4000)
  }
  const addPerson = (event) => {
    event.preventDefault()
    const found = persons.find(person => person.name === newName)
    if (found === undefined) {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personsService
        .create(newPerson)
        .then(newPerson => {
          const newPersons = persons.concat(newPerson)
          setNewName('')
          setNewNumber('')
          setPersons(newPersons)
          showMessage(`Added ${newPerson.name}`)
        })
    } else {
      const msg = `${found.name} is already added to phonebook, replace the old number with a new one?`
      if (window.confirm(msg)) {
        const updatedPerson = { ...found, number: newNumber }
        personsService
          .update(found.id, updatedPerson)
          .then(data => {
            const newPersons = persons.map(person => {
              return person.id !== data.id ? person : data 
            })
            setNewName('')
            setNewNumber('')
            setPersons(newPersons)
            showMessage(`Updated ${updatedPerson.name}`)
          })
          .catch(error => {
            showErrorMessage(`Information of ${found.name} has already been deleted from the server`)
            console.log(error)
            setPersons(persons.filter(p => p.id !== found.id))
          })
      }
    }
  }
  
  const handleDelete = person => {
    const confirmationMsg = `Delete ${person.name} ?`
    if (window.confirm(confirmationMsg)) {
      personsService
        .remove(person.id)
        .then(data => {
          const newPersons = persons.filter(person => data.id !== person.id)
          setPersons(newPersons)
          showMessage(`Deleted ${person.name}`)
        })
        .catch(error => {
          console.log(error)
        })
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
      <Notification msg={message} />
      <ErrNotification msg={errorMessage} />
      <Filter search={search} onChange={handleSearchChange} />
      <h3>add a new</h3>
      <PersonForm name={newName} onNameChange={handleNameChange}
        number={newNumber} onNumberChange={handleNumberChange}
        onSubmit={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={filtered} onDelete={handleDelete} />
    </div>
  )
}

export default App