import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const search = state.filter.toLowerCase()
    return state.anecdotes
      .filter(a => a.content.toLowerCase().includes(search))
      .sort((a,b) => b.votes - a.votes )
  })
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    console.log('vote', anecdote.id)
    dispatch(voteAnecdote(anecdote))
    const msg = `You voted '${anecdote.content}'`
    dispatch(setNotification(msg, 5000))
  }
  return <>
    {anecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      </div>
    )}
  </>
}

export default AnecdoteList