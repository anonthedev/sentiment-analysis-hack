// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import landingHTML from '../components/Landing.html';

export default function Home() {
  return (
    <main dangerouslySetInnerHTML={{ __html: landingHTML }}>
    </main>
  );
}
