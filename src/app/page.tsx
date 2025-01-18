import landingHTML from '../components/Landing.html';

export default function Home() {
  return (
    <main dangerouslySetInnerHTML={{ __html: landingHTML }}>
    </main>
  );
}
