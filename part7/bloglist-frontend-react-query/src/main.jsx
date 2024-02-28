import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './NotificationContext'
import { ErrorNotificationContextProvider } from './ErrorNotificationContext'
import { UserContextProvider } from './UserContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorNotificationContextProvider>
    <NotificationContextProvider>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </QueryClientProvider>
    </NotificationContextProvider>
  </ErrorNotificationContextProvider>
)
