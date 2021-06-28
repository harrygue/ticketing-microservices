import buildClient from "../api/build-client"

// inside the component the request is always comming
// from the browser and we don't have to care about the domain, instead use ""
const LandingPage = ({currentUser}) => {
  // console.log('Index: ',currentUser)
  return (
    currentUser ? (
      <h1>You are signed in</h1>
    ) : (
      <h1>You are NOT signed in!</h1>
    )
  )
}

// cannot call useRequest hook inside a function therefore call axios directly
// here we have to care about the domain
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser');
  return data;
}

export default LandingPage;