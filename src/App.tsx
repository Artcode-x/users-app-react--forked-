import React, { useEffect, useState } from "react"
import { requestUsers, requestUsersWithError, User } from "./api"
import "./styles.css"
import Requirements from "./Requirements"

export default function App() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [nameFilter, setNameFilter] = useState<string>("")
  const [ageFilter, setAgeFilter] = useState<string>("")

  const fetchUsers = () => {
    requestUsers({ name: nameFilter, age: ageFilter, limit: 4, offset: 0 })
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        requestUsersWithError().catch((someError) => {
          setError(someError)
          setLoading(false)
        })

        setError(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchUsers()
  }, [nameFilter, ageFilter])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value)
  }

  const handleAgeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgeFilter(event.target.value)
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
      <input
        style={{ marginRight: "10px" }}
        type="text"
        value={nameFilter}
        onChange={handleNameChange}
        placeholder="Фильтр по имени"
      />
      <input type="text" value={ageFilter} onChange={handleAgeFilter} placeholder="Фильтр по возрасту" />
      <h2>Users List:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{`${user.name}, ${user.age}`}</li>
        ))}
      </ul>
    </div>
  )
}
