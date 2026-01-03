# Tutoriel : Animation de logos défilants en boucle infinie

Guide complet pour créer un bandeau de logos qui défilent horizontalement, en boucle infinie, avec Astro + Tailwind CSS.

---

## Résultat final

```
[Logo1][Logo2][Logo3][Logo4] ←←← défilement continu ←←←
```

- Défilement fluide et infini
- Pause au survol
- Fade sur les bords (effet de fondu)
- Responsive (mobile + desktop)

---

## Fichier

`src/components/ui/ScrollingLogos.astro`

---

## Principe de l'animation

### Le problème

On veut un défilement **infini**, mais on a un nombre **fini** de logos. Comment faire ?

### La solution : duplication + translateX(-50%)

```
État initial :
[Logo1][Logo2][Logo3][Logo1][Logo2][Logo3]
^--- originaux ---^ ^--- copies ---^

Après translateX(-50%) :
                    [Logo1][Logo2][Logo3][Logo1][Logo2][Logo3]
                    ^--- on revient au début visuellement ---^
```

**Explication** :
1. On duplique la liste de logos (`[...items, ...items]`)
2. On anime le container avec `translateX(0)` → `translateX(-50%)`
3. Quand on atteint -50%, on est revenu visuellement au point de départ
4. L'animation recommence → boucle infinie !

---

## Structure HTML

```html
<div class="relative overflow-hidden">

    <!-- FADE GAUCHE : gradient qui cache le bord -->
    <div class="absolute left-0 top-0 bottom-0 w-24 md:w-40
                bg-gradient-to-r from-zinc-950 to-transparent z-10">
    </div>

    <!-- FADE DROITE : même chose à droite -->
    <div class="absolute right-0 top-0 bottom-0 w-24 md:w-40
                bg-gradient-to-l from-zinc-950 to-transparent z-10">
    </div>

    <!-- CONTAINER QUI DÉFILE -->
    <div class="flex items-center gap-8 scrolling-logos scroll-left"
         style="--scroll-speed: 40s;">

        <!-- Logos dupliqués -->
        <div class="flex items-center gap-2 shrink-0">
            <div class="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800
                        flex items-center justify-center">
                <svg><!-- icône --></svg>
            </div>
            <span class="text-sm text-zinc-500">Notion</span>
        </div>

        <!-- ... répéter pour chaque logo x2 -->

    </div>
</div>
```

### Classes importantes

| Classe | Rôle |
|--------|------|
| `overflow-hidden` | Cache ce qui dépasse du container |
| `shrink-0` | Empêche les logos de se comprimer |
| `whitespace-nowrap` | Garde le texte sur une ligne |
| `z-10` | Met les fades au-dessus des logos |
| `pointer-events-none` | Les fades ne bloquent pas le hover |

---

## CSS de l'animation

```css
/* Keyframes : définit le mouvement */
@keyframes scroll-to-left {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

@keyframes scroll-to-right {
    0% {
        transform: translateX(-50%);
    }
    100% {
        transform: translateX(0);
    }
}

/* Application de l'animation */
.scrolling-logos {
    animation-timing-function: linear;    /* Vitesse constante */
    animation-iteration-count: infinite;  /* Boucle infinie */
    animation-duration: var(--scroll-speed, 40s);  /* Durée via CSS variable */
}

/* Direction gauche (défaut) */
.scrolling-logos.scroll-left {
    animation-name: scroll-to-left;
}

/* Direction droite */
.scrolling-logos.scroll-right {
    animation-name: scroll-to-right;
}

/* Pause au survol */
.scrolling-logos.pause-on-hover:hover {
    animation-play-state: paused;
}
```

### Pourquoi -50% ?

```
Largeur totale : [Logo1][Logo2][Logo3][Logo1][Logo2][Logo3] = 100%
                 ^------ 50% ------^^------ 50% ------^

translateX(-50%) = on décale de la moitié = on revient au début visuellement
```

### Pourquoi `linear` ?

- `ease` ou `ease-in-out` créeraient des accélérations/décélérations
- `linear` = vitesse constante = défilement fluide

