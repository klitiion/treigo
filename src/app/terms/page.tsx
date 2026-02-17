'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Section {
  id: string
  title: string
  content: string[]
}

const sections: Section[] = [
  {
    id: 'general',
    title: 'Termat dhe Kushtet e Përgjithshme',
    content: [
      'By registering on Treigo, you agree to comply with all the terms and conditions of this agreement. If you do not agree with these terms, do not use the platform.',
      'Trèigo është një tregëtim elektronik që lejon shitësit dhe blerësit të tregtojnë mallra. Ne nuk jemi as shitës as blerës, por një ndërmjetës.',
      'Çdo përdorues duhet të jetë të paktën 18 vjeç për të përdorur platformën.',
      'Ju përdorni këtë platformë nën rrezikun tuaj. Trèigo nuk është përgjegjës për dëmet ose humbjet që mund të ndodhin gjatë tregtimit.',
    ]
  },
  {
    id: 'offplatform',
    title: '⚠️ Politika e Komunikimit Off-Platform (SHUMË E RËNDËSISHME)',
    content: [
      'NDALIM ABSOLUT: Nuk lejohet të ndajë ndonjë informacion kontakti jashtë platformës Trèigo (email, numër telefoni, adresë, LinkedIn, Instagram, etj.) para, gjatë ose pas përfundimit të transaksionit.',
      'PSE? Për të mbrojtur të dyja palët nga mashtrimet, vjedhja e identitetit, shantazhit dhe transaksioneve të padrejta jashtë mbikëqyrjes.',
      'Trèigo do të monitorojë mesazhet dhe do të hiqet automatikisht përmbajtjen që përmban:\n- Numra telefoni (p.sh. "+355 69 XXX XXXX")\n- Adresa email (p.sh. "user@example.com")\n- Adresa fizike\n- URL-e jashtëpërkatëse\n- Kërkesa për të komunikuar jashtë platformës',
      'Nëse bëhet një përpjekje për komunikim off-platform, do të ndodhë një procesi graduali:\n1. Paralajmërim i parë - mesazh këshilluese\n2. Disa paralajmërime - bllokim i dërgimit të mesazheve\n3. Përpjekje të shumtë - pezullim i llogaries\n4. Përsëritje të disa herëve - heqje përgjithmonë e llogarisë',
      'Nëse dyshojmë se mund të ketë presion për të shkuar off-platform, mund të ndalojmë transaksionin dhe të lëshojmë një refund.',
    ]
  },
  {
    id: 'contact-blocking',
    title: 'Bllokim i Informacionit të Kontaktit',
    content: [
      'Sistemi ynë do të filtroj automatikisht dhe do të bllokojë:\n- Emra domeni të personalizuara ose social media handles\n- Kërkesa për të komunikuar përmes WhatsApp, Telegram ose aplikacione të tjera\n- Përcjedhja e "ndreqej më vonë" ose "kontaktoje mua këtu"',
      'Mesazhet që përmbajnë këtë përmbajtje nuk do të dërgohen. Në vend të kësaj, ju do të merrni njoftim se pse mesazhi nuk u dërgua.',
      'Përpjekjet për të shtyrë kontaktin jashtë platformës do të regjistrohen dhe do të mund të përdoren kundër jush nëse ka përpjekje për të mashtruar ose kërcënuar.',
    ]
  },
  {
    id: 'penalties',
    title: 'Ndëshkimet dhe Sanksionet',
    content: [
      'Shkeljet e mëposhtme do të ndiqen:\n\n• SHKELJE LEHTË (1-2 herë):\n  - Bllokim i dërgimit të mesazheve për 24-48 orë\n  - Paralajmërim zyrtar\n  - Inspektim i llogares\n\n• SHKELJE MESATARE (3-4 herë):\n  - Bllokim i dërgimit të mesazheve për 7 ditë\n  - Reduktim i besueshmërisë (preferencë më e ulët në kërkime)\n  - Paralajmërim final\n\n• SHKELJE E RËNDË (5+ herë ose përpjekje për të mashtruar):\n  - Pezullim i plotë i llogares për 30 ditë\n  - Heqje e të gjitha ofertave aktive\n  - Kërkesë për kalim të riaftësimit\n\n• NDALIM PËRGJITHMONË:\n  - Përpjekje të përsëritura pas pezullimit\n  - Mashtrim, kërcënim, ose përdhunim\n  - Vjedhje ose humbje e fondeve të tjera përfaqësuesish',
      'If your account is suspended, you cannot withdraw funds until the repayment conditions are met.',
    ]
  },
  {
    id: 'seller-responsibilities',
    title: 'Përgjegjësitë e Shitësit',
    content: [
      'Si shitës në Trèigo, ju jeni përgjegjës për:\n- Përshkrim të saktë të produktit (foto, dimensione, material, gjendje)\n- Çimin e drejtë dhe pa fshehta të tjera\n- Dorëzimin në kohë sipas afatit të deklaruar\n- Përgjigjen brenda 24 orësh ndaj pyetjeve të blerëve\n- Zgjidhja e shpejtë e problemeve\n- Respektim i të gjithë ligjeve lokale dhe ndërkombëtare',
      'Nëse shitësi nuk përmbush këto përgjegjësi, mund të:\n- Marrë vërejtje zyrare\n- Të humbasë privilegje të tjera (ndarje, vend i parë)\n- Të pezullohet\n- Të përjashtohet përgjithmonë',
    ]
  },
  {
    id: 'buyer-responsibilities',
    title: 'Përgjegjësitë e Blerësit',
    content: [
      'Si blerës në Trèigo, ju jeni përgjegjës për:\n- Të bindeni me përshkrimin e produktit\n- Të paguani menjëherë pasi të dorëzuhet produkti\n- Të mos pengoni dorëzimin\n- Të raportoni problemat brenda 7 ditësh\n- Të mos kërkoni kompensim pas 30 ditësh',
      'If the buyer damages the product or makes a false claim, they may:\n- Lose entitlement to dispute\n- Receive a warning\n- Be suspended\n- Be permanently banned',
    ]
  },
  {
    id: 'disputes',
    title: 'Zgjidhja e Mosmarrëveshjeve',
    content: [
      'Nëse ka një mosmarrëveshje midis shitësit dhe blerësit:\n1. Të dyja palët kanë 7 ditë për të rënë dakord\n2. Nëse nuk mund të rrahen dakord, Trèigo do të ndërhyjë\n3. Trèigo do të hetoj provat e të dyja palëve\n4. Trèigo do të marrë vendimin përfundimtar\n5. Nëse nëse i pakënaqur, mund të ankohesh në 14 ditë',
      'Prova e kërkuar:\n- Foto të produktit\n- Mesazhet midis palëve\n- Dëshmi e pagesës\n- Dëshmi e dorëzimit\n- Marrje bashkë të nënshkruara (nëse zbatueshme)',
    ]
  },
  {
    id: 'payment',
    title: 'Politika e Pagesës',
    content: [
      'Trèigo pranon:\n- Kartela krediti/debiti (Visa, Mastercard)\n- Portofole digjitale\n- Transferta bankare\n- PokPay dhe metoda të tjera të pagesës të autorizuara',
      'All payments are processed through secure 256-bit encryption systems.',
      'Trèigo nuk ruan informacionin e kartës suaj. Të gjitha pagesat procesohen përmes partneri të tretë të pagimit.',
      'Refundimet:\n- Nëse produkti nuk arrini brenda 30 ditësh, ju do të merrni një refund të plotë\n- Nëse produkti nuk përputhet me përshkrimin, ju do të merrni një refund\n- Nëse e ktheni produktin përbrenda 14 ditësh në gjendje të mirë, ju do të merrni një refund minus shpenzimet e dërgimit të kthimit',
    ]
  },
  {
    id: 'privacy',
    title: 'Politika e Privatësisë',
    content: [
      'Trèigo respekton privatësinë tuaj. Ne kolektojmë:\n- Emri, email, numri i telefonit (për kontakt)\n- Adresa (vetëm për dorëzim)\n- Historia e transaksioneve (për siguri dhe mosmarrëveshje)\n- Cookies (për përmirësim të shërbimit)',
      'Ne NUK:\n- Shitim informacionin tuaj palëve të tretë\n- Përdor email tuaj për spam\n- Ndarje numrin tuaj të telefonit\n- Ndarje adresën tuaj të fizike',
      'Shikoni politikën e plotë të privatësisë në një faqe të veçantë.',
    ]
  },
  {
    id: 'liability',
    title: 'Përgjegjësia dhe Garantit',
    content: [
      'NËNSHKRIM PËRGJEGJËSIE: Trèigo nuk është përgjegjës për:\n- Dëme direkte ose indirekte\n- Humbje të fitimit\n- Humbje të të dhënave\n- Pezullimet e llogarisë\n- Sharje të tretë',
      'Ndërsa bëjmë përpjekjen tonë më të mirë, nuk mund të garantojmë 100% sigurinë. Përdorni platformën nën rrezikun tuaj.',
      'GARANTIMI: Nëse Trèigo bën një gabim (p.sh. dëmtim të fondeve), ne do të kompensojmë ju brenda 30 ditësh.',
    ]
  },
  {
    id: 'termination',
    title: 'Ndërprerja e Llogarisë',
    content: [
      'Trèigo mund të ndërpresë llogarinë tuaj nëse:\n- Shkelni këto terme\n- Përpiqeni të mashtroni\n- Shpallni spam ose përndodhni\n- Kërcënoni ose përfshini përdoruesit e tjerë\n- Nuk paguan gjoba\n- Nuk u përmbahuni ligjeve lokale ose ndërkombëtare',
      'If your account is terminated:\n- You will receive 30 days notice\n- You can appeal within 14 days\n- Your funds will be released after 60 days (minus any penalties)',
      'Ndërprerja përgjithmonë nuk mund të ankohesh.',
    ]
  },
  {
    id: 'changes',
    title: 'Ndryshimet e Termave',
    content: [
      'Trèigo mund të ndryshojë këto terme në çdo kohë pa paralajmërim. Nëse vazhdoni të përdorni platformën, ju pranoni ndryshimet.',
      'Për ndryshime të mëdha, do të njoftojmë përmes email brenda 30 ditësh.',
      'Nëse nuk pajtoheni, mund të fshini llogarinë tuaj përpara se të hyjnë në fuqi ndryshimet.',
    ]
  },
]

