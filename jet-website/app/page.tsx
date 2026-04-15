import Experience from '@/components/Experience';
import Specs from '@/components/sections/Specs';
import Quote from '@/components/sections/Quote';
import Legacy from '@/components/sections/Legacy';

export default function Home() {
  return (
    <main>
      <Experience />
      <Specs />
      <Quote />
      <Legacy />
    </main>
  );
}
