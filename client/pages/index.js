import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signin</h1> : <h1>You are NOT signin !</h1>
}

LandingPage.getInitialProps = async (contex) => {
  const client = buildClient(contex)
  const { data } = await client.get('/api/users/currentuser')

  return data
}

export default LandingPage
