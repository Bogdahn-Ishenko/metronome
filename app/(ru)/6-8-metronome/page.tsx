import PracticeLanding from '@/components/PracticeLanding';
import { PRACTICE_PAGES, practiceMetadata } from '@/lib/practicePages';

const page = PRACTICE_PAGES.compound;

export const metadata = practiceMetadata(page);

export default function CompoundMeterPage() {
  return <PracticeLanding page={page} />;
}
