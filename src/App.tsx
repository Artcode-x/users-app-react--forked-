import React, { useEffect, useState } from "react"
import { requestUsers, requestUsersWithError, User } from "./api"
import "./styles.css"
import Requirements from "./Requirements"

export default function App() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  console.log(error)
  useEffect(() => {
    requestUsers({ name: "", age: "", limit: 4, offset: 0 })
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        requestUsersWithError().catch((someError) => {
          console.log(someError)
          setError(someError)
          setLoading(false)
        })

        setError(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error?.message}</div>
  }

  return (
    <div>
      <Requirements />
      <h2>Users List:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{`${user.name}, ${user.age}`}</li>
        ))}
      </ul>
    </div>
  )
}