---

## Responsive

### Mobile vs Desktop

```css
/* Desktop : vitesse normale */
.scrolling-logos {
    animation-duration: var(--scroll-speed, 40s);
}

/* Mobile : vitesse réduite (70%) pour lisibilité */
@media (max-width: 768px) {
    .scrolling-logos {
        animation-duration: calc(var(--scroll-speed, 40s) * 0.7);
    }
}
```

### Tailles responsive avec Tailwind

```html
<!-- Icône : petite sur mobile, grande sur desktop -->
<div class="w-8 h-8 md:w-10 md:h-10">

<!-- Gap : serré sur mobile, large sur desktop -->
<div class="gap-8 md:gap-12">

<!-- Fade : petit sur mobile, grand sur desktop -->
<div class="w-24 md:w-40">

<!-- Texte : petit sur mobile, normal sur desktop -->
<span class="text-xs md:text-sm">
```

### Breakpoints Tailwind

| Préfixe | Largeur min | Device |
|---------|-------------|--------|
| (aucun) | 0px | Mobile |
| `sm:` | 640px | Mobile large |
| `md:` | 768px | Tablette |
| `lg:` | 1024px | Desktop |

---

## Les fades (effet de fondu sur les bords)

### Comment ça marche

```
[FADE]  [Logo1][Logo2][Logo3]...  [FADE]
 ↑                                  ↑
 gradient                        gradient
 transparent → noir           noir ← transparent
```

### Code

```html
<!-- Fade gauche -->
<div class="absolute left-0 top-0 bottom-0 w-24 md:w-40
            bg-gradient-to-r from-zinc-950 to-transparent z-10">
</div>

<!-- Fade droite -->
<div class="absolute right-0 top-0 bottom-0 w-24 md:w-40
            bg-gradient-to-l from-zinc-950 to-transparent z-10">
</div>
```

### Adaptation au thème

| Mode | Couleur de fond | Gradient |
|------|-----------------|----------|
| Dark | `bg-zinc-950` | `from-zinc-950` |
| Light | `bg-white` | `from-white` |

---

## Duplication des items en Astro

```astro
---
const items = [
    { name: "Notion", icon: "simple-icons:notion" },
    { name: "Slack", icon: "simple-icons:slack" },
    { name: "Stripe", icon: "simple-icons:stripe" },
];
---

<!-- [...items, ...items] = duplique le tableau -->
{[...items, ...items].map((item) => (
    <div class="flex items-center gap-2 shrink-0">
        <Icon name={item.icon} />
        <span>{item.name}</span>
    </div>
))}
```

**Résultat** :
```
[Notion][Slack][Stripe][Notion][Slack][Stripe]
```

---

## Configuration via CSS Variables

```html
<!-- Vitesse personnalisée via style inline -->
<div class="scrolling-logos" style="--scroll-speed: 30s;">
```

```css
.scrolling-logos {
    /* Utilise la variable, ou 40s par défaut */
    animation-duration: var(--scroll-speed, 40s);
}
```

**Avantage** : on peut changer la vitesse sans modifier le CSS.

---

## Récapitulatif : les 5 éléments clés

### 1. Container avec overflow hidden
```html
<div class="overflow-hidden">
```
Cache ce qui dépasse.

### 2. Duplication des items
```js
[...items, ...items]
```
Permet la boucle infinie.

### 3. Animation translateX(-50%)
```css
@keyframes scroll-to-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
```
Décale de la moitié = retour au début.

### 4. Fades sur les bords
```html
<div class="bg-gradient-to-r from-zinc-950 to-transparent">
```
Cache les bords pour un effet smooth.

### 5. Responsive
```css
@media (max-width: 768px) {
    animation-duration: calc(var(--scroll-speed) * 0.7);
}
```
Vitesse réduite sur mobile.

---

## Checklist d'implémentation

