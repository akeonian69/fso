const Header = (props) => {
  const { text } = props
  return <h2>{text}</h2>
}

const Part = (props) => {
  console.log("Part", props)
  const { part } = props
  const { name, exercises } = part
  return <p>{name} {exercises}</p>
}

const Content = (props) => {
  console.log("Content", props)
  const { parts } = props
  return <div>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </div>
}

const Total = (props) => {
  const total = props.parts.reduce((t, part) => t + part.exercises, 0)
  return <p>total of {total} exercises</p>
}
const Course = (props) => {
  console.log("Course", props);
  const { course } = props
  const { name, parts } = course
  return <div>
    <Header text={name} />
    <Content parts={parts} />
    <Total parts={parts}/>
  </div>
}

export default Course