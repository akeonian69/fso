const Footer = () => {
  return (
    <div>
      greetings app created by <a href='https://github.com/mluukkai'>mluukkai</a>
    </div>
  )
}

const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10
  const friends = [
    { name: 'Peter', age: 4 },
    { name: 'Maya', age: 10 }
  ]
  const array = ['Peter', 'Maya']
  return (
    <>
      <h1>Greetings</h1>
      <Hello name='George' age={26 + 10}/>
      <Hello name={name} age={age}/>
      <Footer />
      <div>
        <p>{friends[0].name} {friends[0].age}</p>
        <p>{friends[1].name} {friends[1].age}</p>
      </div>
      <div>
        <p>{array}</p>
      </div>
    </>
  )
}

export default App