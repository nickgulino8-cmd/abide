// Catholic prayer library. Traditional prayers are given in their complete, common English forms.

export type PrayerCategory = 'traditional' | 'morning' | 'evening' | 'difficult' | 'marian' | 'saints';

export interface Prayer {
  id: string;
  title: string;
  category: PrayerCategory;
  subtitle?: string;
  text: string; // paragraphs separated by blank lines
  note?: string;
  latinTitle?: string;
  ref?: string; // optional related Scripture (resolved from Douay-Rheims)
  tags?: string[];
}

export const PRAYER_CATEGORIES: { id: PrayerCategory; label: string; description: string }[] = [
  { id: 'morning', label: 'Morning', description: 'Begin the day with God' },
  { id: 'evening', label: 'Evening', description: 'Rest, examine, give thanks' },
  { id: 'difficult', label: 'For difficult moments', description: 'Strength when you need it' },
  { id: 'traditional', label: 'Traditional prayers', description: 'The prayers of the Church' },
  { id: 'marian', label: 'Marian prayers', description: 'With the Mother of God' },
  { id: 'saints', label: 'Saints & angels', description: 'Ask for their intercession' },
];

export const PRAYERS: Prayer[] = [
  // ───────────────────────── Traditional ─────────────────────────
  {
    id: 'sign-of-the-cross',
    title: 'Sign of the Cross',
    category: 'traditional',
    text: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
  },
  {
    id: 'our-father',
    title: 'Our Father',
    latinTitle: 'Pater Noster',
    category: 'traditional',
    ref: 'Matthew 6:9-13',
    text:
      'Our Father, who art in heaven, hallowed be thy name; thy kingdom come, thy will be done on earth as it is in heaven.\n\nGive us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
    note: 'The prayer Jesus himself taught his disciples.',
  },
  {
    id: 'hail-mary',
    title: 'Hail Mary',
    latinTitle: 'Ave Maria',
    category: 'traditional',
    ref: 'Luke 1:28',
    text:
      'Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus.\n\nHoly Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
    note: 'The first part joins the greetings of the angel Gabriel and of Elizabeth (Luke 1:28, 42).',
  },
  {
    id: 'glory-be',
    title: 'Glory Be',
    latinTitle: 'Gloria Patri',
    category: 'traditional',
    text:
      'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.',
  },
  {
    id: 'apostles-creed',
    title: "Apostles' Creed",
    latinTitle: 'Symbolum Apostolorum',
    category: 'traditional',
    text:
      'I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead.\n\nI believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.',
    note: 'An ancient baptismal creed of the Church of Rome.',
  },
  {
    id: 'nicene-creed',
    title: 'Nicene Creed',
    latinTitle: 'Symbolum Nicaenum',
    category: 'traditional',
    text:
      'I believe in one God, the Father almighty, maker of heaven and earth, of all things visible and invisible.\n\nI believe in one Lord Jesus Christ, the Only Begotten Son of God, born of the Father before all ages. God from God, Light from Light, true God from true God, begotten, not made, consubstantial with the Father; through him all things were made. For us men and for our salvation he came down from heaven, and by the Holy Spirit was incarnate of the Virgin Mary, and became man. For our sake he was crucified under Pontius Pilate, he suffered death and was buried, and rose again on the third day in accordance with the Scriptures. He ascended into heaven and is seated at the right hand of the Father. He will come again in glory to judge the living and the dead and his kingdom will have no end.\n\nI believe in the Holy Spirit, the Lord, the giver of life, who proceeds from the Father and the Son, who with the Father and the Son is adored and glorified, who has spoken through the prophets.\n\nI believe in one, holy, catholic and apostolic Church. I confess one Baptism for the forgiveness of sins and I look forward to the resurrection of the dead and the life of the world to come. Amen.',
    note:
      'Professed at Sunday Mass. Formulated at the Councils of Nicaea (325) and Constantinople (381). English translation of the Roman Missal © 2010 International Commission on English in the Liturgy (ICEL).',
  },
  {
    id: 'act-of-contrition',
    title: 'Act of Contrition',
    category: 'traditional',
    text:
      'O my God, I am heartily sorry for having offended thee, and I detest all my sins because of thy just punishments, but most of all because they offend thee, my God, who art all good and deserving of all my love.\n\nI firmly resolve, with the help of thy grace, to sin no more and to avoid the near occasions of sin. Amen.',
    note: 'Traditionally prayed in confession and before sleep.',
  },
  {
    id: 'st-michael',
    title: 'Prayer to Saint Michael',
    category: 'saints',
    text:
      'Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.',
    note: 'Composed by Pope Leo XIII in 1886.',
    tags: ['temptation', 'strength'],
  },
  {
    id: 'guardian-angel',
    title: 'Guardian Angel Prayer',
    latinTitle: 'Angele Dei',
    category: 'saints',
    text: 'Angel of God, my guardian dear, to whom God\'s love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.',
  },
  {
    id: 'memorare',
    title: 'The Memorare',
    category: 'marian',
    text:
      'Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided.\n\nInspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother. To thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.',
    note: 'Attributed to the tradition of Saint Bernard of Clairvaux.',
    tags: ['hope', 'trust'],
  },
  {
    id: 'come-holy-spirit',
    title: 'Come, Holy Spirit',
    latinTitle: 'Veni, Sancte Spiritus',
    category: 'traditional',
    text:
      'Come, Holy Spirit, fill the hearts of thy faithful and kindle in them the fire of thy love.\n\nV. Send forth thy Spirit, and they shall be created.\nR. And thou shalt renew the face of the earth.\n\nLet us pray. O God, who by the light of the Holy Spirit didst instruct the hearts of the faithful, grant that by the same Holy Spirit we may be truly wise and ever enjoy his consolations. Through Christ our Lord. Amen.',
  },
  {
    id: 'hail-holy-queen',
    title: 'Hail, Holy Queen',
    latinTitle: 'Salve Regina',
    category: 'marian',
    text:
      'Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears.\n\nTurn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ. Amen.',
  },
  {
    id: 'fatima-prayer',
    title: 'Fatima Prayer',
    category: 'marian',
    text:
      'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those in most need of thy mercy. Amen.',
    note: 'Often prayed after the Glory Be in each decade of the Rosary.',
  },
  {
    id: 'angelus',
    title: 'The Angelus',
    category: 'marian',
    text:
      'V. The Angel of the Lord declared unto Mary,\nR. And she conceived of the Holy Spirit.\nHail Mary…\n\nV. Behold the handmaid of the Lord.\nR. Be it done unto me according to thy word.\nHail Mary…\n\nV. And the Word was made flesh,\nR. And dwelt among us.\nHail Mary…\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.\n\nLet us pray. Pour forth, we beseech thee, O Lord, thy grace into our hearts, that we, to whom the Incarnation of Christ thy Son was made known by the message of an angel, may by his Passion and Cross be brought to the glory of his Resurrection. Through the same Christ our Lord. Amen.',
    note: 'Traditionally prayed at 6 a.m., noon, and 6 p.m.',
  },
  {
    id: 'anima-christi',
    title: 'Anima Christi',
    latinTitle: 'Soul of Christ',
    category: 'traditional',
    text:
      'Soul of Christ, sanctify me. Body of Christ, save me. Blood of Christ, inebriate me. Water from the side of Christ, wash me. Passion of Christ, strengthen me.\n\nO good Jesus, hear me. Within thy wounds hide me. Suffer me not to be separated from thee. From the malicious enemy defend me. In the hour of my death call me, and bid me come unto thee, that with thy saints I may praise thee for ever and ever. Amen.',
    note: 'A medieval prayer beloved by Saint Ignatius of Loyola, often prayed after Holy Communion.',
  },
  {
    id: 'jesus-prayer',
    title: 'The Jesus Prayer',
    category: 'traditional',
    ref: 'Luke 18:13',
    text: 'Lord Jesus Christ, Son of God, have mercy on me, a sinner.',
    note: 'An ancient prayer rooted in the publican\'s prayer (Luke 18:13). Repeat it slowly with your breathing.',
    tags: ['temptation', 'anxiety'],
  },
  {
    id: 'prayer-of-st-francis',
    title: 'Peace Prayer',
    subtitle: 'Traditionally associated with Saint Francis',
    category: 'saints',
    text:
      'Lord, make me an instrument of your peace: where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; where there is sadness, joy.\n\nO divine Master, grant that I may not so much seek to be consoled as to console, to be understood as to understand, to be loved as to love. For it is in giving that we receive, it is in pardoning that we are pardoned, and it is in dying that we are born to eternal life. Amen.',
    note: 'This prayer first appeared in 1912 and is not from Saint Francis\'s own writings, but it beautifully expresses his spirit.',
  },
  {
    id: 'suscipe',
    title: 'Suscipe',
    subtitle: 'Saint Ignatius of Loyola',
    category: 'saints',
    text:
      'Take, Lord, and receive all my liberty, my memory, my understanding, and my entire will, all that I have and possess. Thou hast given all to me. To thee, O Lord, I return it. All is thine; dispose of it wholly according to thy will. Give me only thy love and thy grace, for this is sufficient for me. Amen.',
    note: 'From the Spiritual Exercises of Saint Ignatius.',
    tags: ['trust', 'surrender'],
  },
  {
    id: 'act-of-faith',
    title: 'Act of Faith',
    category: 'traditional',
    text:
      'O my God, I firmly believe that thou art one God in three divine Persons, Father, Son, and Holy Spirit. I believe that thy divine Son became man and died for our sins, and that he will come to judge the living and the dead. I believe these and all the truths which the holy Catholic Church teaches, because thou hast revealed them, who canst neither deceive nor be deceived. Amen.',
  },
  {
    id: 'act-of-hope',
    title: 'Act of Hope',
    category: 'traditional',
    text:
      'O my God, relying on thy infinite goodness and promises, I hope to obtain pardon of my sins, the help of thy grace, and life everlasting, through the merits of Jesus Christ, my Lord and Redeemer. Amen.',
    tags: ['hope'],
  },
  {
    id: 'act-of-love',
    title: 'Act of Love',
    category: 'traditional',
    text:
      'O my God, I love thee above all things, with my whole heart and soul, because thou art all good and worthy of all love. I love my neighbour as myself for the love of thee. I forgive all who have injured me, and I ask pardon of all whom I have injured. Amen.',
  },
  {
    id: 'grace-before-meals',
    title: 'Grace Before Meals',
    category: 'traditional',
    text: 'Bless us, O Lord, and these thy gifts, which we are about to receive from thy bounty, through Christ our Lord. Amen.',
  },
  {
    id: 'eternal-rest',
    title: 'Eternal Rest',
    category: 'traditional',
    text:
      'Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. May they rest in peace. And may the souls of all the faithful departed, through the mercy of God, rest in peace. Amen.',
  },
  {
    id: 'st-joseph',
    title: 'Prayer to Saint Joseph',
    category: 'saints',
    text:
      'O Saint Joseph, guardian of Jesus and chaste spouse of Mary, you spent your life in the faithful fulfilment of duty and supported the Holy Family by the work of your hands. Protect me, who turn to you with confidence. You know my hopes, my struggles, and my needs. Help me to be faithful in small things, pure in heart, and steady in trial, and obtain for me the grace of a holy life and a peaceful death in the arms of Jesus and Mary. Amen.',
    tags: ['purity', 'strength'],
  },

  // ───────────────────────── Morning ─────────────────────────
  {
    id: 'morning-offering',
    title: 'Morning Offering',
    category: 'morning',
    text:
      'O Jesus, through the Immaculate Heart of Mary, I offer you my prayers, works, joys, and sufferings of this day, for all the intentions of your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, the reunion of all Christians, and in particular for the intentions of the Holy Father this month. Amen.',
    note: 'A traditional offering associated with the Apostleship of Prayer.',
  },
  {
    id: 'morning-prayer-abide',
    title: 'A Morning Prayer to Abide',
    category: 'morning',
    subtitle: 'Thanksgiving · Guidance · Intention · Strength',
    text:
      'Lord God, thank you for this new day and for the breath in my lungs. Your mercies are new this morning, and I receive them with gratitude.\n\nI give you this day before it begins. Guide my steps, my words, and my thoughts. Where I do not know what to do, give me wisdom. Where I am tempted to go my own way, gently turn me back to you.\n\nToday I want to [set your intention]. Help me to keep this intention with a steady heart.\n\nGive me strength and discipline for the moments I find hardest. When I am weak, let me remember that your grace is sufficient. When I succeed, let me thank you. When I stumble, let me return to you quickly, without fear.\n\nJesus, I abide in you; abide in me. Holy Spirit, fill me. Mother Mary, pray for me. Amen.',
  },

  // ───────────────────────── Evening ─────────────────────────
  {
    id: 'evening-prayer-abide',
    title: 'An Evening Prayer',
    category: 'evening',
    subtitle: 'Reflection · Gratitude · Forgiveness · Intercession',
    text:
      'Lord, the day is ending, and I come to rest in you.\n\nThank you for the gifts of this day — for the people I met, the work I did, the beauty I saw, and the grace that carried me, even when I did not notice it.\n\nShow me where I walked with you today, and where I wandered. I am sorry for the ways I failed to love you and others. I ask your forgiveness, and I trust your mercy. Heal what I have wounded, and help me to begin again tomorrow.\n\nI pray for those I love, for those I find difficult, for those who are suffering tonight, and for those who have no one to pray for them.\n\nInto your hands I commend my spirit. Guard me as I sleep, and wake me ready to serve you. Amen.',
  },
  {
    id: 'examen',
    title: 'Examination of Conscience',
    subtitle: 'A gentle nightly examen, after Saint Ignatius',
    category: 'evening',
    text:
      '1. Presence. Become still. Remember that God is with you and looks at you with love. Ask the Holy Spirit for light to see your day truthfully.\n\n2. Gratitude. Recall three gifts from today, large or small. Thank God for each.\n\n3. Review. Walk through your day hour by hour. Where did you feel close to God? Where did you feel far? When did you love well? When did you fall short?\n\n4. Questions for the heart. Did I pray today? Did I treat others with patience and kindness? Was I honest? Did I guard my heart and my eyes? Did I use my time well? Did I care for my body and my responsibilities? Is there anyone I need to forgive, or ask forgiveness from?\n\n5. Sorrow and mercy. Tell God simply what you regret. Pray the Act of Contrition. Receive his mercy — he is not tired of forgiving you.\n\n6. Tomorrow. Ask for one specific grace for tomorrow. Make one small, concrete resolution.\n\nClose with an Our Father.',
    note: 'If you are conscious of serious sin, the Church invites you to the Sacrament of Confession.',
  },
  {
    id: 'compline-prayer',
    title: 'Night Prayer of Protection',
    category: 'evening',
    text:
      'Visit, we beseech thee, O Lord, this dwelling, and drive far from it all snares of the enemy. Let thy holy angels dwell herein to preserve us in peace, and let thy blessing be upon us always. Through Christ our Lord. Amen.',
    note: 'A traditional prayer from the Church\'s Night Prayer (Compline).',
  },

  // ───────────────────────── Difficult moments ─────────────────────────
  {
    id: 'difficult-strength',
    title: 'For Strength',
    category: 'difficult',
    ref: 'Isaiah 40:29-31',
    tags: ['strength'],
    text:
      'Lord, I feel weak right now. I do not have the strength I need, but you do.\n\nYou give power to the faint and strength to the weary. Renew my strength as you promised. Let me rise, even slowly. Let me walk, even if I cannot run.\n\nI do not need to win the whole battle tonight. Give me strength for this moment, and the next. Amen.',
  },
  {
    id: 'difficult-self-control',
    title: 'For Self-Control',
    category: 'difficult',
    ref: 'Galatians 5:22-23',
    tags: ['self-control'],
    text:
      'Holy Spirit, you are the source of self-mastery. Right now my desires feel louder than my will.\n\nCalm the rush within me. Help me pause, breathe, and choose what is truly good. Remind me of who I am and who I want to become.\n\nI give you this moment. Grow in me the fruit of patience, continency, and peace. Amen.',
  },
  {
    id: 'difficult-temptation',
    title: 'In Temptation',
    category: 'difficult',
    ref: '1 Corinthians 10:13',
    tags: ['temptation'],
    text:
      'Jesus, I am being tempted. You were tempted too, and you understand.\n\nYou promised that you would not let me be tested beyond my strength, and that you would provide a way out. Show me the way out now, and give me the courage to take it.\n\nI choose you. I choose freedom. Saint Michael, defend me. Mary, my mother, hold me close. Jesus, I trust in you.\n\n(Now stand up, change your surroundings, and do one good thing.)',
  },
  {
    id: 'difficult-after-setback',
    title: 'After a Setback',
    category: 'difficult',
    ref: 'Luke 15:20',
    tags: ['mercy', 'forgiveness'],
    text:
      'Father, I fell again. I am disappointed in myself, but I will not hide from you.\n\nYou are the father who runs toward the son who returns. You do not wait for a perfect speech. So I come as I am.\n\nForgive me. Wash me. Help me learn from what happened without drowning in shame. I am still your child, and you still love me.\n\nToday is not the end of my story. Give me the grace to begin again — now. Amen.',
  },
  {
    id: 'difficult-forgiveness',
    title: 'For Forgiveness',
    category: 'difficult',
    ref: 'Colossians 3:13',
    tags: ['forgiveness'],
    text:
      'Lord, you have forgiven me more than I can count. Now I need help forgiving.\n\nI bring you the person who hurt me. I do not feel ready, but I choose to release my claim to revenge and place them in your hands. Heal my wound. Bless them in the way they most need.\n\nAnd where I need to forgive myself, help me to see myself as you see me — with mercy. Amen.',
  },
  {
    id: 'difficult-anxiety',
    title: 'In Anxiety',
    category: 'difficult',
    ref: 'Philippians 4:6-7',
    tags: ['anxiety'],
    text:
      'Lord, my mind is racing and my heart is heavy. I give you what I am worried about: [name it].\n\nYou know what I need before I ask. You care for the birds of the air and the lilies of the field. You care for me.\n\nGive me your peace that surpasses understanding. Help me breathe slowly. Help me do only the next right thing.\n\nJesus, I trust in you. Jesus, I trust in you. Jesus, I trust in you. Amen.',
  },
  {
    id: 'difficult-patience',
    title: 'For Patience',
    category: 'difficult',
    ref: 'James 1:3-4',
    tags: ['patience'],
    text:
      'Lord, I am frustrated, and I want things to change faster — in others, in my circumstances, and in myself.\n\nYou are patient with me every day. Teach me to be patient too. Slow my reactions. Soften my words. Help me see the people around me with your eyes.\n\nLet patience have its perfect work in me, so that I may become whole. Amen.',
  },
  {
    id: 'difficult-purity',
    title: 'For Purity of Heart',
    category: 'difficult',
    ref: 'Psalms 50:12',
    tags: ['purity'],
    text:
      'Create a clean heart in me, O God, and renew a right spirit within me.\n\nGuard my eyes, my thoughts, and my desires. Help me to see every person as a beloved child of God, never as an object. Where my heart has been wounded or divided, heal and unite it.\n\nMary, most pure, Saint Joseph, chaste guardian, pray for me. Amen.',
  },
  {
    id: 'difficult-hope',
    title: 'For Hope',
    category: 'difficult',
    ref: 'Romans 15:13',
    tags: ['hope'],
    text:
      'God of hope, I feel discouraged. It is hard to imagine things getting better.\n\nYet you raised Jesus from the dead. Nothing is impossible for you. Fill me with joy and peace in believing, so that I may abound in hope by the power of the Holy Spirit.\n\nLet me take one step today as someone who hopes. Amen.',
  },
  {
    id: 'difficult-trust',
    title: 'For Trust in God',
    category: 'difficult',
    ref: 'Proverbs 3:5-6',
    tags: ['trust'],
    text:
      'Lord, I cannot see the way ahead, and I am tempted to control everything myself.\n\nI choose to trust you with all my heart and not lean on my own understanding. I place in your hands my future, my struggles, and the people I love.\n\nYou are good. You are faithful. You have not abandoned me. Jesus, I trust in you. Amen.',
  },
  {
    id: 'difficult-loneliness',
    title: 'In Loneliness',
    category: 'difficult',
    ref: 'Psalms 26:10',
    tags: ['loneliness'],
    text:
      'Lord, I feel alone tonight. Sometimes loneliness pulls me toward old habits that never truly satisfy.\n\nYou are near. You see me. You promised never to leave me or forsake me. Be my companion now.\n\nLead me to people who can walk with me, and help me reach out to one of them. Until then, let me rest in your presence. Amen.',
  },
];

export function prayerById(id: string) {
  return PRAYERS.find((p) => p.id === id);
}
