import axios from 'axios'
import { useState } from 'react'

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const response = await axios[method](url, { ...body, ...props })
      if (onSuccess) {
        onSuccess(response.data)
      }
      return response.data
    } catch (error) {
      setErrors(
        <div className="alert alert-danger my-2">
          <h4>Opps...</h4>
          <ul className="my-0">
            {error.response?.data?.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors }
}

export default useRequest
