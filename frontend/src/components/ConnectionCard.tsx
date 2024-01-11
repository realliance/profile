import { Avatar, Button, Card } from 'flowbite-react';

interface ConnectionCardProps {
  title: string;
  description: string;
  avatarImage?: string;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function ConnectionCard({
  title,
  description,
  avatarImage,
  connected,
  onConnect,
  onDisconnect,
}: ConnectionCardProps) {
  return (
    <Card>
      <h5 className="flex flex-row items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {avatarImage && <Avatar img={avatarImage} />}
        {title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {description}
      </p>
      <Button onClick={() => (connected ? onDisconnect() : onConnect())}>
        {connected ? 'Disconnect' : 'Connect'}
      </Button>
    </Card>
  );
}
