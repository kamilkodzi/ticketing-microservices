import { useEffect, useState } from 'react'
import StripeCeckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  })
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  if (timeLeft < 0) {
    return <div>Order expired</div>
  }
  return (
    <div>
      {timeLeft} seconds until order expires
      <div className="m-2">
        <StripeCeckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey="pk_test_51OadTOAwa585ZjceRavBmazzLCZR2UMwxXubYyEkIiAs7hRPznVeFhftwaCPUhDXzN4TcAMJeij0qleufTKDugi80047IdQ3vx"
          amount={order.ticket.price * 100}
          email={currentUser.email}
        />
      </div>
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)
  return { order: data }
}
export default OrderShow
