export type Actu = {
  id: string
  date: string
  titre: string
  resume: string
  lecon_liee: { module: number; lecon: number; titre: string }
  tag: string
  tag_color: string
}

export const actus: Actu[] = [
  {
    id: '1',
    date: '15 avril 2026',
    titre: 'TotalEnergies publie ses résultats T1 2026 — BPA en hausse de 4% malgré la baisse du pétrole',
    resume: 'Le géant pétrolier affiche un BPA de 1,72€ vs 1,68€ attendu. Le dividende est maintenu à 0,85€/trimestre. Un cas réel pour appliquer la leçon sur les alertes résultats de la Boussole.',
    lecon_liee: { module: 6, lecon: 3, titre: 'Lire les alertes résultats' },
    tag: 'Résultats',
    tag_color: '#3B3BF9',
  },
  {
    id: '2',
    date: '10 avril 2026',
    titre: 'La BCE maintient ses taux à 2,5% — Impact direct sur les valorisations DCF',
    resume: 'La BCE décide de ne pas baisser ses taux ce mois-ci. Un taux directeur plus élevé augmente le WACC utilisé dans les modèles DCF et donc réduit mécaniquement la valeur intrinsèque des entreprises.',
    lecon_liee: { module: 3, lecon: 2, titre: 'Le DCF simplifié' },
    tag: 'Macro',
    tag_color: '#FFD700',
  },
  {
    id: '3',
    date: '8 avril 2026',
    titre: 'Hermès bat le consensus — Marge opérationnelle record à 42,3%',
    resume: 'Hermès publie une marge opérationnelle de 42,3%, en hausse de 2 points vs l\'année dernière. Un cas concret pour comprendre pourquoi les marges stables sur 10 ans révèlent un moat puissant.',
    lecon_liee: { module: 3, lecon: 6, titre: 'L\'avantage concurrentiel (le moat)' },
    tag: 'Luxe',
    tag_color: '#FFD700',
  },
  {
    id: '4',
    date: '3 avril 2026',
    titre: 'Amundi lance un nouvel ETF MSCI World à 0,07% de frais — Encore moins cher',
    resume: 'La baisse des frais des ETF continue. Amundi lance une nouvelle classe d\'actifs MSCI World à 0,07% de frais annuels. La différence avec un fonds actif à 1,8% représente des dizaines de milliers d\'euros sur 20 ans.',
    lecon_liee: { module: 4, lecon: 2, titre: 'Les ETF : investir sur un indice entier' },
    tag: 'ETF',
    tag_color: '#00D47E',
  },
  {
    id: '5',
    date: '28 mars 2026',
    titre: 'Le plafond du PEA porté à 200 000€ — Ce que ça change pour toi',
    resume: 'Une proposition de loi vise à relever le plafond du PEA de 150 000€ à 200 000€. Si adoptée, cela permettrait d\'y loger encore plus de plus-values exonérées d\'IR. L\'occasion de revoir les avantages de cette enveloppe.',
    lecon_liee: { module: 1, lecon: 3, titre: 'PEA et CTO : les deux enveloppes' },
    tag: 'Fiscalité',
    tag_color: '#00D47E',
  },
]
