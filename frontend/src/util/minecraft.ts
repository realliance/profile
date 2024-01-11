import { useContext, useEffect } from 'react';
import { MinecraftContext } from '../contexts/MinecraftContext';

export function useMinecraftContext(
  userId?: string,
): Omit<MinecraftContext, 'provideID'> {
  const { provideID, ...context } = useContext(MinecraftContext);

  useEffect(() => {
    if (userId && context.id !== userId) {
      provideID(userId);
    }
  }, [userId, context, provideID]);

  return context;
}
