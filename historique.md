# Historique du projet - Apprendre Make

## Contexte
Landing page pour la formation "Apprendre Make" de Lilian Sevoumian.
- **Stack** : Astro 5 + Tailwind CSS 4
- **Prix** : 499€ HT (normal) / 2590€ (CPF)
- **Formateur** : Lilian Sevoumian, certifié Make Partner

---

## Travail effectué

### 1. Structure de la landing page
- Hero avec proposition de valeur
- Section Problème (framework PAS)
- Section About (histoire authentique du formateur)
- Programme détaillé en accordéon (5 phases, 106 leçons calculées)
- Témoignages clients (3 témoignages avec résultats concrets)
- Pricing avec toggle Normal/CPF
- FAQ (objections transformées en questions)
- CTA Final
- Footer

### 2. Responsive mobile
- Corrigé overflow horizontal (overflow-x: hidden sur html/body)
- Grilles adaptatives (grid-cols-1 sur mobile)
- Taille de titre réduite sur mobile (text-[1.625rem])
- Footer avec safe-area pour iOS
- Vidéo masquée sur mobile dans Pricing

### 3. Modifications de contenu
| Avant | Après |
|-------|-------|
| 106 leçons | + de 90 leçons |
| "Vous décidez les prochains cours" | Supprimé |
| Prix CPF 2490€ | 2590€ |
| "100% financé par CPF" | "Éligible au financement CPF" |
| Bouton "Appel découverte" CPF | Supprimé |
| CTAs noirs | CTAs violet (violet-600) |

### 4. Liens checkout
- Normal : `https://lilian.yt/paiementmake?ref=siteweb`
- CPF : `https://lilian.yt/makecpf?ref=siteweb`

### 5. SEO
- Meta description optimisée
- Open Graph tags (Facebook/Twitter)
- URL prévue : `https://apprendremake.com`

### 6. Déploiement
- Git initialisé
- Repo GitHub : `liliansev/apprendremake`
- Remote HTTPS : `https://github.com/liliansev/apprendremake.git`
- `vercel.json` configuré pour Astro

---

## Fichiers clés

```
/src
  /components
    Hero.astro          # Section hero avec badges et CTA
    Probleme.astro      # 3 pain points (PAS framework)
    About.astro         # Histoire du formateur
    Programme.astro     # 5 phases, accordéon
    Temoignages.astro   # 3 témoignages
    Pricing.astro       # Toggle Normal/CPF + cartes prix
    FAQ.astro           # 6 questions/réponses
    CTAFinal.astro      # CTA de conversion final
    Footer.astro        # Footer minimal
    LogosTrustBar.astro # Logos outils compatibles
  /layouts
    Layout.astro        # Layout principal avec SEO
  /pages
    index.astro         # Page unique
  /styles
    global.css          # Tailwind + custom theme
```

---

## À faire (optionnel)
- [ ] Ajouter `og-image.png` (1200x630px) dans `/public/`
- [ ] Ajouter vraie photo de Lilian dans About
- [ ] Configurer domaine custom sur Vercel
- [ ] Tester sur vrais devices

---

## Commandes utiles

```bash
# Dev
cd /Users/a1207/CODE/landings/apprendremake
pnpm dev --host --port 3333

# Build
pnpm build

# Push
git add -A && git commit -m "message" && git push origin main
```

---

## Note technique
Le shell Claude était bloqué car le dossier original `apprendre make` (avec espace) a été renommé en `apprendremake`. L'ancien chemin n'existe plus, ce qui casse la session shell persistante.

**Solution** : L'utilisateur doit exécuter les commandes git manuellement ou démarrer une nouvelle session Claude.
