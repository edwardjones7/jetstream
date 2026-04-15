// Verified hotlinkable Unsplash photos used as cinematic backdrops.
// Query params fit them to cinematic aspect ratio and apply Unsplash's CDN compression.
const U = (id: string, w = 2000, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const MEDIA = {
  hero:      U('1569629743817-70d8db6c323b'),   // fighter jet at sunset
  hangar:    U('1487058792275-0ad4aaf24ca7'),   // dark industrial
  runway:    U('1540962351504-03099e0a754b'),   // jet, atmospheric
  afterburn: U('1504639725590-34d0984388bd'),   // jet profile
  clouds1:   U('1436491865332-7a61a109cc05'),   // clouds from above
  clouds2:   U('1474302770737-173ee21bab63'),   // wing above clouds
  clouds3:   U('1464037866556-6812c9d1c72e'),   // cloud layer
  cockpit1:  U('1534088568595-a066f410bcda'),   // cockpit
  cockpit2:  U('1525130413817-d45c1d127c42'),   // cockpit
  jetA:      U('1542296332-2e4473faf563'),      // military jet
  jetB:      U('1570710891163-6d3b5c47248b'),   // jet
  jetC:      U('1416169607655-0c2b3ce2e1cc'),   // jet
  jetD:      U('1494083306499-e22e4a457632'),   // jet
  jetE:      U('1464822759023-fed622ff2c3b'),   // jet / landscape
  jetF:      U('1534996858221-380b92700493'),   // atmospheric
  mach:      U('1516738901171-8eb4fc13bd20'),   // jet / speed
  apex:      U('1581922819941-6ab31ab79afc'),   // earth / space
  contrail:  U('1551986782-d0169b3f8fa7'),      // atmospheric
  // Local hero footage, served from /public
  heroVideo: '/jet.mp4',
} as const;
