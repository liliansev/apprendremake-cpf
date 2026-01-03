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

### ScrollingLogos (Bandeau de logos défilant)

Composant réutilisable pour afficher des logos qui défilent en boucle infinie.

**Fichier** : `src/components/ui/ScrollingLogos.astro`

**Repo icônes** : https://simpleicons.org/

**Dépendances requises** :
```bash
pnpm add astro-icon @iconify-json/simple-icons
```

#### Code complet du composant

Créer le fichier `src/components/ui/ScrollingLogos.astro` :

```astro
---
/**
 * ScrollingLogos - Bandeau de logos défilant en boucle infinie
 * Dépendances: astro-icon, @iconify-json/simple-icons
 */
import { Icon } from "astro-icon/components";

interface LogoItem {
    name: string;
    icon: string;
}

interface Props {
    items: LogoItem[];
    title?: string;
    speed?: number;
    direction?: "left" | "right";
    showNames?: boolean;
    variant?: "dark" | "light";
    size?: "sm" | "md" | "lg";
    pauseOnHover?: boolean;
}

const {
    items,
    title,
    speed = 40,
    direction = "left",
    showNames = true,
    variant = "dark",
    size = "md",
    pauseOnHover = true,
} = Astro.props;

const styles = {
    dark: {
        fadeBg: "from-zinc-950",
        iconBg: "bg-zinc-900",
        iconBorder: "border-zinc-800",
        iconColor: "text-zinc-400",
        textColor: "text-zinc-500",
        titleColor: "text-zinc-600",
    },
    light: {
        fadeBg: "from-white",
        iconBg: "bg-zinc-100",
        iconBorder: "border-zinc-200",
        iconColor: "text-zinc-600",
        textColor: "text-zinc-600",
        titleColor: "text-zinc-400",
    },
};

const sizes = {
    sm: {
        icon: "w-6 h-6 md:w-8 md:h-8",
        iconInner: "w-3 h-3 md:w-4 md:h-4",
        text: "text-[10px] md:text-xs",
        gap: "gap-6 md:gap-8",
        fade: "w-16 md:w-24",
    },
    md: {
        icon: "w-8 h-8 md:w-10 md:h-10",
        iconInner: "w-4 h-4 md:w-5 md:h-5",
        text: "text-xs md:text-sm",
        gap: "gap-8 md:gap-12",
        fade: "w-24 md:w-40",
    },
    lg: {
        icon: "w-10 h-10 md:w-12 md:h-12",
        iconInner: "w-5 h-5 md:w-6 md:h-6",
        text: "text-sm md:text-base",
        gap: "gap-10 md:gap-14",
        fade: "w-32 md:w-48",
    },
};

const s = styles[variant];
const sz = sizes[size];
const directionClass = direction === "right" ? "scroll-right" : "scroll-left";
const pauseClass = pauseOnHover ? "pause-on-hover" : "";
---

<div class="relative overflow-hidden">
    {title && (
        <p class={`text-center text-[10px] uppercase tracking-[0.2em] mb-6 ${s.titleColor}`}>
            {title}
        </p>
    )}

    <div class="relative overflow-hidden">
        <div class={`absolute left-0 top-0 bottom-0 ${sz.fade} bg-gradient-to-r ${s.fadeBg} to-transparent z-10 pointer-events-none`}></div>
        <div class={`absolute right-0 top-0 bottom-0 ${sz.fade} bg-gradient-to-l ${s.fadeBg} to-transparent z-10 pointer-events-none`}></div>

        <div
            class={`flex items-center ${sz.gap} scrolling-logos ${directionClass} ${pauseClass}`}
            style={`--scroll-speed: ${speed}s;`}
        >
            {[...items, ...items].map((item) => (
                <div class="flex items-center gap-2 shrink-0">
                    <div class={`${sz.icon} rounded-lg ${s.iconBg} border ${s.iconBorder} flex items-center justify-center ${s.iconColor}`}>
                        <Icon name={item.icon} class={sz.iconInner} />
                    </div>
                    {showNames && (
                        <span class={`${sz.text} font-medium ${s.textColor} whitespace-nowrap`}>
                            {item.name}
                        </span>
                    )}
                </div>
            ))}
        </div>
    </div>
</div>

<style>
    @keyframes scroll-to-left {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }

    @keyframes scroll-to-right {
        0% { transform: translateX(-50%); }
        100% { transform: translateX(0); }
    }

    .scrolling-logos {
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-duration: var(--scroll-speed, 40s);
    }

    .scrolling-logos.scroll-left {
        animation-name: scroll-to-left;
    }

    .scrolling-logos.scroll-right {
        animation-name: scroll-to-right;
    }

    .scrolling-logos.pause-on-hover:hover {
        animation-play-state: paused;
    }

    @media (max-width: 768px) {
        .scrolling-logos {
            animation-duration: calc(var(--scroll-speed, 40s) * 0.7);
        }
    }
</style>
```

#### Usage basique

```astro
import ScrollingLogos from "@/components/ui/ScrollingLogos.astro";

const apps = [
    { name: "Notion", icon: "simple-icons:notion" },
    { name: "Slack", icon: "simple-icons:slack" },
    { name: "Stripe", icon: "simple-icons:stripe" },
    { name: "Gmail", icon: "simple-icons:gmail" },
    { name: "Shopify", icon: "simple-icons:shopify" },
    { name: "Discord", icon: "simple-icons:discord" },
    { name: "Figma", icon: "simple-icons:figma" },
    { name: "OpenAI", icon: "simple-icons:openai" },
];

<ScrollingLogos
    items={apps}
    title="Connectez à + de 2000 applications"
/>
```

