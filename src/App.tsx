import React, { useEffect, useState } from "react"
import { requestUsers, requestUsersWithError, User } from "./api"
import "./styles.css"

import Requirements from "./Requirements"

export default function App() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [nameFilter, setNameFilter] = useState<string>("")

  const fetchUsers = () => {
    requestUsers({ name: nameFilter, age: "", limit: 4, offset: 0 })
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        requestUsersWithError().catch((errorWithError) => {
          setError(errorWithError)
          setLoading(false)
        })

        setError(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchUsers()
  }, [nameFilter])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <Requirements />
      <input type="text" value={nameFilter} onChange={handleNameChange} placeholder="Фильтр по имени" />
      <h2>Users List:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{`${user.name}, ${user.age}`}</li>
        ))}
      </ul>
    </div>
  )
}
