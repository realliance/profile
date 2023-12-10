import { Button } from "flowbite-react"
import { beginAuthFlow, onRedirect } from "./util/oauth"
import { useEffect } from "react"

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('code') !== null) {
      onRedirect()
    }
  }, []);

  return (
    <div className="container mx-auto py-2">
      Nothing to see here yet.
      <Button onClick={() => beginAuthFlow()}>Authenticate</Button>
    </div>
  )
}

export default App
