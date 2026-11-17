'use client';

import { useEffect } from 'react';
import { markAsRead } from '@/lib/actions';

export function MarkAsRead({ ids }: { ids: number[] }) {
  const key = ids.join(',');

  useEffect(() => {
    if (key) void markAsRead(key.split(',').map(Number));
  }, [key]);

  return null;
}
