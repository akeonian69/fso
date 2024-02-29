import { Link } from 'react-router-dom'
import {
  Container,
  Table,
  TableBody,
  TableContainer,
  Paper,
  Alert,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  TableHead,
  TableCell,
  TableRow,
} from '@mui/material'

const Users = (props) => {
  const { users } = props
  return (
    <div>
      <h2>Users</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell></TableCell>
            <TableCell>blogs created</TableCell>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
