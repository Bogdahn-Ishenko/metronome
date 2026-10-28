import PracticeLanding from '@/components/PracticeLanding';
import { PRACTICE_PAGES, practiceMetadata } from '@/lib/practicePages';

const page = PRACTICE_PAGES.guitar;

export const metadata = practiceMetadata(page);

export default function GuitarMetronomePage() {
  return <PracticeLanding page={page} />;
}
