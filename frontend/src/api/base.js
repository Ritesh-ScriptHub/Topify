const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData

  const config = {
    credentials: "include", // sends httpOnly cookie on every request
    headers: {
      // don't set Content-Type for FormData — browser sets it with boundary
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...options.headers,
    },
    ...options,
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config)

  // handle empty responses (e.g. 204)
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}

  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong")
    error.status = res.status
    throw error
  }

  return data
}

export default request