# Best Practices - Landing Page Astro

Documentation des apprentissages et bonnes pratiques pour ce projet de landing page.

---

## Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Framework | Astro 5 |
| Styling | Tailwind CSS 4 |
| Icônes | astro-icon (Lucide + Simple Icons) |
| Images | Sharp (optimisation auto) |

---

## Architecture des composants

```
src/
├── components/
│   ├── ui/                    # Composants réutilisables
│   │   ├── GridBackground.astro
│   │   └── LightGridBackground.astro
│   ├── Hero.astro
│   ├── Programme.astro
│   ├── Pricing.astro
│   ├── FAQ.astro
│   ├── Testimonials.astro
│   ├── CTAButton.astro
│   └── Navbar.astro
├── layouts/
│   └── Layout.astro
└── pages/
    └── index.astro
```

---

## Composants à privilégier

### CTAButton
Bouton CTA réutilisable avec variants :
- `variant="primary"` : fond violet, texte blanc
- `variant="outline"` : bordure, fond transparent
- Props : `href`, `text`, `icon`, `iconPosition`, `fullWidth`, `animated`

### GridBackground
Grille subtile pour fond dark mode :
- `opacity` : 2-10 (défaut: 8)
- Inclut un mask radial pour fondu vers les bords
- Toujours ajouter un overlay radial par-dessus

```astro
<GridBackground opacity={8} />
<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_70%)]"></div>
```

### Stack d'icônes (Apps/Logos)
Pour afficher des logos d'apps qui défilent :
```astro
import { Icon } from "astro-icon/components";

const apps = [
    { name: "Notion", icon: "simple-icons:notion" },
    { name: "Slack", icon: "simple-icons:slack" },
    // ...
];

<!-- Dupliquer le tableau pour boucle infinie -->
{[...apps, ...apps].map((app) => (
    <Icon name={app.icon} class="w-5 h-5" />
))}
```

Animation CSS pour scroll infini :
```css
@keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.animate-scroll {
    animation: scroll 40s linear infinite;
}
```

---

## Patterns d'animation

### Mot rotatif (sans décalage du texte)

**Problème** : Quand un mot change de taille, le texte autour bouge.

**Solution** : Spacer invisible avec le mot le plus long :
```html
<span class="relative inline-block">
    <!-- Spacer invisible fixe la largeur -->
    <span class="invisible" aria-hidden="true">motlepluslong</span>
    <!-- Mot visible positionné par-dessus -->
    <span id="rotating-word" class="absolute left-0 top-0">CRM</span>
</span>
```

**Animation JS** :
```javascript
const animateWord = () => {
    // Sortie rapide vers le bas
    el.style.transition = "opacity 0.15s ease-in, transform 0.15s ease-in";
    el.style.opacity = "0";
    el.style.transform = "translateY(50%)";

    setTimeout(() => {
        // Prépare nouveau mot en haut
        el.style.transition = "none";
        el.style.transform = "translateY(-30%)";
        el.textContent = words[nextIndex];

        el.offsetHeight; // Force reflow

        // Entrée smooth
        el.style.transition = "opacity 0.2s ease-out, transform 0.2s ease-out";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
    }, 150);
};

setInterval(animateWord, 1800); // Intervalle entre mots
```

### Compteur animé (0 → N)

```javascript
const animateCounter = (target, duration, suffix = "") => {
    const el = document.getElementById("counter");
    const startTime = performance.now();

    const tick = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        // Easing out cubic pour finir en douceur
        const easeOut = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(easeOut * target) + suffix;

        if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};

// Usage
animateCounter(20, 1400, "h"); // 0h → 20h en 1.4s
```

### SEO et animations

**Règle d'or** : Le HTML source doit contenir les valeurs finales/statiques.

```html
<!-- Google voit "20h" -->
<span id="hours-counter">20h</span>
```

```javascript
// JS change pour l'utilisateur uniquement
document.getElementById("hours-counter").textContent = "0h";
// Puis anime vers 20h
```

---

## Accordéons (FAQ / Programme)

### Animation smooth avec CSS Grid

```css
.accordion-content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.25s ease-out;
}

.accordion[open] .accordion-content {
    grid-template-rows: 1fr;
}

.accordion-content > div {
    overflow: hidden;
}
```

### Empêcher le scroll automatique

Quand on ouvre un accordéon, le navigateur scroll parfois. Fix :
```javascript
summary.addEventListener('click', () => {
    const scrollY = window.scrollY;
    requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
    });
});
```

