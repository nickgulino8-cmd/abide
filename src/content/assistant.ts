// The curated knowledge base behind "Abide Companion".
// Answers are written to be faithful to Catholic teaching, and each is labelled:
//   teaching  — what the Church officially teaches (with Catechism references)
//   pastoral  — pastoral guidance drawn from the Church's spiritual tradition
//   practical — practical, common-sense help
//   opinion   — theological reflection where faithful Catholics may differ
// A paragraph that is exactly {{Reference}} renders a verified Douay-Rheims passage.

export type AnswerKind = 'teaching' | 'pastoral' | 'practical' | 'opinion';

export interface KBEntry {
  id: string;
  title: string;
  keywords: string[];
  kind: AnswerKind;
  answer: string;
  sources?: string[];
  links?: { label: string; to: string }[];
  followUps?: string[];
}

export const KIND_LABEL: Record<AnswerKind, string> = {
  teaching: 'Church teaching',
  pastoral: 'Pastoral guidance',
  practical: 'Practical help',
  opinion: 'Theological reflection',
};

export const SUGGESTED_QUESTIONS = [
  'What does the Bible say about self-control?',
  'How do I develop a stronger relationship with Jesus?',
  'What is the meaning of the Beatitudes?',
  "How do I pray when I don't know what to say?",
  'How does confession work?',
  'What can I learn from Saint Augustine?',
  'How do I start again after a setback?',
  'Help me build a daily spiritual routine',
];

