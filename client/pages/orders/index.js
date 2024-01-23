const OrderIndex = ({ orders }) => {
  const completedOrders = orders.filter((order) => order.status === 'complete')
  const cancelleddOrders = orders.filter(
    (order) => order.status === 'cancelled'
  )
  return (
    <div>
      <h2>Completed orders</h2>
      <ul>
        {completedOrders.map((order) => {
          return (
            <li key={order.id}>
              {order.ticket.title} ({order.ticket.price} $) - {order.status}
            </li>
          )
        })}
      </ul>
      <h2>Cancelled orders</h2>
      <ul>
        {cancelleddOrders.map((order) => {
          return (
            <li key={order.id}>
              {order.ticket.title} ({order.ticket.price} $) - {order.status}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders')
  return { orders: data }
}

export default OrderIndex
