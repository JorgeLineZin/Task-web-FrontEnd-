import axios from "axios"
// require('dotenv').config()

const apiUrl = import.meta.env.BASE_URL

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})
