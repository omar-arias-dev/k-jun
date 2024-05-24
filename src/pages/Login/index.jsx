export default function Login({ logged, setLogged }) {

  const handleLoggedChange = () => setLogged(!logged); 

  return (
    <>
      <h1>Login</h1>
      <button onClick={() => handleLoggedChange()}>Login</button>
    </>
  );
}
