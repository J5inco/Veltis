export const modules = [
  {
    id: 1,
    title: "Les bases absolues",
    description: "Action, dividende, PEA, CTO, flat tax 30%. Tout ce qu'on n'enseigne pas à l'école.",
    free: true,
    lecons: [
      {
        id: 1,
        title: "C'est quoi une action ?",
        texte: `Quand tu achètes une action Apple, tu deviens officiellement copropriétaire d'Apple. Pas un grand propriétaire — tu détiens une toute petite part de l'entreprise. Mais propriétaire quand même.\n\nUne entreprise a besoin d'argent pour se développer. Elle peut emprunter à une banque, ou elle peut vendre des parts d'elle-même au public. Ces parts, ce sont des actions.\n\nTu as deux façons de gagner de l'argent avec une action. La première, c'est la plus-value : si l'entreprise se porte bien, ton action vaut plus cher qu'au moment où tu l'as achetée. La deuxième, c'est le dividende : certaines entreprises reversent une partie de leurs bénéfices annuels à leurs actionnaires. TotalEnergies verse environ 3€ par action et par an.\n\n**La règle à retenir** : une action c'est une part de propriété dans une entreprise. Tu gagnes si l'entreprise crée de la valeur dans le temps.`,
        flashcards: [
          { recto: "Qu'est-ce qu'une action ?", verso: "Une part de propriété dans une entreprise. En achetant une action, tu deviens actionnaire et copropriétaire." },
          { recto: "Quelles sont les deux façons de gagner de l'argent avec une action ?", verso: "La plus-value (revendre l'action plus cher) et le dividende (part des bénéfices versée chaque année)." },
          { recto: "Pourquoi une entreprise émet des actions en bourse ?", verso: "Pour lever des capitaux auprès du public et financer son développement, sans passer par un emprunt bancaire." },
        ],
        quiz: [
          {
            question: "Acheter une action d'Airbus, c'est :",
            options: ["Prêter de l'argent à Airbus", "Devenir copropriétaire d'Airbus", "Acheter un bon d'achat chez Airbus", "Souscrire à une assurance-vie"],
            reponse: 1,
            feedback: "Exactement. Une action c'est une part du capital de l'entreprise. Tu en deviens actionnaire, pas créancier.",
          },
          {
            question: "TotalEnergies verse 3€ de dividende par action. Tu en possèdes 20. Tu reçois combien par an ?",
            options: ["3€", "20€", "60€", "600€"],
            reponse: 2,
            feedback: "3€ × 20 actions = 60€ par an, versés automatiquement sans que tu aies à faire quoi que ce soit.",
          },
          {
            question: "Une action Apple passe de 150€ à 190€. Tu en possèdes 5. Quelle est ta plus-value si tu vends ?",
            options: ["40€", "190€", "200€", "950€"],
            reponse: 2,
            feedback: "(190 - 150) × 5 = 200€ de plus-value brute. Attention, hors PEA tu paies 30% de flat tax sur ce gain.",
          },
        ],
      },
      {
        id: 2,
        title: "La bourse, comment ça marche ?",
        texte: `La bourse est un marché. Exactement comme un marché de fruits et légumes, sauf qu'on y échange des parts d'entreprises. Des acheteurs et des vendeurs se retrouvent, et le prix se fixe en fonction de l'offre et de la demande.\n\nEn France, ce marché s'appelle Euronext Paris. C'est là que sont cotées les grandes entreprises françaises : LVMH, TotalEnergies, Airbus, BNP Paribas. Le CAC 40 est l'indice qui regroupe les 40 plus grandes d'entre elles.\n\nPourquoi les cours bougent-ils ? Pour une raison simple : les anticipations. Si les investisseurs pensent qu'une entreprise va gagner plus d'argent demain, ils achètent ses actions aujourd'hui. La demande augmente, le prix monte.\n\nCe qu'il faut comprendre : tu n'achètes pas à l'entreprise directement. Tu achètes à un autre investisseur qui veut vendre. C'est ce qu'on appelle le marché secondaire.\n\n**La règle à retenir** : le prix d'une action reflète ce que les investisseurs pensent de l'avenir d'une entreprise.`,
        flashcards: [
          { recto: "Qu'est-ce que le CAC 40 ?", verso: "L'indice boursier des 40 plus grandes entreprises françaises cotées sur Euronext Paris. Il sert de baromètre de la santé économique française." },
          { recto: "Pourquoi le cours d'une action monte ou descend ?", verso: "À cause de l'offre et de la demande. Si plus de gens veulent acheter que vendre, le prix monte. Si plus de gens veulent vendre, il baisse." },
          { recto: "Qu'est-ce que le marché secondaire ?", verso: "Le marché où les investisseurs s'échangent des actions entre eux, après l'introduction en bourse. Tu achètes à un autre investisseur, pas à l'entreprise." },
        ],
        quiz: [
          {
            question: "Euronext Paris, c'est :",
            options: ["Une banque française", "La bourse française où sont cotées les entreprises", "Un fonds d'investissement public", "Le siège social du CAC 40"],
            reponse: 1,
            feedback: "Euronext Paris est la place boursière française. C'est là que s'effectuent les transactions sur les actions des entreprises françaises cotées.",
          },
          {
            question: "Le CAC 40 baisse de 2% en une journée. Qu'est-ce que ça signifie ?",
            options: ["Les 40 entreprises ont perdu 2% de leur chiffre d'affaires", "La valeur moyenne des 40 plus grandes entreprises a reculé de 2%", "TotalEnergies a baissé de 2%", "La France est en récession"],
            reponse: 1,
            feedback: "Le CAC 40 est une moyenne pondérée. Une baisse de 2% signifie que l'ensemble du panier a perdu 2% de valeur en bourse sur la journée.",
          },
          {
            question: "Tu achètes 10 actions LVMH sur ton application broker. À qui achètes-tu réellement ?",
            options: ["Directement à LVMH", "À Bernard Arnault", "À un autre investisseur qui souhaite vendre", "À Euronext Paris"],
            reponse: 2,
            feedback: "Sur le marché secondaire, tu achètes toujours à un autre investisseur. LVMH a reçu son argent au moment de son introduction en bourse.",
          },
        ],
      },
      {
        id: 3,
        title: "PEA vs CTO : quelle enveloppe choisir ?",
        texte: `Avant d'acheter ta première action, tu dois choisir où la loger. En France, tu as deux options principales : le PEA et le CTO.\n\nLe PEA, Plan d'Épargne en Actions, est l'enveloppe fiscale la plus avantageuse. Tu peux y verser jusqu'à 150 000€. Si tu laisses ton argent pendant au moins 5 ans, tes gains sont totalement exonérés d'impôt sur le revenu. Tu paies seulement les prélèvements sociaux de 17,2%. Sur 1 000€ de gain, tu gardes 828€ au lieu de 700€ avec la flat tax. La contrepartie : le PEA est réservé aux actions européennes.\n\nLe CTO, Compte Titres Ordinaire, n'a aucune restriction géographique. Tu peux y acheter des actions américaines, asiatiques, des ETF monde. En revanche, chaque gain est soumis à la flat tax de 30%. Sur 1 000€ de gain, tu gardes 700€.\n\nStratégie recommandée : ouvre un PEA en priorité pour les actions européennes, ajoute un CTO pour les marchés américains.\n\n**La règle à retenir** : ouvre ton PEA le plus tôt possible, même avec 10€. Le compteur des 5 ans commence à la date d'ouverture.`,
        flashcards: [
          { recto: "Quel est le plafond de versement du PEA ?", verso: "150 000€ de versements maximum. Les gains générés au-dessus de ce plafond ne comptent pas, seuls les versements sont plafonnés." },
          { recto: "Quelle est la fiscalité d'un retrait PEA après 5 ans ?", verso: "Exonération d'impôt sur le revenu. Tu paies uniquement les prélèvements sociaux de 17,2%. Sur 1 000€ de gain, tu gardes 828€." },
          { recto: "Pourquoi ouvrir son PEA le plus tôt possible ?", verso: "Le délai de 5 ans commence à la date d'ouverture, pas à la date du premier versement important." },
        ],
        quiz: [
          {
            question: "Tu veux acheter des actions Apple. Quelle enveloppe utilises-tu ?",
            options: ["Le PEA, car Apple est une grande entreprise", "Le CTO, car Apple est américaine et n'est pas éligible au PEA", "Les deux indifféremment", "Ni l'un ni l'autre"],
            reponse: 1,
            feedback: "Le PEA est réservé aux actions de sociétés européennes. Apple, Amazon, Microsoft doivent être logées dans un CTO.",
          },
          {
            question: "Tu réalises 2 000€ de plus-value dans ton PEA après 6 ans. Combien gardes-tu net ?",
            options: ["1 400€ (flat tax 30%)", "2 000€ (aucune taxe)", "1 656€ (prélèvements sociaux 17,2% uniquement)", "1 760€"],
            reponse: 2,
            feedback: "Après 5 ans de PEA, tu es exonéré d'impôt sur le revenu. 2 000€ × (1 - 0,172) = 1 656€ nets.",
          },
          {
            question: "Tu ouvres un PEA aujourd'hui avec 10€. Dans combien d'années bénéficies-tu de l'exonération complète ?",
            options: ["Dans 5 ans à partir de ton premier gros versement", "Dans 5 ans à partir d'aujourd'hui", "Dans 8 ans", "Immédiatement si tu ne retires pas pendant 3 ans"],
            reponse: 1,
            feedback: "Le délai de 5 ans commence à la date d'ouverture du PEA. C'est pourquoi il faut l'ouvrir le plus tôt possible, même symboliquement.",
          },
        ],
      },
      {
        id: 4,
        title: "La flat tax 30% : ce que tu gardes vraiment",
        texte: `Quand tu gagnes de l'argent en bourse hors PEA, l'État prend sa part. Cette part s'appelle la flat tax, ou Prélèvement Forfaitaire Unique (PFU), et elle s'élève à 30% de tes gains.\n\nCes 30% se décomposent en deux morceaux : 12,8% d'impôt sur le revenu et 17,2% de prélèvements sociaux. Sur 1 000€ de plus-value réalisée dans un CTO, tu gardes 700€.\n\nUn point souvent mal compris : tu ne paies la flat tax que sur les gains réalisés, pas sur les gains latents. Tant que tu ne vends pas, tu ne dois rien. C'est ce qu'on appelle la plus-value latente.\n\nAutre subtilité : les dividendes d'actions françaises bénéficient d'un abattement de 40% si tu optes pour le barème progressif. Mais cet abattement disparaît si tu choisis la flat tax.\n\n**La règle à retenir** : flat tax = 30% sur les gains réalisés hors PEA. Dans le PEA, seuls les prélèvements sociaux de 17,2% s'appliquent après 5 ans.`,
        flashcards: [
          { recto: "De quoi se compose la flat tax à 30% ?", verso: "12,8% d'impôt sur le revenu + 17,2% de prélèvements sociaux (CSG, CRDS). Total : 30% prélevés sur tes gains." },
          { recto: "Qu'est-ce qu'une plus-value latente ?", verso: "Un gain non encore réalisé. Tant que tu ne vends pas ton action, tu ne dois aucun impôt, même si elle a beaucoup monté." },
          { recto: "Quelle est la différence de fiscalité entre CTO et PEA après 5 ans ?", verso: "CTO : flat tax de 30% sur les gains. PEA après 5 ans : seulement 17,2% de prélèvements sociaux. Sur 1 000€ de gain : 700€ en CTO contre 828€ en PEA." },
        ],
        quiz: [
          {
            question: "Tu vends des actions dans ton CTO avec 3 000€ de plus-value. Combien paies-tu en flat tax ?",
            options: ["300€", "516€", "900€", "1 000€"],
            reponse: 2,
            feedback: "3 000€ × 30% = 900€ de flat tax. Il te reste 2 100€ nets.",
          },
          {
            question: "Tu possèdes des actions LVMH dans ton CTO qui ont pris 40% de valeur. Tu ne les as pas encore vendues. Combien paies-tu en impôts cette année ?",
            options: ["30% sur la plus-value latente", "17,2% de prélèvements sociaux", "Rien du tout, tu n'as pas encore vendu", "12,8% d'impôt sur le revenu"],
            reponse: 2,
            feedback: "L'imposition ne s'applique qu'au moment de la cession. Tant que tu conserves tes actions, même avec une forte plus-value latente, tu ne dois rien.",
          },
          {
            question: "Tu reçois 500€ de dividendes dans ton PEA ouvert depuis 7 ans. Combien gardes-tu après impôts ?",
            options: ["350€ (flat tax 30%)", "414€ (prélèvements sociaux 17,2%)", "500€ (exonération totale)", "435€"],
            reponse: 1,
            feedback: "Dans un PEA de plus de 5 ans, les dividendes sont exonérés d'impôt sur le revenu. 500€ × (1 - 0,172) = 414€ nets.",
          },
        ],
      },
      {
        id: 5,
        title: "Les 5 mythes sur la bourse",
        texte: `La bourse fait peur. Pas parce qu'elle est dangereuse, mais parce qu'elle est mal comprise. Voici les 5 idées reçues qui empêchent des millions de Français d'investir.\n\n**Mythe 1 : "La bourse c'est du jeu."** Faux. Au casino, l'espérance de gain est négative. En bourse, elle est historiquement positive. Le CAC 40 a rapporté +7% par an sur 30 ans.\n\n**Mythe 2 : "Il faut être riche."** Faux. Aujourd'hui, des brokers permettent d'investir à partir de 1€ grâce aux fractions d'actions.\n\n**Mythe 3 : "C'est trop risqué."** Partiellement vrai, mais seulement si tu investis mal. Un portefeuille diversifié sur 15 à 20 entreprises n'a jamais valu zéro.\n\n**Mythe 4 : "Il faut suivre la bourse tous les jours."** Faux. Warren Buffett achète des entreprises de qualité et attend. L'investisseur qui regarde tous les jours prend plus de mauvaises décisions.\n\n**Mythe 5 : "Les professionnels font toujours mieux."** Faux. Plus de 90% des fonds gérés activement font moins bien que le simple indice sur 10 ans.\n\n**La règle à retenir** : les mythes sur la bourse coûtent cher. Chaque année sans investir est une année de rendement perdue.`,
        flashcards: [
          { recto: "Quelle est la différence fondamentale entre bourse et casino ?", verso: "Au casino, l'espérance de gain est négative sur le long terme. En bourse, elle est historiquement positive. Le CAC 40 a rapporté +7%/an en moyenne sur 30 ans." },
          { recto: "Quel % des fonds actifs font moins bien que leur indice sur 10 ans ?", verso: "Plus de 90% des fonds actifs sous-performent leur indice sur 10 ans. C'est la raison principale pour laquelle les ETF indiciels sont recommandés." },
          { recto: "Quel est le montant minimum pour investir en bourse aujourd'hui ?", verso: "Dès 1€ avec les fractions d'actions disponibles chez des brokers comme Trade Republic ou XTB." },
        ],
        quiz: [
          {
            question: "Le CAC 40 a rapporté en moyenne combien par an sur les 30 dernières années, dividendes réinvestis ?",
            options: ["+2% par an", "+5% par an", "+7% par an", "+12% par an"],
            reponse: 2,
            feedback: "+7% par an en moyenne sur 30 ans. À ce rythme, 10 000€ investis deviennent environ 76 000€ en 30 ans grâce aux intérêts composés.",
          },
          {
            question: "Un portefeuille composé de 20 actions de secteurs différents peut-il tomber à zéro ?",
            options: ["Oui, si la bourse s'effondre complètement", "Non, un portefeuille diversifié n'a historiquement jamais valu zéro", "Oui, c'est déjà arrivé en 2008", "Ça dépend du broker"],
            reponse: 1,
            feedback: "En 2008, les marchés ont chuté de 40 à 50%. Douloureux, mais pas zéro. Un portefeuille diversifié baisse puis remonte. Il ne vaut zéro que si toutes les entreprises font faillite simultanément.",
          },
          {
            question: "Tu investis 10 000€ dans un ETF CAC 40 et tu ne touches plus à rien pendant 20 ans. Avec un rendement de 7%/an, combien vaut ton portefeuille ?",
            options: ["~14 000€", "~24 000€", "~38 700€", "~52 000€"],
            reponse: 2,
            feedback: "10 000€ × (1,07)^20 = 38 697€. La magie des intérêts composés. Ton capital a presque quadruplé sans rien faire.",
          },
        ],
      },
      {
        id: 6,
        title: "Risque et horizon de placement",
        texte: `Le mot "risque" fait fuir la plupart des Français. Pourtant, il y a une distinction fondamentale que personne n'enseigne : la différence entre volatilité et perte permanente.\n\nLa volatilité, c'est le fait que ton portefeuille monte et descend. En mars 2020, le CAC 40 avait perdu 38% en un mois. Pourtant, 14 mois plus tard, il avait entièrement récupéré ses pertes. La perte permanente arrive quand une entreprise fait faillite.\n\nL'horizon de placement change tout. Sur n'importe quelle période de 1 an, le CAC 40 a été négatif 30% du temps. Sur 5 ans : 15% du temps. Sur 10 ans : moins de 5%. Sur 15 ans et plus : historiquement jamais négatif.\n\nConcrètement : n'investis en bourse que l'argent dont tu n'as pas besoin dans les 5 prochaines années minimum.\n\n**La règle à retenir** : le temps est ton meilleur allié en bourse. Plus ton horizon est long, plus le risque de perte diminue.`,
        flashcards: [
          { recto: "Quelle est la différence entre volatilité et perte permanente ?", verso: "La volatilité est une fluctuation temporaire du cours. La perte permanente arrive quand une entreprise fait faillite. Un portefeuille diversifié peut être volatile sans jamais subir de perte permanente." },
          { recto: "En mars 2020, le CAC 40 a perdu combien ? En combien de temps a-t-il récupéré ?", verso: "38% en un mois. Il a récupéré intégralement en 14 mois. Un investisseur qui n'a pas vendu n'a subi aucune perte réelle." },
          { recto: "Sur une période de 15 ans ou plus, le CAC 40 a-t-il déjà été négatif ?", verso: "Quasi jamais historiquement. Sur des horizons longs, la bourse a toujours été positive." },
        ],
        quiz: [
          {
            question: "En mars 2020, ton portefeuille de 10 000€ perd 38%. Quelle est la meilleure décision ?",
            options: ["Vendre immédiatement pour limiter les pertes", "Ne rien faire et attendre, ta thèse n'a pas changé", "Racheter les mêmes actions dans un autre broker", "Convertir en or et livret A"],
            reponse: 1,
            feedback: "Vendre en mars 2020 aurait cristallisé une perte de 3 800€. Les investisseurs qui ont tenu ont récupéré en 14 mois. La panique est l'ennemie du rendement.",
          },
          {
            question: "Tu as besoin de 5 000€ dans 2 ans pour un projet. Que fais-tu avec cet argent ?",
            options: ["Tu l'investis en bourse", "Tu le places sur un livret A", "Tu achètes des ETF diversifiés", "Tu le mets en cryptomonnaies"],
            reponse: 1,
            feedback: "L'argent dont tu as besoin à court terme ne doit jamais aller en bourse. Sur 2 ans, le risque de perte est réel. Le livret A est parfaitement adapté.",
          },
          {
            question: "Sur quelle période le CAC 40 n'a quasi jamais été négatif historiquement ?",
            options: ["3 ans", "5 ans", "10 ans", "15 ans et plus"],
            reponse: 3,
            feedback: "Sur 15 ans et plus, la bourse française n'a historiquement jamais déçu un investisseur patient et diversifié.",
          },
        ],
      },
      {
        id: 7,
        title: "Les intermédiaires : broker, AMF, dépositaire",
        texte: `Avant de passer ton premier ordre, une question légitime se pose : à qui confies-tu ton argent, et que se passe-t-il si ton broker fait faillite ?\n\nLe broker est l'intermédiaire qui te permet d'accéder aux marchés. Trade Republic, XTB, Boursobank sont tous des brokers. Ce que la plupart des gens ne savent pas : tes actions n'appartiennent pas au broker. Elles sont conservées par un dépositaire, une entité distincte.\n\nSi ton broker fait faillite demain, tes actions existent toujours chez le dépositaire, à ton nom. Tu peux les transférer vers un autre broker.\n\nL'AMF, Autorité des Marchés Financiers, est le gendarme de la bourse française. Avant de choisir un broker, vérifie qu'il est bien enregistré sur le registre REGAFI de l'AMF. En cas de faillite d'un broker régulé, le FGDR protège tes titres jusqu'à 70 000€.\n\n**La règle à retenir** : tes actions t'appartiennent, pas à ton broker. Vérifie toujours que ton broker est régulé AMF ou CySEC.`,
        flashcards: [
          { recto: "Que se passe-t-il pour tes actions si ton broker fait faillite ?", verso: "Tes actions ne sont pas perdues. Elles sont conservées par un dépositaire distinct, à ton nom. Tu peux les transférer vers un autre broker." },
          { recto: "Quel est le rôle de l'AMF ?", verso: "L'Autorité des Marchés Financiers protège les investisseurs, surveille les marchés, sanctionne les abus et tient le registre des brokers autorisés en France." },
          { recto: "Jusqu'à quel montant tes titres sont-ils garantis en cas de faillite d'un broker régulé ?", verso: "70 000€ via le Fonds de Garantie des Dépôts et de Résolution (FGDR)." },
        ],
        quiz: [
          {
            question: "Tu possèdes 15 000€ d'actions dans ton compte XTB. XTB fait faillite. Que se passe-t-il ?",
            options: ["Tu perds tout", "Tes actions sont protégées jusqu'à 70 000€ et conservées chez le dépositaire", "Tu récupères uniquement 10% de tes actifs", "Tes actions sont automatiquement vendues"],
            reponse: 1,
            feedback: "Tes actions t'appartiennent. Elles sont conservées par un dépositaire distinct de XTB. Le FGDR garantit tes titres jusqu'à 70 000€.",
          },
          {
            question: "Un broker te promet 15% de rendement garanti par mois sur Instagram. Ta première réaction ?",
            options: ["Tester avec une petite somme", "Vérifier qu'il est enregistré sur le registre AMF", "Demander des témoignages clients", "Vérifier s'il a beaucoup de followers"],
            reponse: 1,
            feedback: "Un rendement garanti de 15% par mois est une arnaque quasi certaine. La première vérification est de consulter le registre REGAFI de l'AMF sur amf-france.org.",
          },
          {
            question: "Quelle est la différence entre broker et dépositaire ?",
            options: ["Ce sont deux noms pour la même entité", "Le broker exécute tes ordres, le dépositaire conserve tes titres en sécurité", "Le broker garde tes actions, le dépositaire exécute tes ordres", "Le dépositaire c'est l'AMF"],
            reponse: 1,
            feedback: "Le broker est ton intermédiaire de marché. Le dépositaire conserve tes titres séparément des actifs du broker. Cette séparation est imposée par la loi européenne.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Lire un cours d'action",
    description: "PER, rendement, 52 semaines, résultats trimestriels. Décrypter une fiche comme un analyste.",
    free: true,
    lecons: [
      {
        id: 1,
        title: "Le cours, le volume, la capitalisation",
        texte: `Quand tu ouvres une fiche action sur ton broker, trois chiffres s'imposent immédiatement : le cours, le volume et la capitalisation boursière.\n\nLe cours, c'est simplement le prix auquel s'échange une action à un instant précis. Ce prix change en permanence pendant les heures d'ouverture des marchés, du lundi au vendredi de 9h à 17h30 heure française.\n\nLe volume, c'est le nombre d'actions échangées sur une journée. Un volume élevé accompagnant une forte hausse envoie un signal bien plus puissant qu'une hausse sur faible volume.\n\nLa capitalisation boursière, c'est la valeur totale de l'entreprise aux yeux du marché. Elle se calcule : cours × nombre total d'actions en circulation. LVMH à 629€ avec 500 millions d'actions = 314 milliards€ de capitalisation.\n\n**La règle à retenir** : cours = prix actuel, volume = activité du jour, capitalisation = taille perçue de l'entreprise.`,
        flashcards: [
          { recto: "Comment calcule-t-on la capitalisation boursière ?", verso: "Cours × nombre total d'actions en circulation. Exemple : 629€ × 500 millions d'actions = 314,5 milliards€." },
          { recto: "Qu'indique un volume d'échange inhabituellement élevé ?", verso: "Un fort intérêt des investisseurs pour cette action. Une hausse avec volume élevé est un signal plus fiable qu'une hausse sur faible volume." },
          { recto: "Une action à 5€ est-elle moins chère qu'une à 500€ ?", verso: "Pas forcément. Le cours seul ne dit rien sur la taille de l'entreprise. Ce qui compte c'est la capitalisation : cours × nombre d'actions." },
        ],
        quiz: [
          {
            question: "TotalEnergies affiche un cours de 56€ et 2,6 milliards d'actions en circulation. Quelle est sa capitalisation ?",
            options: ["56 milliards€", "145,6 milliards€", "2,6 milliards€", "560 millions€"],
            reponse: 1,
            feedback: "56€ × 2,6 milliards d'actions = 145,6 milliards€ de capitalisation boursière.",
          },
          {
            question: "Les marchés français sont ouverts de quelle heure à quelle heure ?",
            options: ["8h à 18h", "9h à 17h30", "9h30 à 16h", "8h30 à 17h"],
            reponse: 1,
            feedback: "Euronext Paris est ouvert du lundi au vendredi de 9h à 17h30 heure française.",
          },
          {
            question: "Une action monte de 3% avec un volume 3 fois supérieur à la moyenne. Qu'est-ce que ça suggère ?",
            options: ["Une manipulation du marché", "Un signal haussier fort, probablement des achats institutionnels", "Que l'action va baisser le lendemain", "Que l'entreprise verse un dividende"],
            reponse: 1,
            feedback: "Volume élevé sur une hausse signifie conviction. Beaucoup d'investisseurs achètent simultanément, ce qui renforce la crédibilité du mouvement.",
          },
        ],
      },
      {
        id: 2,
        title: "Le PER : est-ce que l'action est chère ?",
        texte: `Le PER, Price Earnings Ratio, est le ratio le plus utilisé en bourse pour évaluer si une action est chère ou bon marché. Il répond à une question simple : combien paies-tu pour chaque euro de bénéfice annuel ?\n\nCalcul : PER = Cours / Bénéfice Par Action (BPA). Si une action vaut 100€ et l'entreprise génère 5€ de bénéfice par action, le PER est de 20.\n\nLes ordres de grandeur en France : PER inférieur à 10 = secteurs matures (banques, énergie). Entre 15 et 25 = entreprise solide dans la moyenne. Supérieur à 30 = anticipations de forte croissance. LVMH tourne à 22x, TotalEnergies à 8x, Hermès à 50x.\n\nAttention aux deux pièges : un PER bas n'est pas forcément une opportunité (value trap), et comparer des PER de secteurs différents n'a aucun sens.\n\n**La règle à retenir** : le PER mesure ce que tu paies pour les bénéfices. Toujours comparer dans le même secteur.`,
        flashcards: [
          { recto: "Comment calcule-t-on le PER ?", verso: "PER = Cours / Bénéfice Par Action. Un PER de 20 signifie que tu paies 20€ pour chaque euro de bénéfice annuel." },
          { recto: "Qu'est-ce qu'un value trap ?", verso: "Une action qui semble bon marché à cause d'un PER bas, mais qui l'est parce que l'entreprise est en difficulté structurelle." },
          { recto: "Pourquoi ne pas comparer des PER de secteurs différents ?", verso: "Chaque secteur a ses niveaux normaux. Un PER de 30 est élevé pour une banque mais normal pour une tech en forte croissance." },
        ],
        quiz: [
          {
            question: "Une action vaut 80€. L'entreprise génère 4€ de bénéfice par action. Quel est son PER ?",
            options: ["4", "20", "80", "320"],
            reponse: 1,
            feedback: "PER = 80€ / 4€ = 20. Tu paies 20€ pour chaque euro de bénéfice annuel.",
          },
          {
            question: "TotalEnergies a un PER de 7x et Hermès de 50x. Quelle conclusion tires-tu ?",
            options: ["TotalEnergies est une meilleure opportunité", "Hermès est surévalué", "Ces deux PER ne sont pas comparables car les secteurs sont différents", "TotalEnergies va doubler"],
            reponse: 2,
            feedback: "Comparer le PER d'une entreprise énergétique avec celui du luxe n'a aucun sens. La comparaison doit se faire au sein du même secteur.",
          },
          {
            question: "Une action affiche un PER de 5x, bien en dessous de la moyenne sectorielle de 15x. Quelle est la bonne réaction ?",
            options: ["Acheter immédiatement, c'est une aubaine", "Vérifier pourquoi le PER est si bas avant d'agir", "Éviter, un PER bas = faillite", "Le PER n'a aucune importance"],
            reponse: 1,
            feedback: "Un PER anormalement bas mérite investigation. L'entreprise est peut-être sous-évaluée, mais peut-être aussi en difficulté structurelle.",
          },
        ],
      },
      {
        id: 3,
        title: "Le rendement du dividende",
        texte: `Le dividende est souvent la première chose que regardent les investisseurs français. Le rendement du dividende se calcule : dividende annuel / cours actuel × 100. TotalEnergies verse environ 3€ par action. Avec un cours à 56€, le rendement est de 5,4%.\n\nUn rendement entre 2% et 4% est considéré comme sain. Au-delà de 6%, le rendement devient suspect : l'action a peut-être fortement baissé, ce qui gonfle mécaniquement le ratio. C'est le dividend trap.\n\nLe payout ratio est indispensable : dividende / bénéfice par action. Un payout ratio de 50% est sain. Un payout ratio de 95% est fragile : le moindre ralentissement force une coupe du dividende.\n\n**La règle à retenir** : un rendement élevé n'est pas forcément une bonne nouvelle. Toujours vérifier le payout ratio avant de se laisser séduire.`,
        flashcards: [
          { recto: "Comment calcule-t-on le rendement du dividende ?", verso: "Dividende annuel par action / cours actuel × 100. Exemple : 3€ / 56€ = 5,4% de rendement." },
          { recto: "Qu'est-ce qu'un dividend trap ?", verso: "Une action dont le rendement élevé est dû à une forte baisse du cours. L'entreprise est souvent en difficulté et risque de couper son dividende." },
          { recto: "Qu'est-ce que le payout ratio ?", verso: "La part des bénéfices reversée en dividendes. Un ratio supérieur à 80-90% signifie que le dividende est fragile en cas de ralentissement." },
        ],
        quiz: [
          {
            question: "BNP verse 4€ de dividende. Le cours est à 65€. Quel est le rendement ?",
            options: ["4%", "6,15%", "16,25%", "0,4%"],
            reponse: 1,
            feedback: "4€ / 65€ × 100 = 6,15% de rendement. C'est élevé. Il faut vérifier que le payout ratio reste raisonnable.",
          },
          {
            question: "Une action affiche un rendement de 12%. Quelle est ta première réaction ?",
            options: ["Acheter immédiatement", "Vérifier si ce rendement élevé est dû à une forte baisse du cours", "Éviter absolument", "Attendre que le rendement redescende"],
            reponse: 1,
            feedback: "Un rendement de 12% est presque toujours le signe que le cours a fortement baissé. Avant d'y voir une opportunité, vérifie pourquoi.",
          },
          {
            question: "Une entreprise génère 10€ de bénéfice et verse 9€ de dividende. Que signifie un payout ratio de 90% ?",
            options: ["Le dividende est très généreux et durable", "Le dividende est fragile car l'entreprise distribue presque tout ce qu'elle gagne", "L'entreprise réinvestit massivement", "Le dividende est financé par la dette"],
            reponse: 1,
            feedback: "Payout ratio de 90% = l'entreprise distribue 90% de ses bénéfices. Le moindre recul des résultats et le dividende sera coupé.",
          },
        ],
      },
      {
        id: 4,
        title: "Le 52 semaines high/low",
        texte: `Sur toute fiche action, tu trouveras deux chiffres discrets mais utiles : le plus haut et le plus bas atteints sur les 52 dernières semaines. Ces deux bornes donnent immédiatement un contexte que le cours seul ne peut pas offrir.\n\nAirbus affiche un cours de 162€. Son 52 semaines high est à 185€ et son low à 124€. L'action est à 12% sous son plus haut et à 31% au-dessus de son plus bas. Elle est dans le tiers supérieur de sa fourchette annuelle.\n\nDeux lectures opposées sont possibles. Un investisseur value dira qu'une action proche de son plus bas mérite d'être regardée. Un investisseur momentum dira qu'une action proche de son plus haut témoigne d'une dynamique forte.\n\nMais le 52 semaines ne donne pas de signal en lui-même. Il contextualise. Une action à son plus bas peut être une opportunité ou un désastre en cours.\n\n**La règle à retenir** : le 52 semaines contextualise le cours actuel. Utilise-le comme point de départ, jamais comme signal seul.`,
        flashcards: [
          { recto: "Qu'est-ce que le 52 semaines high/low ?", verso: "Le prix le plus haut et le plus bas atteints par une action sur les 12 derniers mois. Ces bornes permettent de situer le cours dans sa trajectoire récente." },
          { recto: "Une action est à 20% sous son 52 semaines high. Qu'est-ce que ça signifie ?", verso: "Rien en soi. L'action a baissé de 20% depuis son plus haut annuel. La raison de cette baisse est tout ce qui compte." },
          { recto: "Différence entre investisseur value et momentum face au 52 semaines ?", verso: "Value : s'intéresse aux actions proches du plus bas. Momentum : préfère les actions proches du plus haut. Les deux approches sont valides." },
        ],
        quiz: [
          {
            question: "Une action affiche 45€, un high de 72€ et un low de 38€. De combien est-elle sous son plus haut ?",
            options: ["27%", "37,5%", "18,4%", "60%"],
            reponse: 1,
            feedback: "(72 - 45) / 72 × 100 = 37,5% sous le plus haut annuel. La question à poser : pourquoi cette baisse ?",
          },
          {
            question: "TotalEnergies est à son 52 semaines low. Quelle est la bonne réaction ?",
            options: ["Acheter immédiatement", "Vendre, elle va continuer à baisser", "Comprendre pourquoi avant de décider", "Ignorer cette information"],
            reponse: 2,
            feedback: "Le 52 semaines low n'est pas un signal d'achat automatique. Il faut comprendre la cause avant d'agir.",
          },
          {
            question: "Une action est à 2% de son 52 semaines high. Un investisseur momentum y voit :",
            options: ["Un signal de vente", "Un signal de force, la dynamique haussière est intacte", "Une action surévaluée", "Une action trop chère"],
            reponse: 1,
            feedback: "Pour un investisseur momentum, proche du plus haut = dynamique positive. Les acheteurs restent actifs, la tendance est haussière.",
          },
        ],
      },
      {
        id: 5,
        title: "Lire un résumé de résultats trimestriels",
        texte: `Quatre fois par an, chaque entreprise cotée publie ses résultats. C'est le moment le plus important du calendrier boursier. Les cours peuvent bouger de 5 à 10% en quelques minutes.\n\nLe chiffre d'affaires est la somme totale des ventes, avant déduction de quoi que ce soit. Une hausse du CA signifie que l'entreprise vend davantage, mais pas forcément qu'elle gagne plus.\n\nL'EBITDA est ce que l'entreprise génère de son activité opérationnelle pure, avant les charges financières et comptables.\n\nLe résultat net est ce qui reste une fois que tout a été payé. Le bénéfice par action (BPA) est le résultat net divisé par le nombre d'actions — c'est lui que les analystes suivent le plus.\n\nCe que les médias ne disent pas : les résultats se lisent toujours par rapport aux anticipations des analystes. Une entreprise peut publier un bénéfice record et voir son action baisser si ce bénéfice est inférieur aux prévisions.\n\n**La règle à retenir** : lis les résultats en trois temps : chiffres bruts, comparaison avec les attentes, puis la guidance.`,
        flashcards: [
          { recto: "Différence entre chiffre d'affaires et résultat net ?", verso: "Le CA est le total des ventes avant déduction. Le résultat net est ce qui reste après toutes les charges et impôts." },
          { recto: "Qu'est-ce que le concept de beat or miss ?", verso: "Les résultats se lisent par rapport aux attentes des analystes. Beat = dépasse les prévisions. Miss = déçoit, même si les chiffres absolus sont positifs." },
          { recto: "Qu'est-ce que la guidance ?", verso: "La prévision que la direction donne pour les prochains trimestres. Souvent plus importante que les résultats passés car elle oriente les anticipations." },
        ],
        quiz: [
          {
            question: "LVMH publie un CA en hausse de 8% mais un résultat net en baisse de 3%. Quelle interprétation ?",
            options: ["LVMH se porte très bien", "LVMH vend plus mais gagne moins, ses coûts ont augmenté plus vite", "LVMH va forcément baisser", "CA et résultat net évoluent toujours ensemble"],
            reponse: 1,
            feedback: "CA en hausse + résultat net en baisse = les coûts ont augmenté plus vite que les ventes. Il faut lire le détail pour comprendre si c'est temporaire.",
          },
          {
            question: "Airbus publie un BPA de 6€ en hausse de 15%. Les analystes attendaient 6,80€. Que va faire le cours ?",
            options: ["Monter fortement", "Rester stable", "Baisser, l'entreprise a déçu malgré la hausse", "Ça dépend du pétrole"],
            reponse: 2,
            feedback: "C'est un miss. Même si le BPA progresse de 15%, il est inférieur aux 6,80€ attendus. Le marché sanctionne la déception par rapport aux attentes.",
          },
          {
            question: "Une entreprise publie des chiffres conformes aux attentes mais révise sa guidance à la baisse. Réaction probable ?",
            options: ["Positive", "Neutre", "Négative, la guidance à la baisse inquiète plus que les résultats conformes ne rassurent", "Très positive"],
            reponse: 2,
            feedback: "La guidance pèse souvent plus lourd que les résultats passés. Les investisseurs achètent l'avenir. Une révision à la baisse fait vendre même si les résultats sont bons.",
          },
        ],
      },
      {
        id: 6,
        title: "Consensus analystes et objectif de cours",
        texte: `Sur toute fiche action tu verras une section "recommandations des analystes" avec "Achat fort", "Conserver" ou "Vendre", accompagnées d'un objectif de cours. Ces informations sont utiles à condition de savoir les lire.\n\nUn analyste financier publie des notes dans lesquelles il donne son opinion et un objectif de cours à 12 mois. Le consensus est la moyenne de tous les objectifs publiés.\n\nTrois points essentiels. D'abord, les analystes ont des conflits d'intérêts : les recommandations "Vendre" sont rarissimes même pour des entreprises en difficulté. Ensuite, les modèles sont construits sur des données historiques et tardent à s'adapter aux ruptures. Enfin, un consensus unanimement positif signifie souvent que les bonnes nouvelles sont déjà intégrées dans le cours.\n\n**La règle à retenir** : le consensus est un outil de contexte, pas un signal d'achat ou de vente.`,
        flashcards: [
          { recto: "Qu'est-ce que le consensus analystes ?", verso: "La moyenne des objectifs de cours et recommandations publiés par l'ensemble des analystes qui suivent une action." },
          { recto: "Pourquoi les recommandations Vendre sont-elles si rares ?", verso: "Les analystes travaillent pour des banques qui ont souvent des relations commerciales avec les entreprises qu'ils couvrent. C'est un conflit d'intérêts structurel." },
          { recto: "Que signifie un consensus unanimement positif ?", verso: "Souvent que les bonnes nouvelles sont déjà dans le cours. Quand tout le monde est positif, les acheteurs ont probablement déjà acheté." },
        ],
        quiz: [
          {
            question: "12 analystes suivent Airbus. 8 recommandent l'achat, objectif moyen 185€ pour un cours à 162€. Que retiens-tu ?",
            options: ["Acheter immédiatement", "Le consensus suggère 14% de hausse, à croiser avec ta propre analyse", "Vendre, 1 analyste recommande de vendre", "Ignorer, les analystes se trompent toujours"],
            reponse: 1,
            feedback: "Le consensus est un point de données utile, pas une décision. Un potentiel de 14% est encourageant mais il faut comprendre la thèse de chaque analyste.",
          },
          {
            question: "Une banque vient d'accompagner une entreprise dans une augmentation de capital et publie 'Achat fort'. Ta réaction ?",
            options: ["Faire confiance", "Prendre avec prudence car conflit d'intérêts évident", "Vendre immédiatement", "C'est interdit par les régulateurs"],
            reponse: 1,
            feedback: "C'est un conflit d'intérêts classique. La banque a intérêt à ce que l'action soit bien perçue. Sa recommandation mérite d'être croisée avec des avis indépendants.",
          },
          {
            question: "Le consensus sur une action est unanimement négatif (15/15 vendre). Pour un investisseur value, ça implique :",
            options: ["Vendre immédiatement", "C'est potentiellement intéressant, les mauvaises nouvelles sont peut-être déjà dans le cours", "Acheter en grande quantité", "Aucune conclusion possible"],
            reponse: 1,
            feedback: "Quand le consensus est unanimement négatif, les vendeurs ont souvent déjà vendu. Si tu identifies que la situation va s'améliorer avant le consensus, tu as trouvé une opportunité.",
          },
        ],
      },
      {
        id: 7,
        title: "Analyse complète d'une action CAC 40",
        texte: `Cette leçon est différente. Pas de nouveau concept — tu as déjà tous les outils. L'objectif est de les assembler sur une vraie entreprise française.\n\nOn prend BNP Paribas. Cours actuel : environ 64€. Capitalisation : environ 60 milliards€. 52 semaines : high 73€, low 52€. L'action est dans le milieu de sa fourchette annuelle.\n\nPER de 7x, cohérent avec le secteur bancaire (6-10x). Dividende de 4€, rendement 6,25%, payout ratio 50% — durable. Résultats récents stables, conformes aux attentes. Consensus : 18 analystes sur 25 recommandent l'achat, objectif 74€ soit +15% de potentiel.\n\nPoints de vigilance : sensibilité aux taux (la baisse de la BCE comprime les marges), exposition aux marchés émergents, risque réglementaire.\n\nConclusion : cohérent avec une stratégie de revenus dans un PEA sur horizon 5 ans.\n\n**La règle à retenir** : une bonne analyse structure le raisonnement. Elle ne donne pas de certitude, elle permet de décider de façon éclairée plutôt qu'émotionnelle.`,
        flashcards: [
          { recto: "Quelles sont les 7 étapes d'une analyse complète ?", verso: "1. Contexte. 2. Cours et données de base. 3. PER. 4. Dividende et payout ratio. 5. Résultats récents. 6. Consensus analystes. 7. Points de vigilance." },
          { recto: "Pourquoi le secteur bancaire traite à des PER bas (6-10x) ?", verso: "Les banques sont cycliques, fortement régulées, sensibles aux taux. Cette incertitude structurelle se traduit par une décote permanente." },
          { recto: "Qu'est-ce qu'un verdict personnel dans une fiche analyse ?", verso: "La conclusion que tu tires toi-même après avoir assemblé tous les éléments, cohérente avec ta stratégie et ton horizon de placement." },
        ],
        quiz: [
          {
            question: "BNP a un PER de 7x dans un secteur qui traite à 8x en moyenne. Qu'est-ce que ça indique ?",
            options: ["BNP est surévaluée", "BNP est légèrement décotée par rapport à ses pairs, ce qui mérite investigation", "Le PER de 7x est trop bas", "Le PER n'est pas pertinent pour les banques"],
            reponse: 1,
            feedback: "Une légère décote par rapport au secteur peut indiquer une opportunité si les fondamentaux sont solides.",
          },
          {
            question: "La BCE annonce des baisses de taux pour 18 mois. Impact anticipé sur BNP ?",
            options: ["Positif, les baisses stimulent l'économie", "Négatif à court terme, les marges nettes d'intérêt se compriment", "Aucun impact", "Très positif"],
            reponse: 1,
            feedback: "Les banques gagnent sur l'écart entre taux d'emprunt et taux de prêt. Quand les taux baissent, cet écart se comprime, réduisant les marges.",
          },
          {
            question: "Tu conclus que BNP est adaptée à une stratégie de revenus dans un PEA sur 5 ans. Quelle information valide principalement ça ?",
            options: ["Le PER de 7x", "Le dividende de 6,25% avec un payout ratio de 50%", "Le consensus positif", "La position dans la fourchette 52 semaines"],
            reponse: 1,
            feedback: "Pour une stratégie de revenus, le dividende est central. 6,25% avec un payout ratio de 50% = bien couvert et durable. Dans un PEA après 5 ans, ce dividende sera exonéré d'impôt sur le revenu.",
          },
        ],
      },
    ],
  },
]
