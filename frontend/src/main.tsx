import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './authentication/login.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './authentication/register.tsx'
import Home from './home/home.tsx'
import CreateTodo from './create-todo/create-todo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-todo" element={<CreateTodo />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