export const KB: KBEntry[] = [
  {
    id: 'self-control',
    title: 'What the Bible says about self-control',
    keywords: ['self-control', 'self control', 'discipline', 'temperance', 'willpower', 'control myself', 'continency', 'urges', 'impulse'],
    kind: 'pastoral',
    answer: `Scripture treats self-control not as grim self-suppression but as freedom — the ability to choose the good instead of being ruled by every impulse. It is listed among the fruit of the Holy Spirit, which means it is something God grows in us as we stay close to him.

{{Galatians 5:22-23}}

Proverbs praises the person who masters their own spirit as greater than a conqueror of cities:

{{Proverbs 16:32}}

St. Paul compares the Christian life to an athlete's training, refusing lesser things for the sake of a greater prize:

{{1 Corinthians 9:24-27}}

In Catholic teaching, the related virtue is temperance, which "moderates the attraction of pleasures and provides balance in the use of created goods" (CCC 1809). Like any virtue, it grows through repeated small choices — and through grace.

A few practical steps: pray for self-control specifically each morning; notice the times and situations when you are most vulnerable; plan your "way of escape" ahead of time; and when you fail, return quickly to God rather than giving up.`,
    sources: ['CCC 1809', 'CCC 1832'],
    links: [
      { label: 'Temperance — Seven Virtues', to: '/faith/learn/virtues/virtue-temperance' },
      { label: 'Prayer for self-control', to: '/faith/prayers/difficult-self-control' },
    ],
    followUps: ['How do I break a compulsive habit?', 'Is being tempted a sin?'],
  },
  {
    id: 'relationship-jesus',
    title: 'Growing closer to Jesus',
    keywords: ['relationship with jesus', 'closer to jesus', 'closer to god', 'know jesus', 'love jesus', 'friendship with god', 'grow in faith', 'stronger relationship', 'spiritual life'],
    kind: 'pastoral',
    answer: `A relationship with Jesus grows the way any friendship grows: by spending time together, listening, speaking honestly, and staying faithful through ordinary days. Jesus himself describes it as abiding:

{{John 15:4}}

The Church's tradition offers a few reliable paths:

• Daily prayer — even ten minutes, at a consistent time. Speak to him honestly, then sit in silence and listen.
• Scripture — especially the Gospels. St. Jerome wrote that "ignorance of Scripture is ignorance of Christ." Read slowly and ask, "What is Jesus showing me about himself?"
• The sacraments — above all the Eucharist, where Catholics believe Jesus is truly present, and Confession, where his mercy is spoken aloud.
• Love of neighbour — Jesus said that what we do for the least, we do for him (Matthew 25:40).
• Community — friends, a parish, or a small group who share the journey.

Remember that it is a relationship, not a performance. Jesus already loves you; you are learning to receive that love and return it.`,
    sources: ['CCC 2558', 'CCC 2560', 'Dei Verbum 25'],
    links: [
      { label: 'Begin today’s devotional', to: '/devotional' },
      { label: 'Read the Gospel of Mark', to: '/faith/bible/mark/1' },
    ],
    followUps: ['How should I read the Bible?', "How do I pray when I don't know what to say?"],
  },
  {
    id: 'beatitudes',
    title: 'The meaning of the Beatitudes',
    keywords: ['beatitudes', 'beatitude', 'blessed are', 'sermon on the mount', 'poor in spirit', 'meek', 'clean of heart', 'peacemakers'],
    kind: 'teaching',
    answer: `The Beatitudes open Jesus' Sermon on the Mount (Matthew 5). "Beatitude" means blessedness or deep happiness. They describe the kind of person who lives in God's Kingdom — and they are, above all, a portrait of Jesus himself.

The Catechism teaches: "The Beatitudes depict the countenance of Jesus Christ and portray his charity. They express the vocation of the faithful" (CCC 1717). They also "respond to the natural desire for happiness" which God placed in every heart (CCC 1718).

{{Matthew 5:3-10}}

They turn the world's values upside down: blessed are the poor in spirit, the meek, those who mourn, the merciful, the clean of heart. True happiness is found not in power or pleasure, but in humility, mercy, and an undivided heart.

The Abide learning library walks through each Beatitude with its meaning and a practical way to live it.`,
    sources: ['CCC 1716–1729'],
    links: [{ label: 'Explore the Beatitudes', to: '/faith/learn/beatitudes' }],
  },
  {
    id: 'pray-no-words',
    title: 'Praying when you don’t know what to say',
    keywords: ["don't know what to say", 'dont know what to say', 'how to pray', 'how do i pray', 'learn to pray', 'pray better', 'prayer is hard', 'words to pray', 'start praying'],
    kind: 'pastoral',
    answer: `You are in good company. Even the apostles asked, "Lord, teach us to pray." And St. Paul wrote that "we know not what we should pray for as we ought; but the Spirit himself asketh for us" (Romans 8:26).

A few simple ways to begin:

• Just be honest. Tell God exactly how you feel, even if it is "I don't know what to say." That is already a prayer.
• Use the words Jesus gave us: pray the Our Father very slowly, one phrase at a time.
• Pray a short phrase with your breathing, like the Jesus Prayer: "Lord Jesus Christ, Son of God, have mercy on me, a sinner."
• Pray with Scripture: read a psalm and make its words your own.
• Simply sit in silence before God. St. John Vianney told of a man who sat before the tabernacle for hours; asked what he said, he answered: "I look at him and he looks at me."

{{Matthew 6:6}}

The Catechism calls prayer "the raising of one's mind and heart to God" (CCC 2559). It does not need to be eloquent. It needs to be real.`,
    sources: ['CCC 2559', 'CCC 2715'],
    links: [
      { label: 'The Jesus Prayer', to: '/faith/prayers/jesus-prayer' },
      { label: 'Our Father', to: '/faith/prayers/our-father' },
    ],
    followUps: ["Why can't I feel God when I pray?", 'Help me build a daily spiritual routine'],
  },
  {
    id: 'confession',
    title: 'How confession works',
    keywords: ['confession', 'confess', 'reconciliation', 'penance', 'go to confession', 'priest forgive', 'absolution', 'examination of conscience'],
    kind: 'teaching',
    answer: `Confession — the Sacrament of Penance and Reconciliation — is where Christ forgives the sins we have committed after baptism, through the ministry of a priest. Jesus gave this power to the apostles on Easter evening:

{{John 20:22-23}}

What happens:
1. Prepare with an examination of conscience (Abide has one in the evening prayers).
2. Go to the confessional. You may usually kneel behind a screen or sit face-to-face.
3. Begin: "Bless me, Father, for I have sinned. It has been [time] since my last confession."
4. Confess your sins simply and honestly. Serious (mortal) sins should be named by kind and approximate number; you don't need to give unnecessary detail.
5. Listen to the priest's counsel and receive a penance.
6. Pray an Act of Contrition.
7. The priest gives absolution: your sins are forgiven.

The priest is bound by the absolute seal of confession: he can never reveal what you say (CCC 1467). Priests hear many confessions; nothing you say will shock them. If you are nervous or have been away a long time, simply tell the priest — he will gladly guide you.

For specific questions about your situation, speak with a priest directly.`,
    sources: ['CCC 1422–1498', 'CCC 1456', 'CCC 1467'],
    links: [
      { label: 'Step-by-step guide', to: '/faith/learn/traditions/tradition-confession' },
      { label: 'Examination of conscience', to: '/faith/prayers/examen' },
      { label: 'Act of Contrition', to: '/faith/prayers/act-of-contrition' },
    ],
    followUps: ['What is the difference between mortal and venial sin?'],
  },
  {
    id: 'augustine',
    title: 'Learning from Saint Augustine',
    keywords: ['augustine', 'saint augustine', 'st augustine', 'confessions', 'monica', 'restless heart'],
    kind: 'pastoral',
    answer: `St. Augustine (354–430) is one of the most relatable saints for anyone struggling to change. For years he was brilliant, ambitious, and enslaved to habits he knew were not good for him — especially lust. He honestly recorded praying, "Grant me chastity and continence, but not yet."

What we can learn from him:

• Restlessness is a signpost. "You have made us for yourself, O Lord, and our heart is restless until it rests in you" (Confessions, Book I). Cravings often point to a deeper longing for God.
• Habit is powerful, but grace is stronger. Augustine described his will as divided, chained by habit — and then freed by God's grace in a moment of surrender.
• Persevering prayer matters. His mother, St. Monica, prayed for him with tears for seventeen years.
• Scripture can change a life. In the garden in Milan, he heard "Take up and read," opened St. Paul's letter, and read:

{{Romans 13:13-14}}

• Honesty is the beginning of healing. His Confessions is a long, honest prayer to God about his failures and God's mercy.

Augustine shows that a long struggle does not disqualify anyone from holiness. He became a bishop, a Doctor of the Church, and a saint.`,
    links: [
      { label: 'Read his full profile', to: '/faith/saints/augustine' },
      { label: 'Saint Monica', to: '/faith/saints/monica' },
    ],
  },
  {
    id: 'setback',
    title: 'Starting again after a setback',
    keywords: ['setback', 'relapse', 'relapsed', 'fell again', 'failed again', 'start again', 'begin again', 'slipped', 'messed up', 'broke my streak', 'lost my streak'],
    kind: 'pastoral',
    answer: `First: a setback does not cancel your progress, and it does not change God's love for you. The saints fell too. What matters most is what you do next.

{{Proverbs 24:16}}

A few steps that help many people:

1. Turn back to God immediately. Don't wait until you "feel worthy." Pray simply: "Lord, I'm sorry. Help me begin again." The prodigal son's father ran to him while he was still far off.
2. Avoid the shame spiral. Guilt says "I did something wrong"; shame says "I am worthless." The first can lead to growth; the second usually leads back to the habit. You are a beloved child of God who fell — not a failure.
3. Go to confession if the setback involved serious sin. It is a place of healing, not humiliation.
4. Learn without obsessing. Ask gently: Was I hungry, angry, lonely, or tired? What time of day was it? What led up to it? Then make one concrete change.
5. Strengthen your plan. Who can you call when tempted? What can you remove from your environment? What will you do instead?
6. Recommit for today only. Not forever — just today.

If you find you keep falling despite your best efforts, that is not a moral verdict on you. Consider talking with a priest, a spiritual director, a trusted friend, or a licensed counsellor. Seeking help is a sign of strength.`,
    links: [
      { label: 'Prayer after a setback', to: '/faith/prayers/difficult-after-setback' },
      { label: 'How confession works', to: '/faith/learn/traditions/tradition-confession' },
    ],
    followUps: ['How do I break a compulsive habit?', 'How do I forgive myself?'],
  },
  {
    id: 'habits',
    title: 'Breaking a compulsive habit',
    keywords: ['habit', 'habits', 'compulsive', 'compulsion', 'addiction', 'addicted', 'quit', 'stop doing', 'break a habit', 'overcome', 'struggle with'],
    kind: 'practical',
    answer: `Breaking a deep habit usually takes both grace and practical wisdom. The Church's tradition and good psychology agree on much of this.

Spiritual foundations
• Ask God daily for the specific grace you need, and receive the sacraments regularly — especially Confession and the Eucharist.
• Remember your identity: you are a beloved child of God, not your habit.

{{1 Corinthians 10:13}}

Practical steps
• Know your triggers. Many people notice the HALT pattern: Hungry, Angry, Lonely, Tired. Boredom, stress and late nights are common too.
• Change your environment. Make the habit harder and the good easier — move devices out of the bedroom, use filters or blockers, avoid certain places at vulnerable times.
• Plan your "way of escape" in advance: a prayer, a walk, a cold glass of water, a call to a friend, leaving the room.
• Replace, don't just remove. Fill the space with something good: exercise, a hobby, friendship, service.
• Find accountability. A trusted friend, mentor, or group makes a real difference. You don't have to share details to ask someone to check in on you.
• Track honestly and gently — which is what Abide's daily check-in is for.

When to seek more help
If the habit is harming your health, relationships, work, or sense of self, or you cannot stop despite sincere effort, please consider professional help — a licensed counsellor or therapist, a recovery group, or your doctor. This is fully compatible with faith, and many Catholic counsellors exist.`,
    links: [
      { label: 'Prayer in temptation', to: '/faith/prayers/difficult-temptation' },
      { label: 'Venerable Matt Talbot', to: '/faith/saints/matt-talbot' },
    ],
    followUps: ['How do I start again after a setback?', 'Is being tempted a sin?'],
  },
  {
    id: 'temptation-not-sin',
    title: 'Is being tempted a sin?',
    keywords: ['tempted a sin', 'temptation sin', 'is temptation', 'tempted', 'temptation', 'bad thoughts', 'intrusive thoughts', 'impure thoughts'],
    kind: 'teaching',
    answer: `No. Being tempted is not a sin. Jesus himself was tempted, yet was without sin:

{{Hebrews 4:15}}

The Church distinguishes between being tempted and consenting to temptation. The Catechism explains that we ask in the Our Father not to "enter into" temptation, and that there is a difference "between being tempted and consenting to temptation" (CCC 2846–2847).

A thought or feeling that arises unbidden is not a sin. Sin involves the will — freely choosing what we know to be wrong. Resisting a temptation, even imperfectly, is actually an act of love for God.

Practical wisdom from the saints: don't argue with a temptation or panic about it. Calmly turn your attention elsewhere, say a short prayer (like "Jesus, I trust in you"), and do something good.

If you find yourself constantly anxious that you are sinning in your thoughts, you may be experiencing scrupulosity. Please speak with a priest — this is common and treatable.`,
    sources: ['CCC 2846–2849', 'CCC 1849'],
    links: [{ label: 'Prayer in temptation', to: '/faith/prayers/difficult-temptation' }],
    followUps: ['What is the difference between mortal and venial sin?'],
  },
  {
    id: 'mortal-venial',
    title: 'Mortal and venial sin',
    keywords: ['mortal sin', 'venial sin', 'mortal', 'venial', 'serious sin', 'grave matter', 'kinds of sin'],
    kind: 'teaching',
    answer: `The Church distinguishes sins by their gravity (CCC 1854).

Mortal sin destroys charity in the heart and turns us away from God. For a sin to be mortal, three conditions must all be present (CCC 1857):
1. Grave matter,
2. Full knowledge that it is seriously wrong, and
3. Deliberate consent — a free choice.

Factors like ignorance, strong habit, fear, or psychological pressure can reduce responsibility (CCC 1735, 1860). This is not an excuse to stop trying, but it should guard you against despair.

Venial sin weakens charity but does not destroy it (CCC 1855, 1862). It is still worth confessing and resisting, since small habits shape us.

Mortal sins should be confessed in the Sacrament of Penance before receiving Holy Communion (CCC 1385). Venial sins are forgiven in many ways — including sincere sorrow, prayer, the Eucharist, and acts of charity — and confessing them is strongly encouraged (CCC 1458).

Because individual situations vary, a priest is the right person to help you discern your own culpability.`,
    sources: ['CCC 1854–1864', 'CCC 1735'],
    links: [{ label: 'How confession works', to: '/faith/learn/traditions/tradition-confession' }],
  },
  {
    id: 'abandoned',
    title: 'Has God abandoned me?',
    keywords: ['abandoned', 'god hates me', 'god left me', 'still love me', 'god love me', 'unworthy', 'too far gone', 'can god forgive', 'forgive me', 'unforgivable', 'worthless'],
    kind: 'pastoral',
    answer: `No. God has not abandoned you — and he will not.

{{Romans 8:38-39}}

Feelings of distance from God are real and painful, but feelings are not the final truth. The Church teaches that there is no sin so great that God's mercy cannot reach it, as long as we turn to him (CCC 982). Jesus' parables of the lost sheep and the prodigal son show a God who goes searching for us and runs to meet us.

{{Isaiah 49:15}}

If you feel unworthy, you are in exactly the right place to receive mercy — mercy is only for the unworthy. Talk to God honestly about how you feel. If you can, go to confession and hear the words of absolution spoken over you.

And please don't carry this alone. A priest, a trusted friend, or a counsellor can help you hold onto hope when it's hard to feel it.`,
    sources: ['CCC 982', 'CCC 1846–1848'],
    links: [
      { label: 'Prayer for hope', to: '/faith/prayers/difficult-hope' },
      { label: 'The Prodigal Son', to: '/devotional?id=prodigal-son' },
    ],
  },
  {
    id: 'shame',
    title: 'Guilt, shame and God’s mercy',
    keywords: ['shame', 'ashamed', 'guilt', 'guilty', 'hate myself', 'disgusted with myself', 'embarrassed'],
    kind: 'pastoral',
    answer: `Healthy guilt and toxic shame are different. Guilt says, "I did something wrong" — it points to an action and invites repentance. Shame says, "I am bad" — it attacks your identity and usually pushes you to hide from God and others.

Adam and Eve hid after the first sin. God's response was to come looking for them: "Where art thou?" (Genesis 3:9). God seeks you, too.

{{Psalms 102:8-13}}

What helps:
• Name what happened honestly to God, then receive his forgiveness — in Confession if needed.
• Refuse the lie that you are worthless. You were made in God's image and redeemed at great price.
• Speak to someone safe. Shame grows in secrecy and shrinks when it is gently shared.
• Treat yourself the way a loving father treats his child.`,
    links: [{ label: 'After a setback', to: '/faith/prayers/difficult-after-setback' }],
    followUps: ['How do I forgive myself?'],
  },
  {
    id: 'forgive-self',
    title: 'Forgiving yourself',
    keywords: ['forgive myself', 'forgiving myself', 'self forgiveness', 'cant forgive myself', 'let go of the past'],
    kind: 'pastoral',
    answer: `Strictly speaking, Catholic theology speaks less about "forgiving ourselves" and more about receiving God's forgiveness. If God, who is perfectly just, has forgiven you, it is not humility to keep condemning yourself — it can quietly become a kind of pride that puts our judgment above his.

{{1 John 1:9}}

Some steps:
• If you have not yet, bring the sin to Confession and hear the words of absolution.
• Make amends where possible and appropriate.
• When the memory returns, pray: "Lord, you have forgiven this. I give it back to you."
• Use your experience to show mercy to others.

St. Francis de Sales is often quoted: "Have patience with all things, but chiefly have patience with yourself." Healing of memories can take time. A spiritual director or counsellor can help when guilt feels stuck.`,
    links: [{ label: 'Prayer for forgiveness', to: '/faith/prayers/difficult-forgiveness' }],
  },
  {
    id: 'forgive-others',
    title: 'Forgiving others',
    keywords: ['forgive someone', 'forgive others', 'forgiving others', 'forgive him', 'forgive her', 'forgive them', 'hurt me', 'resentment', 'grudge', 'forgiveness'],
    kind: 'pastoral',
    answer: `Jesus asks us to forgive generously — "till seventy times seven times" — and teaches us to pray "forgive us our trespasses, as we forgive those who trespass against us."

{{Colossians 3:13}}

What forgiveness is — and isn't:
• It is a decision to release the debt and the desire for revenge, entrusting justice to God.
• It is not pretending the harm didn't happen, excusing it, or necessarily restoring trust. You may still need boundaries, and in cases of abuse, safety comes first.
• It is often a process: you may need to choose it again each time the hurt resurfaces.

The Catechism notes that while we may not be able to stop feeling the hurt, "the heart that offers itself to the Holy Spirit turns injury into compassion" (CCC 2843).

Start small: pray for the person by name, asking God to bless them.`,
    sources: ['CCC 2838–2845'],
    links: [{ label: 'Prayer for forgiveness', to: '/faith/prayers/difficult-forgiveness' }],
  },
  {
    id: 'eucharist',
    title: 'The Eucharist and the Real Presence',
    keywords: ['eucharist', 'real presence', 'communion', 'holy communion', 'body and blood', 'transubstantiation', 'blessed sacrament', 'adoration'],
    kind: 'teaching',
    answer: `The Catholic Church teaches that in the Eucharist, Jesus Christ is truly, really, and substantially present — Body, Blood, Soul and Divinity — under the appearances of bread and wine (CCC 1374). The change of the bread and wine's substance is called transubstantiation (CCC 1376).

This rests on Jesus' own words:

{{John 6:54-57}}

and on the Last Supper:

{{Luke 22:19-20}}

The Eucharist is "the source and summit of the Christian life" (CCC 1324). To receive Communion, Catholics should be in a state of grace, having confessed any mortal sin (CCC 1385). If you can't receive, you can still attend Mass and make a spiritual communion.

Eucharistic Adoration — praying before the Blessed Sacrament — is a powerful way to grow close to Jesus, and many people find it a great help in overcoming struggles.`,
    sources: ['CCC 1322–1419'],
    links: [{ label: 'The Eucharist', to: '/faith/learn/traditions/tradition-eucharist' }],
  },
  {
    id: 'mary',
    title: 'Why Catholics honour Mary',
    keywords: ['mary', 'virgin mary', 'blessed mother', 'hail mary', 'pray to mary', 'worship mary', 'mother of god', 'marian'],
    kind: 'teaching',
    answer: `Catholics honour Mary but do not worship her — worship (adoration) belongs to God alone. The Church distinguishes the honour given to Mary from the adoration given to God (CCC 971).

We honour her because God himself honoured her, choosing her to be the Mother of his Son:

{{Luke 1:28}}

{{Luke 1:46-49}}

Mary said "all generations shall call me blessed," and Christians have done so ever since. "Praying to Mary" means asking her to pray for us — just as we ask friends to pray for us — and she always points us to her Son: "Whatsoever he shall say to you, do ye" (John 2:5).

Jesus gave her to the beloved disciple — and to us — as mother from the Cross (John 19:26–27).`,
    sources: ['CCC 963–975', 'CCC 2673–2679'],
    links: [
      { label: 'Pray the Rosary', to: '/faith/rosary' },
      { label: 'The Memorare', to: '/faith/prayers/memorare' },
    ],
  },
  {
    id: 'saints-intercession',
    title: 'Why we ask the saints to pray for us',
    keywords: ['saints pray', 'intercession', 'pray to saints', 'why saints', 'communion of saints', 'patron saint'],
    kind: 'teaching',
    answer: `The Church teaches the "communion of saints": all who belong to Christ — on earth, in purgatory, and in heaven — are united in one family (CCC 954–962). Death does not break that bond.

Just as we ask fellow Christians on earth to pray for us, we ask the saints in heaven, who are fully alive in God, to intercede for us (CCC 956). Scripture says:

{{James 5:16}}

The saints never replace Christ, the one mediator. They point to him, and their lives show what his grace can do in ordinary, struggling people.`,
    sources: ['CCC 946–962'],
    links: [{ label: 'Explore the saints', to: '/faith/saints' }],
  },
  {
    id: 'rosary',
    title: 'How to pray the Rosary',
    keywords: ['rosary', 'pray the rosary', 'mysteries', 'decade', 'beads'],
    kind: 'pastoral',
    answer: `The Rosary is a Gospel prayer: while praying the Our Father, Hail Marys and Glory Be, we meditate on events in the life of Jesus and Mary, called mysteries.

Outline:
1. Sign of the Cross and Apostles' Creed.
2. Our Father, three Hail Marys (for faith, hope and charity), and a Glory Be.
3. Five decades. For each: announce the mystery, pray one Our Father, ten Hail Marys, a Glory Be, and often the Fatima Prayer.
4. Close with the Hail, Holy Queen and a final prayer.

Mysteries by day: Joyful (Monday, Saturday), Sorrowful (Tuesday, Friday), Glorious (Wednesday, Sunday), Luminous (Thursday).

Abide's guided Rosary walks you through each bead with Scripture for every mystery, offline.`,
    links: [{ label: 'Pray the Rosary now', to: '/faith/rosary' }],
  },
  {
    id: 'bible-reading',
    title: 'How to read the Bible',
    keywords: ['read the bible', 'reading the bible', 'where to start', 'lectio divina', 'understand the bible', 'study the bible', 'scripture reading'],
    kind: 'pastoral',
    answer: `A good place to start is the Gospel of Mark — short and vivid — then Luke, Acts, John, and the Psalms.

Try Lectio Divina, the Church's ancient way of praying with Scripture:
1. Read (lectio): read a short passage slowly, perhaps twice.
2. Meditate (meditatio): notice a word or phrase that stands out. Why does it touch you?
3. Pray (oratio): speak to God about it.
4. Contemplate (contemplatio): rest quietly in his presence.

The Catholic Church teaches that Scripture should be read "within the living Tradition of the whole Church," attentive to its content and unity (CCC 113). Good footnotes and commentaries help, and the Abide devotional includes historical context and meaning for each passage.

{{Psalms 118:105}}

About this translation: Abide uses the Douay-Rheims (Challoner revision), a classic public-domain Catholic translation of the Latin Vulgate. Its English is older, and Psalm numbers differ slightly from many modern Bibles.`,
    sources: ['CCC 109–119', 'CCC 2708'],
    links: [
      { label: 'Open the Gospel of Mark', to: '/faith/bible/mark/1' },
      { label: 'Today’s devotional', to: '/devotional' },
    ],
  },
  {
    id: 'routine',
    title: 'A daily spiritual routine',
    keywords: ['routine', 'daily routine', 'rule of life', 'schedule', 'plan', 'daily prayer', 'habit of prayer', 'morning routine', 'spiritual routine', 'build a routine'],
    kind: 'practical',
    answer: `A simple, sustainable "rule of life" is better than an ambitious one you abandon. Here is a starting rhythm you can adapt:

Morning (10 minutes)
• Before checking your phone: Sign of the Cross and Morning Offering.
• Abide's daily devotional: Scripture, reflection, prayer.
• Set one intention for the day.

Midday (2 minutes)
• Pause for the Angelus or a short prayer. Renew your intention.

Evening (10 minutes)
• Daily check-in in Abide.
• Examination of conscience: gratitude, review, sorrow, resolution.
• Night prayer and an Our Father.

Weekly
• Sunday Mass.
• Rosary once or more.
• A good conversation with a friend in faith.

Monthly
• Confession.

Start with just one or two of these and add more as they become natural. Consistency matters more than length.

{{Mark 1:35}}`,
    links: [
      { label: 'Set your reminders', to: '/profile/reminders' },
      { label: 'Morning Offering', to: '/faith/prayers/morning-offering' },
      { label: 'Examination of conscience', to: '/faith/prayers/examen' },
    ],
  },
  {
    id: 'anxiety',
    title: 'Faith and anxiety',
    keywords: ['anxiety', 'anxious', 'worry', 'worried', 'fear', 'afraid', 'stress', 'stressed', 'panic', 'overwhelmed'],
    kind: 'pastoral',
    answer: `Anxiety is a real human experience, not a lack of faith. Jesus himself experienced anguish in Gethsemani. Scripture offers both comfort and a practice:

{{Philippians 4:6-7}}

{{1 Peter 5:7}}

Try this:
• Name your worry specifically and give it to God in prayer.
• Add one thing you are thankful for — gratitude steadies the heart.
• Breathe slowly with a short prayer: "Jesus, I trust in you."
• Focus on today only: "Be not solicitous for to morrow" (Matthew 6:34).
• Do the next small, right thing.

If anxiety is persistent, intense, or affecting your daily life, please talk to a doctor or licensed counsellor. Seeking professional care is entirely consistent with faith — grace works through medicine and good therapy too.`,
    links: [{ label: 'Prayer in anxiety', to: '/faith/prayers/difficult-anxiety' }],
  },
  {
    id: 'discernment',
    title: 'Making good decisions',
    keywords: ['decision', 'decide', 'discern', 'discernment', 'gods will', "god's will", 'vocation', 'which path', 'choice'],
    kind: 'pastoral',
    answer: `The Church's tradition — especially St. Ignatius of Loyola — offers wisdom for discernment:

• Start with what God has already revealed: a choice that contradicts his commandments is not his will.
• Pray for freedom: ask God to free you from fears and attachments so you can choose what's best.
• Gather information and seek wise counsel.
• Notice the movements of your heart. Ignatius observed that choices aligned with God tend to bring lasting peace, even when difficult; others may bring excitement that fades into restlessness.
• Make a decision, offer it to God, and notice whether peace confirms it.
• Don't make big changes in a time of desolation (spiritual darkness or discouragement).

{{Proverbs 3:5-6}}

For major life decisions — vocation, marriage, career — a spiritual director or priest can be a great help.`,
    links: [{ label: 'Saint Ignatius', to: '/faith/saints/ignatius' }],
  },
  {
    id: 'doubt',
    title: 'Faith and doubt',
    keywords: ['doubt', 'doubts', 'not sure god exists', 'does god exist', 'losing my faith', 'struggle to believe', 'unbelief'],
    kind: 'pastoral',
    answer: `Questions and difficulties are part of many people's faith journeys. St. John Henry Newman wrote that "ten thousand difficulties do not make one doubt" — meaning one can wrestle with hard questions while still choosing to believe.

{{Mark 9:23}}

Some suggestions:
• Bring your questions honestly to God in prayer.
• Seek answers: the Catechism, good Catholic books, and knowledgeable priests are resources for real questions.
• Keep praying and practising even when feelings are absent — faith is more than feeling.
• Remember St. Thomas the apostle: his honest doubt led to the most explicit confession of faith in the Gospels: "My Lord and my God."

The Catechism distinguishes involuntary doubt (hesitancy or difficulty in believing) from deliberately refusing to believe (CCC 2088). Wrestling honestly is not the same as rejecting God.`,
    sources: ['CCC 157', 'CCC 2088'],
    links: [{ label: 'The apostle Thomas', to: '/faith/learn/apostles/apostle-thomas' }],
  },
  {
    id: 'dryness',
    title: 'When you can’t feel God in prayer',
    keywords: ["can't feel god", 'cant feel god', 'dry', 'dryness', 'desolation', 'dark night', 'god is silent', 'feel nothing', 'prayer feels empty'],
    kind: 'pastoral',
    answer: `Spiritual dryness is common among people who pray seriously. St. Teresa of Ávila struggled with prayer for years. St. Mother Teresa experienced decades of inner darkness while serving faithfully. St. John of the Cross wrote about "the dark night."

The Catechism notes that dryness is part of contemplative prayer, "when the heart is separated from God, with no taste for thoughts, memories, and feelings, even spiritual ones," and is a moment of "pure faith" (CCC 2731).

What to do:
• Keep showing up. Faithfulness in dryness is love that doesn't depend on reward.
• Check for simple causes: exhaustion, stress, or neglected rest can affect prayer.
• Use structured prayers (the Psalms, the Rosary) when your own words dry up.
• Tell God honestly: "I feel nothing, but I'm here because I love you."
• Talk to a spiritual director if it persists.

{{Psalms 62:2}}`,
    sources: ['CCC 2731'],
  },
  {
    id: 'holy-spirit',
    title: 'Who is the Holy Spirit?',
    keywords: ['holy spirit', 'holy ghost', 'spirit of god', 'gifts of the spirit', 'pentecost', 'confirmation'],
    kind: 'teaching',
    answer: `The Holy Spirit is the third Person of the Most Holy Trinity, "the Lord, the giver of life," who is worshipped and glorified with the Father and the Son (Nicene Creed; CCC 685).

The Spirit came upon the apostles at Pentecost, dwells in the baptised, and strengthens us in Confirmation. He prays within us, guides us into truth, and produces the fruit of a holy life.

{{Romans 8:26}}

The traditional seven gifts of the Holy Spirit are wisdom, understanding, counsel, fortitude, knowledge, piety, and fear of the Lord (CCC 1831). A simple daily prayer: "Come, Holy Spirit."`,
    sources: ['CCC 683–747', 'CCC 1830–1832'],
    links: [{ label: 'Come, Holy Spirit', to: '/faith/prayers/come-holy-spirit' }],
  },
  {
    id: 'trinity',
    title: 'The Holy Trinity',
    keywords: ['trinity', 'three persons', 'father son and holy spirit', 'one god'],
    kind: 'teaching',
    answer: `The Trinity is the central mystery of Christian faith: one God in three divine Persons — Father, Son, and Holy Spirit (CCC 234). The three Persons are distinct, yet they are one God, sharing one divine nature; they are not three gods, nor three "parts" of God (CCC 253–254).

{{Matthew 28:19}}

We cannot fully comprehend this mystery, but it reveals that God is, in himself, a communion of love — and that we are invited into that love.`,
    sources: ['CCC 232–267'],
  },
  {
    id: 'mass',
    title: 'Why go to Mass',
    keywords: ['mass', 'why go to mass', 'sunday obligation', 'church on sunday', 'liturgy', 'holy day'],
    kind: 'teaching',
    answer: `The Mass is the heart of Catholic life. In it, the one sacrifice of Christ on the Cross is made present, and we receive him in the Eucharist (CCC 1366–1367).

The Church asks Catholics to participate in Mass on Sundays and Holy Days of Obligation (CCC 2180–2181), because Sunday is the day of the Resurrection, and gathering as a community is essential to Christian life.

{{Hebrews 10:24-25}}

Practical tips: arrive a few minutes early to pray; read the day's readings beforehand; offer a specific intention; stay for a moment of thanksgiving after Communion.`,
    sources: ['CCC 1322–1419', 'CCC 2174–2188'],
    links: [{ label: 'Understanding the Mass', to: '/faith/learn/traditions/tradition-mass' }],
  },
  {
    id: 'fasting',
    title: 'Fasting and penance',
    keywords: ['fast', 'fasting', 'abstinence', 'penance', 'give up', 'lent', 'friday', 'mortification'],
    kind: 'teaching',
    answer: `Fasting, prayer, and almsgiving are the three traditional pillars of Christian penance (CCC 1434). Fasting trains the will, frees the heart from attachments, and unites us with Christ's sacrifice.

{{Joel 2:12-13}}

The universal Church's minimum (CCC 2043; Code of Canon Law 1249–1253): fasting on Ash Wednesday and Good Friday, and abstinence from meat on Fridays of Lent, for those of the required ages. Bishops' conferences specify details and other Friday penances, so check the norms for your country.

Fasting from a habit-supporting comfort — even small things — can strengthen self-control. If you have a medical condition or a history of disordered eating, speak with your doctor and priest about appropriate forms of penance.`,
    sources: ['CCC 1434–1439', 'CCC 2043'],
    links: [{ label: 'About Lent', to: '/faith/learn/traditions/tradition-lent' }],
  },
  {
    id: 'suffering',
    title: 'Why does God allow suffering?',
    keywords: ['suffering', 'why does god allow', 'evil', 'pain', 'why me', 'bad things'],
    kind: 'opinion',
    answer: `This is one of the deepest questions humans ask, and no short answer can fully resolve it. The Catechism says "only Christian faith as a whole constitutes the answer to this question" (CCC 309).

What the Church teaches: God is not the author of evil. He permits it, respecting the freedom of his creatures, and is able to bring good even out of it (CCC 311–312). Above all, God did not stay distant from suffering — in Jesus, he entered it, carried it, and transformed it through the Cross and Resurrection.

{{Romans 8:28}}

Beyond these teachings, theologians and saints have offered many reflections — about freedom, growth, love, and the mystery of redemption — and these are best received as reflections rather than complete explanations. Sometimes the most faithful response is not an explanation, but presence: God with us in our pain.

If you are suffering now, please don't face it alone. Reach out to people who love you, and to a priest.`,
    sources: ['CCC 309–314', 'CCC 1505'],
  },
  {
    id: 'purity',
    title: 'Growing in purity of heart',
    keywords: ['purity', 'pure', 'chastity', 'chaste', 'lust', 'clean heart', 'pure heart', 'modesty'],
    kind: 'pastoral',
    answer: `Purity of heart is about learning to love freely and see others as persons, not objects. The Catechism describes chastity as "the successful integration of sexuality within the person" — something positive, a school of self-mastery that leads to freedom (CCC 2337, 2339). It also notes that this is a long, gradual work (CCC 2342–2343).

{{Psalms 50:12}}

{{Philippians 4:8}}

Helpful practices:
• Pray daily for purity, and ask St. Joseph and Mary for help.
• Guard your eyes and media — use filters, keep devices out of the bedroom.
• Fill your mind and time with good things: friendship, exercise, beauty, service.
• Go to Confession regularly and receive the Eucharist.
• Find accountability with someone you trust.
• Be patient and gentle with yourself; growth takes time.

Remember: you are not defined by your struggles. God sees your desire for a clean heart and he is the one who creates it.`,
    sources: ['CCC 2337–2359', 'CCC 2518–2533'],
    links: [
      { label: 'Prayer for purity', to: '/faith/prayers/difficult-purity' },
      { label: 'The clean of heart', to: '/faith/learn/beatitudes/beatitude-clean' },
    ],
  },
  {
    id: 'spiritual-director',
    title: 'Finding a spiritual director',
    keywords: ['spiritual director', 'spiritual direction', 'mentor', 'priest to talk to', 'talk to a priest', 'guidance'],
    kind: 'practical',
    answer: `A spiritual director is an experienced guide — a priest, religious, or trained lay person — who meets with you regularly to help you notice God's work in your life and grow in prayer.

How to find one:
• Ask your parish priest or diocese; many keep lists of directors.
• Check retreat centres, monasteries, or Catholic universities near you.
• Look for someone faithful to Church teaching, a person of prayer, and someone you can trust.

You can also simply ask a priest after Mass for a conversation. Most are glad to help.`,
  },
  {
    id: 'scrupulosity',
    title: 'Scrupulosity',
    keywords: ['scrupulosity', 'scrupulous', 'always sinning', 'obsessive', 'afraid of sinning', 'worried i sinned', 'ocd', 'never forgiven'],
    kind: 'pastoral',
    answer: `If you constantly fear that you are sinning, repeatedly confess the same things, or never feel forgiven, you may be experiencing scrupulosity. Many saints, including St. Ignatius of Loyola and St. Thérèse of Lisieux, struggled with it.

What helps:
• Choose one regular confessor and follow his guidance, even when your feelings disagree.
• Remember that sin requires knowledge and free consent; anxiety-driven thoughts are not sins.
• Trust God's mercy over your feelings.
• Consider professional help; scrupulosity is often connected to anxiety or OCD and responds well to treatment.

{{1 John 3:20}}`,
    links: [{ label: 'Is being tempted a sin?', to: '/faith/ask?q=Is%20being%20tempted%20a%20sin' }],
  },
  {
    id: 'purgatory',
    title: 'Purgatory',
    keywords: ['purgatory', 'after death', 'pray for the dead', 'souls'],
    kind: 'teaching',
    answer: `The Church teaches that those who die in God's grace and friendship, but still imperfectly purified, are assured of eternal salvation, and undergo purification after death to achieve the holiness necessary to enter heaven. This is called Purgatory (CCC 1030–1031).

The Church has always prayed for the dead, a practice already found in Scripture:

{{2 Maccabees 12:46}}

Purgatory is ultimately a mystery of God's mercy, completing the work of love he began in us.`,
    sources: ['CCC 1030–1032'],
    links: [{ label: 'Eternal Rest prayer', to: '/faith/prayers/eternal-rest' }],
  },
  {
    id: 'about',
    title: 'About Abide Companion',
    keywords: ['who are you', 'what are you', 'are you ai', 'are you a priest', 'what can you do', 'help', 'abide companion'],
    kind: 'practical',
    answer: `I'm Abide Companion — a learning tool built into this app. I answer from a curated library of Catholic teaching, Scripture, prayers and the lives of the saints, entirely on your device. Nothing you type is sent anywhere.

I can help you:
• understand Bible passages and Catholic teaching,
• find prayers and Scripture for what you're facing,
• learn about the saints and Catholic traditions,
• build a daily spiritual routine,
• reflect on difficult situations.

What I am not: I don't speak for God, I'm not a priest, and I can't replace a confessor, spiritual director, or counsellor. For serious questions about your own situation, please talk to a priest you trust. Every answer is labelled as Church teaching, pastoral guidance, practical help, or theological reflection, so you know what kind of answer it is.`,
  },
];

export const CRISIS_RESPONSE = `I'm really glad you told me. What you're feeling matters, and you deserve support right now from a real person.

• If you are in immediate danger, call your local emergency number.
• In the United States, call or text 988 (Suicide & Crisis Lifeline), available 24/7.
• In the UK and Ireland, call Samaritans at 116 123.
• Elsewhere, please contact your local crisis line or emergency services.

Please reach out to someone you trust today — a friend, family member, priest, or doctor. You don't have to carry this alone.

{{Psalms 33:19}}

You are loved by God, and your life has immense worth.`;
