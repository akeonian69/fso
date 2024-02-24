import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { notificationMsg, resetMsg } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    const anecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(anecdote))
    const msg = `You added '${anecdote.content}'`
    dispatch(notificationMsg(msg))
    setTimeout(() => dispatch(resetMsg()), 5000)
  }
  return <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdote'/></div>
        <button type='submit'>create</button>
      </form>
  </>
}

export default AnecdoteForm 