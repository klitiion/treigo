# Trèigo - Second-Hand & Premium Marketplace

![Trèigo Logo](https://img.shields.io/badge/Trèigo-Marketplace-89986D)

Platforma e besueshme për shitblerje të artikujve second-hand dhe premium në Shqipëri.

## 🚀 Features

### Për Blerës
- ✅ Kërkimi dhe filtrimi i produkteve
- ✅ Produktet e verifikuara me "Trèigo Verified" badge
- ✅ Kontakt me shitësit via WhatsApp
- ✅ Regjistrim dhe autentifikim me email

### Për Shitës
- ✅ Panel menaxhimi (Dashboard)
- ✅ Shtimi i produkteve me foto të shumta
- ✅ Kërkesa për verifikim të produkteve
- ✅ Sistemi i gjendjes (New/Like New/Good/Fair)

### Verifikimi (Trèigo Verified)
- Nivel 1: Kontroll automatik i fotove
- Nivel 2: Kontroll dokumentar (faturë, certifikata)
- Nivel 3: Verifikim fizik (opsional)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM (konfiguruar)
- **Email**: Resend API
- **Auth**: JWT tokens

## 📦 Instalimi

```bash
# 1. Ekstrakto arkivin
tar -xvf treigo-mvp.tar -C ./treigo

# 2. Instalo dependencies
cd treigo
npm install

# 3. Konfiguro .env
# Ndrysho DATABASE_URL sipas database-it tënd
# Resend API key dhe email-et tashmë janë konfiguruara

# 4. Gjenero Prisma Client (nëse do të përdorësh database)
npx prisma generate

# 5. Starto development server
npm run dev
```

## 🔧 Konfigurimi

### Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/treigo"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-secret-key"

# Resend
RESEND_API_KEY="re_KtzN5FHf_6E4wRaDTbHKWTEgqPLKKTwhA"
EMAIL_FROM="notify@treigo.eu"
VERIFICATION_EMAIL="sales@treigo.eu"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+355692084763"
```

## 📂 Struktura e Projektit

```
treigo/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Auth endpoints
│   │   │   └── products/      # Products endpoints
│   │   ├── auth/              # Auth pages
│   │   ├── product/           # Product detail page
│   │   ├── search/            # Search/Browse page
│   │   ├── seller/            # Seller dashboard
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # Reusable UI components
│   └── lib/
│       ├── email.ts           # Resend email service
│       ├── prisma.ts          # Prisma client
│       └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

## 🎨 Color Palette

```
Cream (Background): #F6F0D7
Sage (Accent):      #C5D89D
Olive (Secondary):  #9CAB84
Forest (Primary):   #89986D
Dark (Text):        #2D3A1F
```

## 📱 Faqet

| Rruga | Përshkrimi |
|-------|------------|
| `/` | Homepage |
| `/search` | Kërko dhe shfleto produktet |
| `/product/[id]` | Detajet e produktit |
| `/auth/login` | Hyr në llogari |
| `/auth/register` | Regjistrohu |
| `/seller/dashboard` | Paneli i shitësit |
| `/seller/products/new` | Shto produkt të ri |

## 🔒 API Endpoints

### Auth
- `POST /api/auth/register` - Regjistro përdorues të ri
- `POST /api/auth/login` - Hyr në llogari
- `GET /api/auth/verify?token=xxx` - Verifiko emailin

### Products
- `GET /api/products` - Lista e produkteve (me filtra)
- `POST /api/products` - Krijo produkt të ri

## 🚀 Deployment

### Lokalisht
```bash
npm run dev
```

### Vercel
```bash
vercel
```

### DigitalOcean/AWS
1. Build: `npm run build`
2. Start: `npm start`

## 📧 Sistemi i Email-eve

Sistemi përdor Resend për dërgimin e email-eve:

- **Konfirmim regjistrimi**: Dërgohet automatikisht pas regjistrimit
- **Verifikim produkti**: Dërgohet tek sales@treigo.eu kur shitësi kërkon verifikim
- **Mirëseardhje**: Dërgohet pas konfirmimit të llogarisë

## ⚠️ Shënime MVP

Kjo është versioni MVP. Për production:

1. **Database**: Konfiguro PostgreSQL dhe migro schemat
2. **File Storage**: Shto S3/Cloudflare R2 për foto
3. **Pagesa**: Integro gateway lokal (Raiffeisen, BKT, etj.)
4. **Chat**: Implemento WebSocket për mesazhe realtime

## 📄 Licenca

MIT License - Trèigo © 2024

---

Made with ❤️ in Albania
