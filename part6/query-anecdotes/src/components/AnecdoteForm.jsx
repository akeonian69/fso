import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useMessageDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const messageDispatch = useMessageDispatch()

  const showMessage = msg => {
    messageDispatch({ type: 'SET_MESSAGE', payload: msg})
    setTimeout(() => {
      messageDispatch({ type: 'RESET_MESSAGE', payload: msg})
    }, 5000)
  }
  const createAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      const msg = `anecdote '${newAnecdote.content}' created`
      showMessage(msg)
    },
    onError: (error) => {
      console.log('error', error)
      if (error && error.response.data.error) {
        showMessage(error.response.data.error)
      }
    }

  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    const newAnecdote = {
      content, votes: 0
    }
    createAnecdoteMutation.mutate(newAnecdote)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
