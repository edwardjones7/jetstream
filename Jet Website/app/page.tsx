import Hero from '@/components/sections/Hero';
import Ignition from '@/components/sections/Ignition';
import Ascent from '@/components/sections/Ascent';
import Fleet from '@/components/sections/Fleet';
import Anatomy from '@/components/sections/Anatomy';
import Mach from '@/components/sections/Mach';
import Apex from '@/components/sections/Apex';
import Legacy from '@/components/sections/Legacy';

export default function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <Ignition />
      <Ascent />
      <Fleet />
      <Anatomy />
      <Mach />
      <Apex />
      <Legacy />
    </main>
  );
}
