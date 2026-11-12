// "Grow in Faith" — the Catholic learning library.
// Scripture blocks reference passages that are resolved from the Douay-Rheims at build time.
// "CCC" refers to the Catechism of the Catholic Church (paragraph numbers).

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'scripture'; ref: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'teaching'; text: string; source: string };

export interface Article {
  id: string;
  title: string;
  summary: string;
  blocks: Block[];
  saintId?: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface LearnCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // lucide icon name
  articles: Article[];
  quiz?: QuizQuestion[];
}

const P = (text: string): Block => ({ type: 'p', text });
const H = (text: string): Block => ({ type: 'h', text });
const S = (ref: string): Block => ({ type: 'scripture', ref });
const L = (...items: string[]): Block => ({ type: 'list', items });
const C = (title: string, text: string): Block => ({ type: 'callout', title, text });
const T = (text: string, source: string): Block => ({ type: 'teaching', text, source });

export const LEARN: LearnCategory[] = [
  // ───────────────────────────── JESUS CHRIST ─────────────────────────────
  {
    id: 'jesus',
    title: 'Jesus Christ',
    subtitle: 'His life, teaching, Passion and Resurrection',
    icon: 'Cross',
    articles: [
      {
        id: 'jesus-life',
        title: 'His Life',
        summary: 'True God and true man, born in Bethlehem and raised in Nazareth.',
        blocks: [
          P('Christians believe that Jesus of Nazareth is the eternal Son of God who became man. This is the mystery of the Incarnation: God did not merely send a message; he came himself.'),
          S('John 1:14'),
          H('Birth and hidden years'),
          P('Jesus was born in Bethlehem of the Virgin Mary, around the end of the reign of Herod the Great (who died c. 4 BC). He grew up in Nazareth, a small village in Galilee, where he worked with Joseph as a carpenter. For about thirty years he lived an ordinary, hidden life of work, prayer, and family.'),
          S('Luke 2:51-52'),
          C('Why the hidden years matter', 'Most of Jesus\' life was ordinary. The Church teaches that by this hidden life he sanctified daily work and family life (CCC 533–534). Your ordinary routines can be holy too.'),
          H('Public ministry'),
          P('Around the age of thirty, Jesus was baptised by John in the Jordan. He then spent forty days in the desert before beginning about three years of public ministry — preaching the Kingdom of God, calling disciples, healing the sick, forgiving sinners, and eating with outcasts.'),
          S('Mark 1:14-15'),
          T('Jesus Christ is true God and true man, in the unity of his divine person; for this reason he is the one and only mediator between God and men.', 'CCC 480'),
        ],
      },
      {
        id: 'jesus-teachings',
        title: 'His Teachings',
        summary: 'Love of God and neighbour, the Kingdom, mercy, and conversion of heart.',
        blocks: [
          P('Jesus taught with authority, often in short memorable sayings, stories, and paradoxes. At the centre of his teaching is the Kingdom of God — God\'s reign of love breaking into the world — and the call to conversion.'),
          H('The Great Commandment'),
          S('Matthew 22:37-40'),
          H('A new commandment'),
          S('John 13:34-35'),
          H('Key themes'),
          L(
            'God is a loving Father who knows and cares for each person.',
            'Conversion of heart matters more than outward show.',
            'The poor, the humble, and sinners are especially welcomed.',
            'Forgiveness should be limitless, as God\'s is.',
            'True greatness is found in service.',
            'He is himself the way, the truth, and the life.',
          ),
          S('Mark 10:43-45'),
          C('The Sermon on the Mount', 'Matthew 5–7 gathers much of Jesus\' moral teaching: the Beatitudes, the Our Father, and the call to love enemies. Reading these three chapters slowly is a wonderful spiritual exercise.'),
        ],
      },
      {
        id: 'jesus-miracles',
        title: 'His Miracles',
        summary: 'Signs that reveal who he is and that the Kingdom has come.',
        blocks: [
          P('The Gospels record many miracles: healings, exorcisms, power over nature, and raising the dead. John calls them "signs" because they point beyond themselves to who Jesus is.'),
          H('The first sign: Cana'),
          S('John 2:7-11'),
          H('Calming the storm'),
          S('Mark 4:37-40'),
          H('Healing and forgiveness together'),
          S('Mark 2:3-12'),
          C('What miracles teach', 'Jesus\' miracles were acts of compassion and signs of the Kingdom. They never forced belief; they invited faith. The Church teaches that they "bear witness that he is the Son of God" (CCC 548).'),
        ],
      },
      {
        id: 'jesus-parables',
        title: 'His Parables',
        summary: 'Stories from ordinary life that open the mysteries of the Kingdom.',
        blocks: [
          P('A parable is a short story drawn from daily life — farming, fishing, families, money — that carries a spiritual meaning. Parables invite the listener to decide where they stand.'),
          H('The Good Samaritan'),
          S('Luke 10:30-37'),
          P('Samaritans and Jews were bitter enemies. Jesus makes the despised outsider the hero, and turns the question "Who is my neighbour?" into "Who acted as a neighbour?"'),
          H('The Mustard Seed'),
          S('Matthew 13:31-32'),
          P('The Kingdom begins small and hidden but grows beyond expectation. The same is true of grace in a soul: small daily faithfulness grows into something great.'),
          H('Other parables to read'),
          L(
            'The Prodigal Son — Luke 15:11–32',
            'The Sower — Matthew 13:3–23',
            'The Talents — Matthew 25:14–30',
            'The Pharisee and the Publican — Luke 18:9–14',
            'The Lost Sheep — Luke 15:4–7',
            'The Wise and Foolish Virgins — Matthew 25:1–13',
          ),
        ],
      },
      {
        id: 'jesus-passion',
        title: 'His Passion',
        summary: 'Freely given: the suffering and death of Jesus for our salvation.',
        blocks: [
          P('On the night before he died, Jesus celebrated the Last Supper with his apostles, instituting the Eucharist. He prayed in agony in Gethsemani, was betrayed by Judas, arrested, tried, scourged, crowned with thorns, and crucified under Pontius Pilate.'),
          S('Isaiah 53:4-5'),
          P('Christians have long seen in Isaiah\'s "suffering servant," written centuries before, a profound image of Christ.'),
          H('Words from the Cross'),
          S('Luke 23:33-34'),
          S('Luke 23:42-43'),
          T('By his obedience unto death, Jesus accomplished the substitution of the suffering Servant, who "makes himself an offering for sin."', 'CCC 615'),
          C('Why it matters for your journey', 'The Cross shows that God does not stand far off from human suffering and sin. He enters it, carries it, and transforms it. No struggle you face is outside his reach.'),
        ],
      },
      {
        id: 'jesus-resurrection',
        title: 'His Resurrection',
        summary: 'He is risen. Death and sin do not have the last word.',
        blocks: [
          P('On the third day, the tomb was found empty, and the risen Jesus appeared to Mary Magdalene, to the apostles, and to many others. The Resurrection is the foundation of Christian faith.'),
          S('1 Corinthians 15:3-8'),
          H('The road to Emmaus'),
          S('Luke 24:30-32'),
          T('The Resurrection of Jesus is the crowning truth of our faith in Christ.', 'CCC 638'),
          C('Hope for every new beginning', 'Because Christ is risen, every setback can become a place of resurrection. The pattern of Christian life is death and new life, again and again.'),
        ],
      },
    ],
    quiz: [
      { q: 'Where did Jesus grow up?', options: ['Bethlehem', 'Nazareth', 'Jerusalem', 'Capharnaum'], answer: 1, explain: 'Jesus was born in Bethlehem and raised in Nazareth in Galilee.' },
      { q: 'What was Jesus\' first sign in John\'s Gospel?', options: ['Walking on water', 'Feeding the five thousand', 'Turning water into wine at Cana', 'Raising Lazarus'], answer: 2, explain: 'John 2 describes the wedding at Cana as "the beginning of miracles."' },
      { q: 'In the Good Samaritan parable, who helps the wounded man?', options: ['A priest', 'A Levite', 'A Samaritan', 'An innkeeper'], answer: 2, explain: 'The despised Samaritan shows mercy — the true neighbour.' },
      { q: 'Which is the "crowning truth" of faith in Christ (CCC 638)?', options: ['The Nativity', 'The Resurrection', 'The Transfiguration', 'The Ascension'], answer: 1, explain: 'The Resurrection is the foundation of Christian hope.' },
    ],
  },

  // ───────────────────────────── APOSTLES ─────────────────────────────
  {
    id: 'apostles',
    title: 'The Apostles',
    subtitle: 'The Twelve, and the apostle Paul',
    icon: 'Users',
    articles: [
      {
        id: 'apostles-intro',
        title: 'Who Were the Apostles?',
        summary: 'Ordinary people chosen to be with Jesus and sent out in his name.',
        blocks: [
          P('"Apostle" means "one who is sent." Jesus chose twelve men — echoing the twelve tribes of Israel — to be with him and to be sent out to preach. They were fishermen, a tax collector, a zealot: ordinary, flawed people.'),
          S('Mark 3:13-15'),
          T('The Lord Jesus endowed his community with a structure that will remain until the Kingdom is fully achieved. Before all else there is the choice of the Twelve with Peter as their head.', 'CCC 765'),
          C('Apostolic succession', 'Catholics believe the bishops are successors of the apostles, and the Pope is the successor of Peter. This continuity links today\'s Church to Jesus\' own choice.'),
        ],
      },
      {
        id: 'apostle-peter', saintId: 'peter',
        title: 'Peter',
        summary: 'The fisherman made "rock," who denied Jesus and was restored.',
        blocks: [
          P('Simon, a fisherman from Bethsaida living in Capharnaum, was brought to Jesus by his brother Andrew. Jesus renamed him Cephas — Peter — meaning "rock."'),
          S('Matthew 16:15-18'),
          P('Peter was bold and impulsive: he walked on water, tried to defend Jesus with a sword, and denied him three times. After the Resurrection, Jesus restored him and entrusted him with feeding his sheep. Peter led the early Church and was martyred in Rome.'),
          C('Relationship with Jesus', 'Peter shows that leadership in the Church rests not on perfection but on love and repentance.'),
        ],
      },
      {
        id: 'apostle-andrew', saintId: 'andrew',
        title: 'Andrew',
        summary: 'The first to follow, who brought his brother to Jesus.',
        blocks: [
          P('Andrew was a disciple of John the Baptist. When John pointed to Jesus as the Lamb of God, Andrew followed and then went to find his brother Simon.'),
          S('John 1:40-42'),
          P('Andrew also brought the boy with five loaves and two fish to Jesus. Tradition says he preached in Greece and was crucified on an X-shaped cross.'),
        ],
      },
      {
        id: 'apostle-james-greater',
        title: 'James, son of Zebedee',
        summary: 'One of the inner three; first of the Twelve to be martyred.',
        blocks: [
          P('James and his brother John were fishermen whom Jesus called "Boanerges," sons of thunder, for their fiery temperament. With Peter, they witnessed the Transfiguration and the agony in Gethsemani.'),
          S('Acts 12:1-2'),
          P('James was beheaded by Herod Agrippa around AD 44, the first apostle to die for Christ. He is venerated at Santiago de Compostela in Spain.'),
        ],
      },
      {
        id: 'apostle-john',
        title: 'John',
        summary: 'The beloved disciple who stood at the foot of the Cross.',
        blocks: [
          P('John is traditionally identified as "the disciple whom Jesus loved." He leaned on Jesus\' breast at the Last Supper and was the only apostle at the Cross, where Jesus entrusted Mary to him.'),
          S('John 19:26-27'),
          P('Tradition attributes to him the Fourth Gospel, three letters, and the Apocalypse. He is believed to be the only apostle not to die a martyr\'s death, living to old age in Ephesus.'),
        ],
      },
      {
        id: 'apostle-philip',
        title: 'Philip',
        summary: 'The practical apostle who asked to see the Father.',
        blocks: [
          P('Philip, from Bethsaida, was called directly by Jesus and immediately brought Nathanael. At the Last Supper he asked, "Lord, shew us the Father," prompting one of Jesus\' great revelations.'),
          S('John 14:8-9'),
          P('Tradition holds he preached in Asia Minor and was martyred at Hierapolis.'),
        ],
      },
      {
        id: 'apostle-bartholomew',
        title: 'Bartholomew (Nathanael)',
        summary: 'An Israelite "in whom there is no guile."',
        blocks: [
          P('Bartholomew is usually identified with Nathanael, who at first doubted that anything good could come from Nazareth. Jesus saw his honest heart.'),
          S('John 1:47-49'),
          P('Tradition says he preached in India and Armenia, where he was martyred.'),
        ],
      },
      {
        id: 'apostle-thomas',
        title: 'Thomas',
        summary: 'The honest doubter who made the greatest confession of faith.',
        blocks: [
          P('Thomas would not believe in the Resurrection until he saw for himself. When Jesus appeared and invited him to touch his wounds, Thomas cried out the most explicit confession of Jesus\' divinity in the Gospels.'),
          S('John 20:27-29'),
          P('Tradition holds that Thomas carried the Gospel to India, where the "Saint Thomas Christians" trace their origins to him.'),
        ],
      },
      {
        id: 'apostle-matthew',
        title: 'Matthew',
        summary: 'The tax collector who left everything to follow Jesus.',
        blocks: [
          P('Matthew (also called Levi) collected taxes for Rome — a profession seen as traitorous and dishonest. Jesus called him from his tax booth, and he left everything.'),
          S('Matthew 9:9-13'),
          P('Tradition attributes the first Gospel to him. His story proves that Jesus calls those others write off.'),
        ],
      },
      {
        id: 'apostle-james-lesser',
        title: 'James, son of Alphaeus',
        summary: 'Often called "James the Less."',
        blocks: [
          P('Little is recorded about this James in the Gospels. He is often identified with "James the Less" and, in Western tradition, with James the "brother of the Lord" who led the Church in Jerusalem — though scholars debate this.'),
          P('His quiet presence reminds us that not every faithful life is recorded in detail. God knows each one.'),
        ],
      },
      {
        id: 'apostle-jude',
        title: 'Jude Thaddeus',
        summary: 'Patron of difficult and desperate cases.',
        blocks: [
          P('Jude (also called Thaddeus) asked Jesus at the Last Supper why he would reveal himself to the disciples and not to the world.'),
          S('John 14:22-23'),
          P('He is popularly invoked as the patron of hopeless causes. Tradition says he was martyred in Persia along with Simon.'),
        ],
      },
      {
        id: 'apostle-simon',
        title: 'Simon the Zealot',
        summary: 'A man of strong convictions, transformed by Christ.',
        blocks: [
          P('Simon is called "the Zealot," possibly indicating he belonged to a movement fiercely opposed to Roman rule — while Matthew had worked for Rome. Jesus brought them together.'),
          P('His presence among the Twelve shows that Christ unites people of opposite views in one family.'),
        ],
      },
      {
        id: 'apostle-judas',
        title: 'Judas Iscariot',
        summary: 'A sober lesson about despair.',
        blocks: [
          P('Judas kept the common purse and betrayed Jesus for thirty pieces of silver. Afterwards he regretted it, but in despair took his own life.'),
          C('Peter and Judas', 'Both men betrayed Jesus on the same night. Peter wept and returned; Judas despaired. The difference was not the size of the sin but trust in mercy. No sin is greater than God\'s mercy.'),
        ],
      },
      {
        id: 'apostle-matthias',
        title: 'Matthias',
        summary: 'Chosen to take the place of Judas.',
        blocks: [
          S('Acts 1:23-26'),
          P('Matthias had followed Jesus from his baptism to the Ascension. He was chosen by lot after prayer, restoring the number of the Twelve.'),
        ],
      },
      {
        id: 'apostle-paul', saintId: 'paul',
        title: 'Paul',
        summary: 'The persecutor who became the Apostle to the Gentiles.',
        blocks: [
          P('Paul was not one of the Twelve, but the risen Christ called him on the road to Damascus. He became the great missionary to the Gentiles and wrote thirteen letters of the New Testament.'),
          S('Acts 9:3-6'),
          P('His contribution to the early Church is immeasurable: he founded communities across the Mediterranean and articulated the meaning of grace, faith, and the Church as the Body of Christ.'),
        ],
      },
    ],
    quiz: [
      { q: 'What does "apostle" mean?', options: ['Teacher', 'One who is sent', 'Friend', 'Fisherman'], answer: 1, explain: 'From the Greek apostolos, "one who is sent."' },
      { q: 'Which apostle was a tax collector?', options: ['Thomas', 'Andrew', 'Matthew', 'Philip'], answer: 2, explain: 'Matthew (Levi) was called from his tax booth.' },
      { q: 'Who brought Peter to Jesus?', options: ['John', 'Andrew', 'James', 'Philip'], answer: 1, explain: 'Andrew found his brother Simon and brought him to Jesus.' },
      { q: 'Who replaced Judas among the Twelve?', options: ['Paul', 'Barnabas', 'Matthias', 'Stephen'], answer: 2, explain: 'Acts 1 records the choice of Matthias.' },
    ],
  },

  // ───────────────────────────── BEATITUDES ─────────────────────────────
  {
    id: 'beatitudes',
    title: 'The Beatitudes',
    subtitle: 'The portrait of a disciple — and of Christ',
    icon: 'Mountain',
    articles: [
      {
        id: 'beatitudes-intro',
        title: 'The Way of Blessedness',
        summary: 'Jesus\' description of true happiness.',
        blocks: [
          P('The Beatitudes open the Sermon on the Mount. "Beatitude" comes from the Latin beatus, "blessed" or "happy." They describe the deep happiness that comes from living in God\'s Kingdom.'),
          S('Matthew 5:1-2'),
          T('The Beatitudes depict the countenance of Jesus Christ and portray his charity. They express the vocation of the faithful.', 'CCC 1717'),
          C('Note on numbering', 'The Douay-Rheims follows the Latin Vulgate order, in which "Blessed are the meek" comes before "Blessed are they that mourn."'),
        ],
      },
      {
        id: 'beatitude-poor', title: 'Poor in Spirit', summary: 'Knowing our need for God.',
        blocks: [S('Matthew 5:3'), P('To be poor in spirit is to recognise that everything is gift and that we depend entirely on God. It is the opposite of self-sufficiency and pride.'), C('In practice', 'Begin prayer by acknowledging your need. Hold possessions loosely. Thank God for everything.')],
      },
      {
        id: 'beatitude-meek', title: 'The Meek', summary: 'Strength under control.',
        blocks: [S('Matthew 5:4'), P('Meekness is not weakness. It is strength governed by love — the ability to respond to provocation with gentleness. Jesus called himself "meek and humble of heart."'), C('In practice', 'When provoked today, pause before reacting. Choose a gentle word.')],
      },
      {
        id: 'beatitude-mourn', title: 'Those Who Mourn', summary: 'Grief that God will comfort.',
        blocks: [S('Matthew 5:5'), P('This includes grief over loss, sorrow over the world\'s suffering, and sorrow for sin. Such mourning is not despair; it is a heart open to God\'s consolation.'), C('In practice', 'Bring your sorrows honestly to God. Comfort someone who is grieving.')],
      },
      {
        id: 'beatitude-hunger', title: 'Hunger for Justice', summary: 'Longing for what is right.',
        blocks: [S('Matthew 5:6'), P('"Justice" here means righteousness — right relationship with God and others. Those who long for holiness as a hungry person longs for food will be satisfied.'), C('In practice', 'Ask God to increase your desire for holiness. Act justly in one concrete situation.')],
      },
      {
        id: 'beatitude-merciful', title: 'The Merciful', summary: 'Mercy given, mercy received.',
        blocks: [S('Matthew 5:7'), P('Mercy is love that meets misery. Those who forgive and show compassion open their hearts to receive God\'s mercy.'), C('In practice', 'Perform one work of mercy: feed, visit, forgive, comfort, pray for others.')],
      },
      {
        id: 'beatitude-clean', title: 'The Clean of Heart', summary: 'An undivided heart that sees God.',
        blocks: [S('Matthew 5:8'), P('A clean heart is undivided, sincere, and pure in its desires. It sees God — in prayer, in others, and one day face to face. Purity of heart is restored by grace, not achieved by willpower alone.'), C('In practice', 'Guard what you look at and dwell on. Pray Psalm 50: "Create a clean heart in me, O God."')],
      },
      {
        id: 'beatitude-peacemakers', title: 'The Peacemakers', summary: 'Children of God who reconcile.',
        blocks: [S('Matthew 5:9'), P('Peacemakers do more than avoid conflict. They actively work for reconciliation, beginning with peace in their own hearts.'), C('In practice', 'Reach out to mend one strained relationship.')],
      },
      {
        id: 'beatitude-persecuted', title: 'The Persecuted', summary: 'Faithful when it costs.',
        blocks: [S('Matthew 5:10-12'), P('Those who suffer for doing right share in Christ\'s own suffering — and in his Kingdom.'), C('In practice', 'Do the right thing today even if it costs you approval.')],
      },
    ],
    quiz: [
      { q: 'What does "beatitude" mean?', options: ['Law', 'Blessed or happy', 'Prayer', 'Promise'], answer: 1, explain: 'From the Latin beatus, blessed or happy.' },
      { q: 'What is promised to the clean of heart?', options: ['They shall be comforted', 'They shall see God', 'They shall possess the land', 'They shall obtain mercy'], answer: 1, explain: '"Blessed are the clean of heart: they shall see God."' },
      { q: 'Meekness is best described as…', options: ['Weakness', 'Strength under the control of love', 'Shyness', 'Indifference'], answer: 1, explain: 'Jesus himself was meek — gentle, yet strong.' },
    ],
  },

  // ───────────────────────────── VIRTUES ─────────────────────────────
  {
    id: 'virtues',
    title: 'The Seven Virtues',
    subtitle: 'Three theological and four cardinal virtues',
    icon: 'Sparkles',
    articles: [
      {
        id: 'virtues-intro', title: 'What Is a Virtue?', summary: 'A firm habit of doing good.',
        blocks: [
          T('A virtue is an habitual and firm disposition to do the good.', 'CCC 1803'),
          P('Virtues are good habits. Just as bad habits form through repetition, so do good ones. The three theological virtues (faith, hope, charity) are gifts infused by God; the four cardinal virtues (prudence, justice, fortitude, temperance) are strengthened by practice and grace.'),
          S('Wisdom 8:7'),
          C('Why this matters for you', 'Breaking a bad habit is only half the work. Building a virtue in its place is what lasts.'),
        ],
      },
      { id: 'virtue-faith', title: 'Faith', summary: 'Believing God and all he has revealed.', blocks: [S('Hebrews 11:1'), T('Faith is the theological virtue by which we believe in God and believe all that he has said and revealed to us.', 'CCC 1814'), C('Grow in faith', 'Read Scripture daily. Pray the Creed. Ask questions and seek answers.')] },
      { id: 'virtue-hope', title: 'Hope', summary: 'Trusting God\'s promises.', blocks: [S('Romans 5:5'), T('Hope is the theological virtue by which we desire the kingdom of heaven and eternal life as our happiness, placing our trust in Christ\'s promises.', 'CCC 1817'), C('Grow in hope', 'After a setback, refuse despair. Begin again. Pray the Act of Hope.')] },
      { id: 'virtue-charity', title: 'Charity', summary: 'Loving God above all, and neighbour for his sake.', blocks: [S('1 Corinthians 13:13'), T('Charity is the theological virtue by which we love God above all things for his own sake, and our neighbour as ourselves for the love of God.', 'CCC 1822'), C('Grow in charity', 'Do one act of hidden kindness each day.')] },
      { id: 'virtue-prudence', title: 'Prudence', summary: 'Practical wisdom to choose the good.', blocks: [S('Proverbs 14:15'), T('Prudence is the virtue that disposes practical reason to discern our true good in every circumstance and to choose the right means of achieving it.', 'CCC 1806'), C('Grow in prudence', 'Pause before decisions. Seek counsel. Plan ahead for temptations.')] },
      { id: 'virtue-justice', title: 'Justice', summary: 'Giving God and neighbour their due.', blocks: [S('Micah 6:8'), T('Justice is the moral virtue that consists in the constant and firm will to give their due to God and neighbour.', 'CCC 1807'), C('Grow in justice', 'Keep your promises. Be honest. Give God time in worship.')] },
      { id: 'virtue-fortitude', title: 'Fortitude', summary: 'Courage and firmness in difficulty.', blocks: [S('Joshua 1:9'), T('Fortitude is the moral virtue that ensures firmness in difficulties and constancy in the pursuit of the good.', 'CCC 1808'), C('Grow in fortitude', 'Do the hard right thing, especially when no one is watching.')] },
      { id: 'virtue-temperance', title: 'Temperance', summary: 'Moderation and mastery of desire.', blocks: [S('Titus 2:12'), T('Temperance is the moral virtue that moderates the attraction of pleasures and provides balance in the use of created goods.', 'CCC 1809'), C('Grow in temperance', 'Practise small, regular acts of self-denial: a smaller portion, a shorter screen session, an earlier bedtime.')] },
    ],
    quiz: [
      { q: 'Which are the theological virtues?', options: ['Prudence, justice, fortitude', 'Faith, hope, charity', 'Patience, kindness, humility', 'Temperance, chastity, meekness'], answer: 1, explain: 'Faith, hope, and charity have God as their object (CCC 1812).' },
      { q: 'Which virtue moderates the attraction of pleasures?', options: ['Justice', 'Fortitude', 'Temperance', 'Prudence'], answer: 2, explain: 'Temperance provides balance in the use of created goods.' },
      { q: 'A virtue is best described as…', options: ['A feeling', 'A firm habit of doing good', 'A rule', 'A reward'], answer: 1, explain: 'CCC 1803.' },
    ],
  },

  // ───────────────────────────── DEADLY SINS ─────────────────────────────
  {
    id: 'sins',
    title: 'The Seven Deadly Sins',
    subtitle: 'Capital sins — and the virtues that heal them',
    icon: 'Shield',
    articles: [
      {
        id: 'sins-intro', title: 'Understanding the Capital Sins', summary: 'Roots of other sins, and how to uproot them.',
        blocks: [
          T('They are called "capital" because they engender other sins, other vices. They are pride, avarice, envy, wrath, lust, gluttony, and sloth or acedia.', 'CCC 1866'),
          P('Knowing these tendencies is not about condemning ourselves, but about understanding the roots of our struggles. Each has an opposing virtue that heals it.'),
          C('A gentle approach', 'Everyone has tendencies toward some of these. Recognising yours is wisdom, not shame. Focus on growing the opposite virtue.'),
        ],
      },
      { id: 'sin-pride', title: 'Pride → Humility', summary: 'Putting self in the place of God.', blocks: [S('Sirach 10:15'), P('Pride is an excessive love of one\'s own excellence. It is considered the root of all the others. It shows up as vanity, inability to accept correction, and contempt for others.'), C('Counter-virtue: Humility', 'Seeing yourself truthfully: loved, gifted, and dependent on God. Practise by serving quietly and accepting correction.')] },
      { id: 'sin-greed', title: 'Avarice → Generosity', summary: 'Disordered love of possessions.', blocks: [S('Luke 12:15'), P('Greed is grasping after money and possessions as though they could secure our life.'), C('Counter-virtue: Generosity (liberality)', 'Give regularly and freely. Trust God with your security.')] },
      { id: 'sin-envy', title: 'Envy → Kindness', summary: 'Sadness at another\'s good.', blocks: [S('Proverbs 14:30'), P('Envy resents others\' blessings. Social media comparison feeds it easily.'), C('Counter-virtue: Kindness and brotherly love', 'Rejoice in others\' good. Thank God for their gifts. Limit comparison.')] },
      { id: 'sin-wrath', title: 'Wrath → Patience', summary: 'Disordered anger.', blocks: [S('James 1:19-20'), P('Not all anger is sinful; Jesus showed righteous anger. Wrath is anger that desires revenge or is out of proportion.'), C('Counter-virtue: Patience and meekness', 'Pause. Breathe. Pray before responding. Forgive.')] },
      { id: 'sin-lust', title: 'Lust → Chastity', summary: 'Disordered desire for sexual pleasure.', blocks: [S('Matthew 5:27-28'), S('1 Corinthians 6:19-20'), P('Lust treats persons as objects for pleasure rather than as persons to be loved. Chastity is not repression; it is the integration of sexuality within the person, so that love becomes free and self-giving (CCC 2337).'), C('Counter-virtue: Chastity', 'Guard your eyes and mind. Build healthy friendships. Frequent confession and the Eucharist. Be patient with yourself — chastity is learned over time (CCC 2342).')] },
      { id: 'sin-gluttony', title: 'Gluttony → Temperance', summary: 'Excess in food and drink.', blocks: [S('Proverbs 23:20-21'), P('Gluttony is using food or drink beyond need, seeking comfort or escape. The same pattern can appear with other consumption.'), C('Counter-virtue: Temperance', 'Practise moderation. Observe Friday penance. Give thanks before meals.')] },
      { id: 'sin-sloth', title: 'Sloth → Diligence', summary: 'Spiritual apathy and neglect of good.', blocks: [S('Proverbs 6:6-8'), P('Sloth (acedia) is more than laziness. It is a spiritual weariness that neglects love of God and the duties of one\'s life. It often hides behind endless distraction.'), C('Counter-virtue: Diligence', 'Keep a daily rule of prayer. Do the next duty with love. Start small.')] },
    ],
    quiz: [
      { q: 'Which sin is considered the root of the others?', options: ['Lust', 'Pride', 'Sloth', 'Greed'], answer: 1, explain: 'Sirach calls pride "the beginning of all sin."' },
      { q: 'Which virtue counters envy?', options: ['Temperance', 'Kindness', 'Diligence', 'Chastity'], answer: 1, explain: 'Kindness rejoices in others\' good.' },
      { q: 'Sloth (acedia) is best described as…', options: ['Resting on Sunday', 'Spiritual apathy and neglect of good', 'Being tired', 'Taking a vacation'], answer: 1, explain: 'Acedia is a weariness toward spiritual good.' },
    ],
  },

  // ───────────────────────────── TRADITIONS ─────────────────────────────
  {
    id: 'traditions',
    title: 'Catholic Traditions',
    subtitle: 'Sacraments, the Mass, and the liturgical year',
    icon: 'Church',
    articles: [
      {
        id: 'tradition-mass', title: 'The Mass', summary: 'The source and summit of Christian life.',
        blocks: [
          T('The Eucharist is "the source and summit of the Christian life."', 'CCC 1324, quoting Lumen Gentium 11'),
          P('The Mass has two main parts. In the Liturgy of the Word, we hear Scripture: usually an Old Testament reading, a Psalm, a New Testament reading, and the Gospel, followed by the homily. In the Liturgy of the Eucharist, bread and wine are offered and, through the words of consecration, become the Body and Blood of Christ.'),
          S('1 Corinthians 11:23-26'),
          H('Structure'),
          L('Introductory Rites — Sign of the Cross, greeting, penitential act, Gloria, Collect', 'Liturgy of the Word — readings, homily, Creed, Prayer of the Faithful', 'Liturgy of the Eucharist — preparation of gifts, Eucharistic Prayer, Our Father, Sign of Peace, Communion', 'Concluding Rites — blessing and dismissal'),
          C('Sunday obligation', 'Catholics are called to attend Mass on Sundays and Holy Days of Obligation (CCC 2180). It is the weekly heart of the Christian life.'),
        ],
      },
      {
        id: 'tradition-confession', title: 'Confession', summary: 'The Sacrament of Penance and Reconciliation.',
        blocks: [
          P('On Easter evening, the risen Jesus gave the apostles the power to forgive sins. The Church celebrates this in the Sacrament of Penance (Confession, or Reconciliation).'),
          S('John 20:21-23'),
          H('How to go to confession'),
          L(
            'Prepare with an examination of conscience.',
            'Enter the confessional; you may kneel behind a screen or sit face-to-face.',
            'Make the Sign of the Cross and say: "Bless me, Father, for I have sinned. It has been [time] since my last confession."',
            'Confess your sins simply and honestly. Mortal sins should be confessed by kind and number, as best you can.',
            'Listen to the priest\'s counsel and receive your penance.',
            'Pray an Act of Contrition.',
            'The priest gives absolution. Say "Amen."',
            'Complete your penance promptly.',
          ),
          C('The seal of confession', 'A priest may never reveal what is said in confession, under any circumstances (CCC 1467). You can speak freely.'),
          C('Don\'t be afraid', 'Priests hear many confessions. Nothing you say will shock them, and they rejoice to give God\'s mercy. If you are nervous, tell the priest — he will help you.'),
        ],
      },
      {
        id: 'tradition-eucharist', title: 'The Eucharist', summary: 'Jesus truly present: Body, Blood, Soul and Divinity.',
        blocks: [
          P('Catholics believe that in the Eucharist, Jesus Christ is truly, really, and substantially present under the appearances of bread and wine. The Church calls this change "transubstantiation."'),
          S('John 6:54-57'),
          T('In the most blessed sacrament of the Eucharist the body and blood, together with the soul and divinity, of our Lord Jesus Christ and, therefore, the whole Christ is truly, really, and substantially contained.', 'CCC 1374, quoting the Council of Trent'),
          C('Receiving worthily', 'Catholics should be in a state of grace to receive Communion; anyone conscious of mortal sin should go to confession first (CCC 1385). If you cannot receive, you may make a spiritual communion — inviting Jesus into your heart.'),
          C('Eucharistic Adoration', 'Many parishes offer time to pray before the Blessed Sacrament. Even fifteen minutes of silent adoration can transform your week.'),
        ],
      },
      {
        id: 'tradition-sacraments', title: 'The Seven Sacraments', summary: 'Visible signs of invisible grace.',
        blocks: [
          T('The sacraments are efficacious signs of grace, instituted by Christ and entrusted to the Church, by which divine life is dispensed to us.', 'CCC 1131'),
          H('Sacraments of Initiation'),
          L('Baptism — new birth as children of God; original sin washed away.', 'Confirmation — the strengthening gift of the Holy Spirit.', 'Eucharist — the Body and Blood of Christ, our spiritual food.'),
          H('Sacraments of Healing'),
          L('Penance (Confession) — forgiveness of sins committed after baptism.', 'Anointing of the Sick — strength, peace, and healing for the seriously ill or elderly.'),
          H('Sacraments at the Service of Communion'),
          L('Holy Orders — bishops, priests, and deacons ordained for service.', 'Matrimony — the lifelong covenant of a man and a woman, a sign of Christ\'s love for the Church.'),
          S('Matthew 28:19-20'),
        ],
      },
      {
        id: 'tradition-advent', title: 'Advent', summary: 'Four weeks of hopeful waiting.',
        blocks: [
          P('Advent ("coming") begins four Sundays before Christmas. It prepares us both for celebrating Christ\'s first coming at Bethlehem and for his second coming in glory. Its colour is violet, with rose on the third Sunday (Gaudete, "Rejoice").'),
          S('Isaiah 9:6'),
          L('Light an Advent wreath at dinner.', 'Pray the O Antiphons (December 17–23).', 'Go to confession before Christmas.', 'Practise small acts of waiting and generosity.'),
        ],
      },
      {
        id: 'tradition-lent', title: 'Lent', summary: 'Forty days of prayer, fasting, and almsgiving.',
        blocks: [
          P('Lent begins on Ash Wednesday and prepares for Easter through forty days of penance, echoing Jesus\' forty days in the desert. Its three pillars are prayer, fasting, and almsgiving.'),
          S('Joel 2:12-13'),
          L('Ash Wednesday and Good Friday are days of fasting and abstinence for Catholics of the required ages.', 'Fridays of Lent are days of abstinence from meat.', 'Many people give something up and add a spiritual practice.'),
          C('Lent and habit change', 'Lent is a natural season to begin breaking a habit — supported by the whole Church praying and fasting together.'),
        ],
      },
      {
        id: 'tradition-easter', title: 'Easter', summary: 'The feast of feasts — fifty days of joy.',
        blocks: [
          P('Easter celebrates Christ\'s Resurrection. It is preceded by the Sacred Triduum: Holy Thursday, Good Friday, and the Easter Vigil. The Easter season lasts fifty days, until Pentecost.'),
          S('Mark 16:5-7'),
          C('Every Sunday is a little Easter', 'Christians gather on Sunday, the day of the Resurrection, because every week celebrates Christ\'s victory over death.'),
        ],
      },
      {
        id: 'tradition-feasts', title: 'Feast Days and the Liturgical Year', summary: 'Living through the life of Christ each year.',
        blocks: [
          P('The Church year moves through Advent, Christmas, Ordinary Time, Lent, the Triduum, Easter, and Ordinary Time again. Along the way, the Church celebrates feasts of the Lord, of Mary, and of the saints.'),
          H('Liturgical colours'),
          L('Violet — Advent and Lent (penance and preparation)', 'White or gold — Christmas, Easter, feasts of the Lord, Mary, and non-martyr saints', 'Red — Pentecost, Passion, and martyrs', 'Green — Ordinary Time (growth)', 'Rose — Gaudete and Laetare Sundays'),
          H('Some major feasts'),
          L('Mary, Mother of God — January 1', 'The Epiphany', 'The Annunciation — March 25', 'Pentecost', 'The Most Holy Body and Blood of Christ (Corpus Christi)', 'Saints Peter and Paul — June 29', 'The Assumption — August 15', 'All Saints — November 1', 'All Souls — November 2', 'Christ the King — last Sunday of Ordinary Time', 'The Immaculate Conception — December 8', 'Christmas — December 25'),
          C('Holy Days of Obligation', 'These vary by country. Check with your diocese or parish for those observed where you live.'),
        ],
      },
    ],
    quiz: [
      { q: 'How many sacraments are there?', options: ['Five', 'Seven', 'Ten', 'Twelve'], answer: 1, explain: 'Baptism, Confirmation, Eucharist, Penance, Anointing, Holy Orders, Matrimony.' },
      { q: 'What colour is used during Advent and Lent?', options: ['Green', 'Red', 'Violet', 'White'], answer: 2, explain: 'Violet signifies penance and preparation.' },
      { q: 'May a priest ever reveal what is said in confession?', options: ['Yes, if asked by police', 'Yes, to the bishop', 'Never', 'Only after death'], answer: 2, explain: 'The sacramental seal is absolute (CCC 1467).' },
      { q: 'How long is the Easter season?', options: ['One week', 'Forty days', 'Fifty days', 'Until Advent'], answer: 2, explain: 'Easter lasts fifty days, until Pentecost.' },
    ],
  },
];
