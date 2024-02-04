import { useState } from "react"

const Button = props => {
  return <button onClick={props.onClick}>
    {props.text}
  </button>
}

const StatisticLine = (props) => (
  <div>{props.text} {props.value}</div>
)

const Statistics = ({ good, neutral, bad, all, avg, positive }) => {
  if (all == 0) {
    return <>
      <h2>statistics</h2>
      <p>No feedback given</p>
    </>
  }
  return <>
    <h2>statistics</h2>
    <StatisticLine text='good' value={good} />
    <StatisticLine text='neutral' value={neutral} />
    <StatisticLine text='bad' value={bad} />
    <StatisticLine text='all' value={all} />
    <StatisticLine text='avg' value={avg} />
    <StatisticLine text='positive' value={positive} />
  </>
}
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
  const all = good + neutral + bad
  const avg = (good - bad)/all
  const positive = good*100/all
  return <div>
    <h1>give feedback</h1>
    <div>
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
    </div>
    <Statistics 
      good={good}
      neutral={neutral}
      bad={bad}
      all={all}
      avg={avg}
      positive={positive} /> 
  </div>
}

export default App