- [ ] **20 logos minimum** (sinon tripler/quadrupler)
- [ ] Container parent avec `overflow-hidden`
- [ ] Items dupliqués (`[...items, ...items]`)
- [ ] Items avec `shrink-0` (ne pas comprimer)
- [ ] Keyframes avec `translateX(-50%)`
- [ ] Animation `linear infinite`
- [ ] Fades gauche et droite avec gradients
- [ ] Media query pour mobile
- [ ] Pause au hover (optionnel)

---

## Nombre minimum de logos

### ⚠️ Important : 20 logos minimum recommandés

Pour que l'animation fonctionne **sans voir les logos dupliqués** à l'écran, il faut suffisamment de logos pour remplir au moins 2x la largeur de l'écran.

#### Pourquoi ?

```
Écran : [-------- 1920px --------]

❌ 5 logos (trop peu) :
[Logo1][Logo2][Logo3][Logo4][Logo5][Logo1][Logo2][Logo3][Logo4][Logo5]
^--- visible à l'écran, on voit les doublons ---^

✅ 20 logos (assez) :
[Logo1][Logo2]...[Logo19][Logo20][Logo1][Logo2]...[Logo19][Logo20]
^--- visible à l'écran ---^      ^--- hors écran ---^
```

#### Règle de calcul

```
Nombre minimum = (largeur écran max / largeur d'un logo) + marge

Exemple :
- Écran max : 1920px
- Logo + gap : ~100px
- Minimum : 1920 / 100 = ~20 logos
```

#### Solutions si tu as moins de 20 logos

**Option 1** : Tripler ou quadrupler les items
```js
// Au lieu de doubler
[...items, ...items]

// Tripler
[...items, ...items, ...items]

// Quadrupler
[...items, ...items, ...items, ...items]
```

**Option 2** : Réduire la vitesse (plus lent = moins visible)
```html
<ScrollingLogos items={items} speed={60} />
```

**Option 3** : Ajouter des logos "fillers"
```js
const items = [
    // Tes vrais logos
    { name: "Notion", icon: "simple-icons:notion" },
    { name: "Slack", icon: "simple-icons:slack" },
    // ...

    // Logos complémentaires pour atteindre 20
    { name: "GitHub", icon: "simple-icons:github" },
    { name: "GitLab", icon: "simple-icons:gitlab" },
    // ...
];
```

---

## Erreurs courantes

### ❌ On voit les logos dupliqués
**Cause** : Pas assez de logos (moins de 20).
**Fix** : Ajouter plus de logos ou tripler/quadrupler la liste.

### ❌ L'animation saute/glitch
**Cause** : Les items ne sont pas dupliqués.
**Fix** : `[...items, ...items]`

### ❌ Les logos se compressent
**Cause** : Flexbox compresse les enfants.
**Fix** : Ajouter `shrink-0` sur chaque item.

### ❌ Le fade ne fonctionne pas
**Cause** : Z-index trop bas ou mauvaise couleur.
**Fix** : `z-10` + même couleur que le fond.

### ❌ L'animation n'est pas fluide
**Cause** : Utilisation de `ease` au lieu de `linear`.
**Fix** : `animation-timing-function: linear`

### ❌ Ça ne boucle pas parfaitement
**Cause** : `translateX` n'est pas exactement `-50%`.
**Fix** : Vérifier que les items sont dupliqués exactement.

---

## Code complet minimal

```astro
---
import { Icon } from "astro-icon/components";

const items = [
    { name: "Notion", icon: "simple-icons:notion" },
    { name: "Slack", icon: "simple-icons:slack" },
    { name: "Stripe", icon: "simple-icons:stripe" },
    { name: "Gmail", icon: "simple-icons:gmail" },
];
---

<div class="relative overflow-hidden">
    <!-- Fades -->
    <div class="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10"></div>
    <div class="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10"></div>

    <!-- Container scrolling -->
    <div class="flex items-center gap-8 animate-scroll">
        {[...items, ...items].map((item) => (
            <div class="flex items-center gap-2 shrink-0">
                <div class="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <Icon name={item.icon} class="w-5 h-5" />
                </div>
                <span class="text-sm text-zinc-500">{item.name}</span>
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

*Document créé pour le projet Apprendre Make - Janvier 2025*
