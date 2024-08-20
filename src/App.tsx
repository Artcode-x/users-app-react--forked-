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
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(4)

  const fetchUsers = () => {
    const offset = (currentPage - 1) * itemsPerPage
    requestUsers({ name: nameFilter, age: ageFilter, limit: itemsPerPage, offset })
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
  }, [nameFilter, ageFilter, currentPage, itemsPerPage])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value)
    setCurrentPage(1)
  }

  const handleAgeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgeFilter(event.target.value)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
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
        {users.length === 0 ? (
          <li>Users not found</li>
        ) : (
          users.map((user) => <li key={user.id}>{`${user.name}, ${user.age}`}</li>)
        )}
      </ul>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", paddingRight: "10px" }}>
          <ul style={{ marginRight: "10px" }}>By Page:</ul>
          <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
        </div>
        <div style={{ padding: "10px" }}>
          <button
            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span> Page {currentPage} </span>
          <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        </div>
      </div>
      {/* <Requirements /> */}
    </div>
  )
}
