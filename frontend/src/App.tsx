import { Button, DarkThemeToggle, Navbar } from "flowbite-react"
import { beginAuthFlow, onRedirect } from "./util/oauth"
import { useEffect } from "react"
import { Link, Outlet } from "react-router-dom";

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('code') !== null) {
      onRedirect()
    }
  }, []);

  return (
    <>
      <Navbar fluid className="px-6 border border-b border-gray-200 dark:border-gray-600 dark:bg-gray-700 mb-3">
        <Navbar.Brand as={Link} href="/">
          <img src="/reABackground.png" className="mr-3 h-6 sm:h-9 rounded" alt="Flowbite React Logo" />
          <span className="self-center whitespace-nowrap text-xl font-bold dark:text-white">Realliance</span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <DarkThemeToggle />
        </Navbar.Collapse>
      </Navbar>
      <div className="container mx-auto py-2">
        Nothing to see here yet.
        <Button onClick={() => beginAuthFlow()}>Authenticate</Button>
      </div>
      <Outlet />
    </>
  )
}

export default App
