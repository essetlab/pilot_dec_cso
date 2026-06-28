type PartnerLogo = {
  name: string;
  src: string;
  className?: string;
};

const partnerLogos: PartnerLogo[] = [
  { name: 'European Union', src: '/assets/brand/partners/eu-logo.png', className: 'partner-logo-strip__logo--eu' },
  { name: 'Development Expertise Center', src: '/assets/brand/logos/dec-logo.png', className: 'partner-logo-strip__logo--dec' },
  { name: 'Welthungerhilfe', src: '/assets/brand/partners/whh-logo.png' },
  { name: 'CoSAP', src: '/assets/brand/partners/cosap-logo.png', className: 'partner-logo-strip__logo--cosap' },
  { name: 'Pastoralist Forum Ethiopia', src: '/assets/brand/partners/pfe-logo.png', className: 'partner-logo-strip__logo--pfe' },
  { name: 'Ziviler Friedensdienst', src: '/assets/brand/partners/zfd-logo.png', className: 'partner-logo-strip__logo--zfd' },
];

export default function PartnerLogoFooter() {
  return (
    <footer className="partner-logo-strip" aria-label="Course partner logos">
      <div className="partner-logo-strip__inner">
        {partnerLogos.map((logo) => (
          <img
            key={logo.name}
            src={logo.src}
            alt={logo.name}
            className={`partner-logo-strip__logo ${logo.className || ''}`.trim()}
            loading="eager"
          />
        ))}
      </div>
    </footer>
  );
}
