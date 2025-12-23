# Sol Y Salud - Project Documentation

## Project Overview
**Domain:** solysalud.com
**Tagline:** Sun & Health Education for Colombia

A nonprofit landing page featuring an interactive sun-based navigation system with a vector art Colombian cityscape background.

## Tech Stack
- **HTML5** - Semantic markup
- **CSS3** - Animations, flexbox/grid layout
- **Vanilla JavaScript** - Interactive hover effects
- **SVG** - Vector graphics for sun and background

## Design Concept
- Full-viewport landing page with Colombian cityscape vector background
- Central animated sun with pulsing/rotating rays
- Navigation items appear on hover around the sun's circumference
- Warm gradient background (yellow → orange → coral)

## Navigation Structure
1. **Our Mission** - Organization's purpose and goals
2. **About Us** - Team and story
3. **GoFundMe** - Donation/fundraising link
4. **Contact Us** - Contact form/information

## File Structure
```
/
├── index.html          # Main landing page
├── css/
│   └── styles.css      # All styles and animations
├── js/
│   └── main.js         # Interactive functionality
├── assets/
│   └── images/         # Any raster images if needed
└── pages/
    ├── mission.html    # Our Mission page
    ├── about.html      # About Us page
    └── contact.html    # Contact page
```

## Animation Specifications
- **Sun pulse:** Subtle scale animation (1.0 → 1.02) every 2s
- **Sun rays:** Slow rotation, 60s per revolution
- **Nav items:** Fade in/scale up on hover near sun edge
- **Background:** Subtle parallax on mouse move (optional)

## Color Palette (Colombian Flag Inspired)
- **Yellow:** #FCD116 (Colombian flag - sun, nav items)
- **Blue:** #003893 (Colombian flag - accents, GoFundMe button)
- **Red:** #CE1126 (Colombian flag - highlights)
- **White:** #FFFFFF (text)
- **Dark:** #1a1a2e (dark backgrounds)
- Sky Gradient: Yellow → Orange → Red → Blue (sunset over Colombia)

## Hosting: GitHub Pages (FREE)
**Domain:** solysalud.com

## Deployment Steps
1. Create GitHub repository "solysalud-site"
2. Push all code to repository
3. Go to Settings → Pages → Enable from main branch
4. Add custom domain: solysalud.com
5. GitHub auto-generates CNAME file
6. Enable "Enforce HTTPS" after DNS propagates

## DNS Configuration (at your domain registrar)
```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
CNAME   www     yourusername.github.io
```

## Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (responsive design)
