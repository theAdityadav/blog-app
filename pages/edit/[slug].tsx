import { useRouter } from 'next/router';
import WritePage from '../write';

export default function EditPage() {
  const router = useRouter();
  const { slug } = router.query;
  return <WritePage editSlug={slug as string} />;
}
