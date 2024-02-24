import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import { useMessageDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const messageDispatch = useMessageDispatch()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updatedAnecdotes = anecdotes.map(a => {
        if (a.id === updatedAnecdote.id) {
          return updatedAnecdote
        }
        return a
      })
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
      const msg = `anecdote '${updateAnecdote.content}' voted`
      messageDispatch({ type: 'SET_MESSAGE', payload: msg})
      setTimeout(() => {
        messageDispatch({ type: 'RESET_MESSAGE', payload: msg})
      }, 5000)
    },
    onError: (error) => {
      console.log('error', error)
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false
  })
  console.log(JSON.parse(JSON.stringify(result)))
  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }
  if (result.isLoading) {
    return <div>Loading data...</div>
  }
  const handleVote = (anecdote) => {
    console.log('vote')
    const updatedAnecdote = {
      ...anecdote, votes: anecdote.votes + 1
    }
    updateAnecdoteMutation.mutate(updatedAnecdote)
  }

  const anecdotes = result.data 

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