#### Props disponibles

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `items` | `{ name: string, icon: string }[]` | **requis** | Liste des logos |
| `title` | `string` | - | Titre au-dessus du bandeau |
| `speed` | `number` | `40` | Durée animation en secondes |
| `direction` | `"left" \| "right"` | `"left"` | Direction du défilement |
| `showNames` | `boolean` | `true` | Afficher les noms |
| `variant` | `"dark" \| "light"` | `"dark"` | Thème couleurs |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Taille des icônes |
| `pauseOnHover` | `boolean` | `true` | Pause au survol |

#### Exemples

```astro
<!-- Dark mode, taille moyenne (défaut) -->
<ScrollingLogos items={apps} />

<!-- Light mode, petite taille, sans noms -->
<ScrollingLogos
    items={apps}
    variant="light"
    size="sm"
    showNames={false}
/>

<!-- Défilement vers la droite, plus rapide -->
<ScrollingLogos
    items={apps}
    direction="right"
    speed={25}
/>

<!-- Grande taille avec titre -->
<ScrollingLogos
    items={apps}
    size="lg"
    title="Nos partenaires"
/>
```

#### Responsive

- **Desktop** : taille complète, gap large, fade edges 40px
- **Mobile** : taille réduite, gap compact, fade edges 24px, vitesse 60% (plus lent pour lisibilité)

#### Comment ça marche

1. Les items sont dupliqués (`[...items, ...items]`) pour créer une boucle infinie
2. L'animation `translateX(-50%)` déplace le container de la moitié
3. Comme les items sont dupliqués, ça crée l'illusion d'un scroll infini
4. Les fade edges (gradients) masquent les bords pour un effet smooth

```
[Item1][Item2][Item3][Item1][Item2][Item3]
       ←←←← translateX(-50%) ←←←←
                    ↓
[Item1][Item2][Item3][Item1][Item2][Item3]
       Visuellement identique au départ
```

#### Code CSS de l'animation

```css
@keyframes scroll-to-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

@keyframes scroll-to-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
}

.scrolling-logos {
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-duration: var(--scroll-speed, 40s);
}

.scrolling-logos.scroll-left {
    animation-name: scroll-to-left;
}

.scrolling-logos.scroll-right {
    animation-name: scroll-to-right;
}

.scrolling-logos.pause-on-hover:hover {
    animation-play-state: paused;
}

/* Mobile : vitesse réduite pour lisibilité */
@media (max-width: 768px) {
    .scrolling-logos {
        animation-duration: calc(var(--scroll-speed, 40s) * 0.7);
    }
}
```

#### Structure HTML générée

```html
<div class="relative overflow-hidden">
    <!-- Titre optionnel -->
    <p class="text-center text-[10px] uppercase tracking-[0.2em] mb-6">
        Titre du bandeau
    </p>

    <div class="relative overflow-hidden">
        <!-- Fade gauche -->
        <div class="absolute left-0 top-0 bottom-0 w-24 md:w-40
                    bg-gradient-to-r from-zinc-950 to-transparent z-10">
        </div>

        <!-- Fade droite -->
        <div class="absolute right-0 top-0 bottom-0 w-24 md:w-40
                    bg-gradient-to-l from-zinc-950 to-transparent z-10">
        </div>

        <!-- Container scrolling -->
        <div class="flex items-center gap-8 md:gap-12
                    scrolling-logos scroll-left pause-on-hover"
             style="--scroll-speed: 40s;">
            <!-- Items dupliqués pour boucle infinie -->
            <div class="flex items-center gap-2 shrink-0">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg
                            bg-zinc-900 border border-zinc-800
                            flex items-center justify-center text-zinc-400">
                    <svg><!-- Icône --></svg>
                </div>
                <span class="text-xs md:text-sm font-medium text-zinc-500">
                    Nom
                </span>
            </div>
            <!-- ... répéter pour chaque item x2 -->
        </div>
    </div>
</div>
```

#### Implémentation manuelle (sans composant)

Si tu veux implémenter le scroll sans le composant :

```astro
---
const items = [
    { name: "Notion", icon: "simple-icons:notion" },
    { name: "Slack", icon: "simple-icons:slack" },
    // ...
];
---

<div class="relative overflow-hidden">
    <!-- Fades -->
    <div class="absolute left-0 top-0 bottom-0 w-24 md:w-40
                bg-gradient-to-r from-zinc-950 to-transparent z-10"></div>
    <div class="absolute right-0 top-0 bottom-0 w-24 md:w-40
                bg-gradient-to-l from-zinc-950 to-transparent z-10"></div>

    <!-- Scrolling container -->
    <div class="flex items-center gap-8 animate-scroll">
        {[...items, ...items].map((item) => (
            <div class="flex items-center gap-2 shrink-0">
                <Icon name={item.icon} class="w-5 h-5" />
                <span class="text-sm">{item.name}</span>
            </div>
        ))}
    </div>
</div>

<style>
    @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    .animate-scroll {
        animation: scroll 40s linear infinite;
    }
    .animate-scroll:hover {
        animation-play-state: paused;
    }
</style>
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
