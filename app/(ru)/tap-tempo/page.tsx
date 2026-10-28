import PracticeLanding from '@/components/PracticeLanding';
import { PRACTICE_PAGES, practiceMetadata } from '@/lib/practicePages';

const page = PRACTICE_PAGES.tap;

export const metadata = practiceMetadata(page);

export default function TapTempoPage() {
  return <PracticeLanding page={page} />;
}
