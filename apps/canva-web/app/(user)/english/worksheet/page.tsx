'use client';

import dynamic from 'next/dynamic';

const WorksheetEditor = dynamic(
  () => import('./_components/WorksheetEditor'),
  { ssr: false }
);

export default function WorksheetPage() {
  return <WorksheetEditor />;
}
