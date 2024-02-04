import { useState } from "react"

const Button = props => {
  return <button onClick={props.onClick}>
    {props.text}
  </button>
}

const Stats = (props) => (
  <div>{props.text} {props.count}</div>
)
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
  }
  const total = good + neutral + bad
  const avg = (good - bad)/total
  const positive = good*100/total
  return <div>
    <h1>give feedback</h1>
    <div>
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
    </div>
    <h2>statistics</h2>
    <Stats text='good' count={good} />
    <Stats text='neutral' count={neutral} />
    <Stats text='bad' count={bad} />
    <div>all {total}</div>
    <div>average {avg}</div>
    <div>positive {positive}</div>
  </div>
}

export default App
