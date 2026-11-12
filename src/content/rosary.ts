// The Holy Rosary. Scripture for each mystery is resolved from the Douay-Rheims at build time.

export type MysterySet = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';

export interface Mystery {
  title: string;
  ref: string;
  fruit: string;
  meditation: string;
}

export interface MysteryGroup {
  id: MysterySet;
  title: string;
  days: string;
  description: string;
  mysteries: Mystery[];
}

export const MYSTERIES: MysteryGroup[] = [
  {
    id: 'joyful',
    title: 'Joyful Mysteries',
    days: 'Monday & Saturday',
    description: 'The Incarnation and the hidden life of Jesus.',
    mysteries: [
      {
        title: 'The Annunciation',
        ref: 'Luke 1:26-38',
        fruit: 'Humility',
        meditation:
          'The angel Gabriel greets Mary, and she gives her free "yes" to God: "Be it done to me according to thy word." Ask for the grace to say yes to God in the small choices of today.',
      },
      {
        title: 'The Visitation',
        ref: 'Luke 1:39-45',
        fruit: 'Love of neighbour',
        meditation:
          'Mary hurries to serve her elderly cousin Elizabeth, carrying Christ within her. John leaps for joy. Ask for the grace to bring Christ to others through practical love.',
      },
      {
        title: 'The Nativity',
        ref: 'Luke 2:6-12',
        fruit: 'Poverty of spirit',
        meditation:
          'The Son of God is born in poverty and laid in a manger. God comes small and near. Ask for a heart detached from what does not matter and open to what does.',
      },
      {
        title: 'The Presentation',
        ref: 'Luke 2:22-32',
        fruit: 'Obedience',
        meditation:
          'Mary and Joseph present Jesus in the Temple, and Simeon recognises the light of the nations. Ask for the grace of faithful obedience in ordinary duties.',
      },
      {
        title: 'The Finding in the Temple',
        ref: 'Luke 2:42-49',
        fruit: 'Joy in finding Jesus',
        meditation:
          'After three days of searching, Mary and Joseph find Jesus in his Father\'s house. Ask for the grace to seek Jesus when he seems lost to you — and the joy of finding him again.',
      },
    ],
  },
  {
    id: 'luminous',
    title: 'Luminous Mysteries',
    days: 'Thursday',
    description: 'The public ministry of Jesus. Added by Saint John Paul II in 2002.',
    mysteries: [
      {
        title: 'The Baptism of the Lord',
        ref: 'Matthew 3:13-17',
        fruit: 'Openness to the Holy Spirit',
        meditation:
          'Jesus enters the Jordan, and the Father declares, "This is my beloved Son." Remember your own baptism: you too are a beloved child of God.',
      },
      {
        title: 'The Wedding at Cana',
        ref: 'John 2:1-11',
        fruit: 'To Jesus through Mary',
        meditation:
          'At Mary\'s request, Jesus turns water into wine. Her words are for us: "Whatsoever he shall say to you, do ye." Bring your empty jars to Jesus.',
      },
      {
        title: 'The Proclamation of the Kingdom',
        ref: 'Mark 1:14-15',
        fruit: 'Repentance and trust in God',
        meditation:
          'Jesus announces: "The kingdom of God is at hand: repent, and believe the gospel." Ask for a heart that turns daily toward God.',
      },
      {
        title: 'The Transfiguration',
        ref: 'Matthew 17:1-8',
        fruit: 'Desire for holiness',
        meditation:
          'On the mountain, Jesus\' glory shines through, and the Father says, "Hear ye him." Ask for the grace to listen to Jesus and to be transformed by him.',
      },
      {
        title: 'The Institution of the Eucharist',
        ref: 'Luke 22:19-20',
        fruit: 'Love of the Eucharist',
        meditation:
          'At the Last Supper, Jesus gives his Body and Blood. He remains with us in every Mass. Ask for deep love and reverence for the Eucharist.',
      },
    ],
  },
  {
    id: 'sorrowful',
    title: 'Sorrowful Mysteries',
    days: 'Tuesday & Friday',
    description: 'The Passion and death of Jesus.',
    mysteries: [
      {
        title: 'The Agony in the Garden',
        ref: 'Luke 22:39-46',
        fruit: 'Conformity to God\'s will',
        meditation:
          'In Gethsemani, Jesus prays, "Not my will, but thine be done," and sweats as it were drops of blood. Bring him your own anguish and your own surrender.',
      },
      {
        title: 'The Scourging at the Pillar',
        ref: 'John 19:1',
        fruit: 'Purity and mortification',
        meditation:
          'Jesus is scourged, enduring terrible pain for our sake. Ask for the grace of purity, and offer your own struggles for the sake of others.',
      },
      {
        title: 'The Crowning with Thorns',
        ref: 'Matthew 27:27-31',
        fruit: 'Courage and humility',
        meditation:
          'Soldiers mock Jesus as a king with a crown of thorns. He bears their contempt in silence. Ask for the grace to endure humiliation with humility.',
      },
      {
        title: 'The Carrying of the Cross',
        ref: 'Luke 23:26-32',
        fruit: 'Patience in suffering',
        meditation:
          'Jesus carries his cross, and Simon of Cyrene helps him. Ask for patience with your own crosses, and the grace to help others carry theirs.',
      },
      {
        title: 'The Crucifixion',
        ref: 'Luke 23:33-46',
        fruit: 'Perseverance and forgiveness',
        meditation:
          'Jesus forgives his executioners and promises paradise to a repentant thief. "Father, into thy hands I commend my spirit." Rest in a love that gave everything.',
      },
    ],
  },
  {
    id: 'glorious',
    title: 'Glorious Mysteries',
    days: 'Wednesday & Sunday',
    description: 'The Resurrection and the glory to come.',
    mysteries: [
      {
        title: 'The Resurrection',
        ref: 'Matthew 28:1-7',
        fruit: 'Faith',
        meditation:
          'The tomb is empty: "He is not here, for he is risen." No darkness is final. Ask for a living faith in the risen Lord.',
      },
      {
        title: 'The Ascension',
        ref: 'Acts 1:6-11',
        fruit: 'Hope',
        meditation:
          'Jesus ascends to the Father, promising the Holy Spirit and sending his disciples to the ends of the earth. Ask for hope fixed on heaven.',
      },
      {
        title: 'The Descent of the Holy Spirit',
        ref: 'Acts 2:1-4',
        fruit: 'Love of God and wisdom',
        meditation:
          'At Pentecost, the Spirit comes as wind and fire upon Mary and the apostles. Ask the Holy Spirit to fill you with courage and love.',
      },
      {
        title: 'The Assumption of Mary',
        ref: 'Psalms 44:10-12',
        fruit: 'Grace of a happy death',
        meditation:
          'Mary is taken body and soul into heaven, a sign of the glory God promises to all who are faithful. Scripture does not narrate this event; the Church defined it in 1950, and the Psalms\' image of the queen at the king\'s right hand has long been read of Mary.',
      },
      {
        title: 'The Coronation of Mary',
        ref: 'Revelation 12:1',
        fruit: 'Trust in Mary\'s intercession',
        meditation:
          'Mary is crowned Queen of Heaven and Earth. She is our mother who prays for us. Ask for the grace to trust her intercession and to persevere to the end.',
      },
    ],
  },
];