export default function TermsPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['general'])

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-treigo-cream py-12">
      <div className="container-treigo max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-treigo-dark mb-3">Termat dhe Kushtet</h1>
          <p className="text-treigo-olive mb-3">Efektive nga: 1 Janar 2024</p>
          <p className="text-treigo-dark/70">
            Përshkrimi i plotë i rregullave dhe politikave të Trèigo Marketplace
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ PARALAJMËRIM I RËNDËSISHËM</h3>
          <p className="text-yellow-800 text-sm">
            Komunikimi jashtë platformës Trèigo (email, telefon, WhatsApp, etj.) <strong>NDALON ABSOLUTISHT</strong> para, gjatë dhe pas çdo transaksioni. Shkeljet do të ndëshkohen me paralajmërim, bllokim, pezullim ose heqje përgjithmonë.
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg border border-treigo-olive/10 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-treigo-cream/50 transition-colors group"
              >
                <h2 className="text-lg font-semibold text-treigo-dark text-left group-hover:text-treigo-forest">
                  {section.title}
                </h2>
                <ChevronDown
                  className={`w-5 h-5 text-treigo-olive transition-transform ${
                    expandedSections.includes(section.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSections.includes(section.id) && (
                <div className="px-6 py-4 bg-treigo-cream/30 border-t border-treigo-olive/10">
                  <div className="space-y-4">
                    {section.content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="text-treigo-dark/80 text-sm leading-relaxed whitespace-pre-wrap"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 p-8 bg-white rounded-lg border border-treigo-olive/10">
          <h3 className="font-bold text-treigo-dark mb-3">Pyetje?</h3>
          <p className="text-treigo-dark/70 mb-4">
            Nëse keni pyetje rreth këtyre termave dhe kushteve, ju lutem{' '}
            <a href="/contact" className="text-treigo-forest hover:underline font-semibold">
              kontaktoni ne
            </a>
            .
          </p>
          <p className="text-sm text-treigo-dark/50">
            Versioni i fundit: 1 Janar 2024 | © 2024 Trèigo. Të gjitha të drejtat e mbrojtura.
          </p>
        </div>
      </div>
    </div>
  )
}
