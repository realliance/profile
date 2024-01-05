import { useRouteError } from 'react-router-dom';

export function Error() {
  const error = useRouteError();

  console.log(error);

  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <h1 className="text-lg">Oopsie</h1>
        <h2>An error occured</h2>
      </div>
    </div>
  );
}
