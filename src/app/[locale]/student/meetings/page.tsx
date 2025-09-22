"use client";

import MeetingsHub from '@/components/meetings-hub';

export default function StudentMeetingsPage() {
  // MeetingsHub uses API role guards: students will not be able to create; they can view/join
  return <MeetingsHub viewOnly />;
}