---

## Dark Mode Design

### Palette de couleurs

| Usage | Couleur |
|-------|---------|
| Fond principal | `bg-zinc-950` (#09090b) |
| Fond cartes | `bg-zinc-900/80` |
| Bordures | `border-zinc-800` |
| Texte principal | `text-white` |
| Texte secondaire | `text-zinc-400` |
| Texte tertiaire | `text-zinc-500` |
| Accent principal | `text-violet-400` |
| Accent secondaire | `text-violet-500` |
| Accent bonus/highlight | `text-amber-400` |

### Effets de glow

```html
<!-- Orbes de lumière en arrière-plan -->
<div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-3xl"></div>

<!-- Ligne lumineuse -->
<div class="h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent"></div>
```

### Lignes de grille animées

```css
.grid-line-h {
    animation: pulse-h 4s ease-in-out infinite;
}

@keyframes pulse-h {
    0%, 100% { opacity: 0; transform: scaleX(0.2); }
    50% { opacity: 1; transform: scaleX(1); }
}
```

---

## Structure d'une bonne Landing Page

### 1. Hero (above the fold)
- Badge de crédibilité (certification, social proof)
- H1 avec proposition de valeur claire
- Sous-titre explicatif (1-2 phrases)
- Feature tags (3-4 points clés)
- CTA principal + CTA secondaire
- Micro social proof ("+ 300 élèves formés")
- Logos d'apps/partenaires (scroll infini)

### 2. Programme / Features
- Accordéons par phase/section
- Progression visuelle (gradient de couleurs)
- Icônes distinctives par section
- Pas trop de détails (teasing)

### 3. Témoignages
- Grid uniforme
- Photo + nom + rôle
- Citations courtes et impactantes
- Mélange de profils (débutants, experts)

### 4. Pricing
- Une seule offre (éviter la paralysie du choix)
- Prix bien visible
- Liste de bénéfices avec checkmarks
- Section bonus séparée (couleur différente)
- CTA proéminent
- Trust badges (paiement sécurisé, garantie, accès immédiat)

### 5. FAQ
- 5-7 questions max
- Questions courantes (prix, garantie, prérequis)
- Réponses concises
- Lien vers contact si besoin

### 6. CTA Final (optionnel)
- Si navbar sticky avec CTA, peut être omis
- Sinon, rappel de l'offre + CTA

---

## Responsive Design

### Breakpoints Tailwind

```
sm: 640px   (mobiles larges)
md: 768px   (tablettes)
lg: 1024px  (laptops)
xl: 1280px  (desktops)
```

### Patterns courants

```html
<!-- Texte responsive -->
<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">

<!-- Padding responsive -->
<section class="py-16 md:py-24">

<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

<!-- Cacher sur mobile -->
<span class="hidden md:inline">Texte desktop</span>
<br class="sm:hidden" /> <!-- Saut de ligne mobile only -->
```

---

## Performance

### Images
- Utiliser le composant `<Image>` d'Astro
- Format WebP/AVIF automatique avec Sharp
- Lazy loading par défaut

### CSS
- Tailwind purge automatiquement les classes inutilisées
- Éviter les animations sur éléments hors viewport

### JavaScript
- Scripts Astro sont automatiquement isolés
- Utiliser `DOMContentLoaded` pour les animations
- `requestAnimationFrame` pour animations fluides

---

## Checklist avant production

- [ ] Tester sur mobile (iPhone), tablette, desktop
- [ ] Vérifier les animations (pas de saccades)
- [ ] Vérifier le SEO (balises meta, H1 unique, alt images)
- [ ] Tester les liens (CTA, navigation)
- [ ] Vérifier la performance (Lighthouse)
- [ ] Tester le dark mode sur différents écrans
- [ ] Vérifier l'accessibilité (contraste, aria-labels)
- [ ] Tester le formulaire de paiement
- [ ] Vérifier les analytics/tracking

---

## Erreurs à éviter

1. **Animations qui décalent le layout** → Utiliser spacers invisibles
2. **Trop de sections** → 5-6 sections max
3. **Trop de choix pricing** → Une offre claire
4. **FAQ trop longue** → 5-7 questions
5. **CTA peu visible** → Contraste fort, taille généreuse
6. **Texte trop petit sur mobile** → Min 16px pour body
7. **Animations trop lentes** → Max 0.3s pour transitions UI
8. **Oublier le SEO** → Valeurs statiques dans HTML

---

*Dernière mise à jour : Janvier 2025*
