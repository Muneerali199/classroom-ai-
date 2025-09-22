import MeetingsHub from '@/components/meetings-hub';
import { Suspense } from 'react';

export default function MeetingsPage() {
  return (
    <Suspense>
      <MeetingsHub />
    </Suspense>
  );
}
