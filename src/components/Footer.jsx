import { Link } from 'react-router-dom'

const footerLinks = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Jobs', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Use', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Cookie Preferences', href: '#' },
      { label: 'Legal Notices', href: '#' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'FAQ', href: '#' },
      { label: 'Account', href: '#' },
      { label: 'Media Center', href: '#' },
      { label: 'Ways to Watch', href: '#' },
    ],
  },
]

const Footer = () => {
  return (
    <footer className="bg-netflix-black border-t border-white/10 mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-12">
        <div className="mb-8">
          <Link to="/" className="text-netflix-red text-2xl font-display font-bold tracking-tight">
            MOVIEFLIX
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white/70 text-sm font-medium mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-white/80 text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-white/10">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} MovieFlix. All rights reserved. This is a demo project for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