export function mysteriesForDate(d: Date): MysterySet {
  // Traditional weekday assignment (since 2002).
  return (['glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful'] as MysterySet[])[d.getDay()];
}

export interface RosaryStep {
  kind: 'prayer' | 'mystery' | 'intro';
  prayerId?: string;
  label: string;
  decade?: number; // 1..5
  bead?: number; // Hail Mary count within the decade (1..10) or intro beads (1..3)
  totalBeads?: number;
  mysteryIndex?: number;
}

/** Builds the full ordered sequence of a five-decade Rosary. */
export function buildRosarySteps(): RosaryStep[] {
  const s: RosaryStep[] = [
    { kind: 'intro', prayerId: 'sign-of-the-cross', label: 'Sign of the Cross' },
    { kind: 'intro', prayerId: 'apostles-creed', label: "Apostles' Creed (on the crucifix)" },
    { kind: 'intro', prayerId: 'our-father', label: 'Our Father' },
    { kind: 'intro', prayerId: 'hail-mary', label: 'Hail Mary — for an increase of faith', bead: 1, totalBeads: 3 },
    { kind: 'intro', prayerId: 'hail-mary', label: 'Hail Mary — for an increase of hope', bead: 2, totalBeads: 3 },
    { kind: 'intro', prayerId: 'hail-mary', label: 'Hail Mary — for an increase of charity', bead: 3, totalBeads: 3 },
    { kind: 'intro', prayerId: 'glory-be', label: 'Glory Be' },
  ];
  for (let d = 1; d <= 5; d++) {
    s.push({ kind: 'mystery', label: `Mystery ${d}`, decade: d, mysteryIndex: d - 1 });
    s.push({ kind: 'prayer', prayerId: 'our-father', label: 'Our Father', decade: d, mysteryIndex: d - 1 });
    for (let b = 1; b <= 10; b++)
      s.push({ kind: 'prayer', prayerId: 'hail-mary', label: 'Hail Mary', decade: d, bead: b, totalBeads: 10, mysteryIndex: d - 1 });
    s.push({ kind: 'prayer', prayerId: 'glory-be', label: 'Glory Be', decade: d, mysteryIndex: d - 1 });
    s.push({ kind: 'prayer', prayerId: 'fatima-prayer', label: 'O my Jesus (Fatima Prayer)', decade: d, mysteryIndex: d - 1 });
  }
  s.push({ kind: 'prayer', prayerId: 'hail-holy-queen', label: 'Hail, Holy Queen' });
  s.push({ kind: 'prayer', prayerId: 'rosary-closing', label: 'Closing Prayer' });
  s.push({ kind: 'prayer', prayerId: 'sign-of-the-cross', label: 'Sign of the Cross' });
  return s;
}

export const ROSARY_CLOSING = {
  id: 'rosary-closing',
  title: 'Closing Prayer',
  text:
    'Let us pray. O God, whose only begotten Son, by his life, death, and resurrection, has purchased for us the rewards of eternal life, grant, we beseech thee, that meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.',
};
