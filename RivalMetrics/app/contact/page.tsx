import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHero, Card, SectionHeading } from "@/components/ui";
import { socials, site } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  path: "/contact",
  title: "Contact",
  description:
    "Get in touch with the RivalMetrics / FrostByte team. Questions, press, security reports, or just say hi."
});

export default function ContactPage() {
  return (
    <div className="container">
      <PageHero eyebrow="Contact" title="Get in touch">
        <p>
          Questions, press inquiries, security reports, or just want to say
          hi? Drop a message below or reach out on {site.owner}'s official
          channels.
        </p>
      </PageHero>

      <section className="section" style={{ paddingTop: "0.5rem" }}>
        <div className="rm-contact-grid">
          <div>
            <SectionHeading title="Send a message" />
            <Card>
              <ContactForm />
            </Card>
          </div>

          <div>
            <SectionHeading title="Official channels" />
            <Card className="rm-contact-channels">
              <ul className="rm-social-list">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="rm-social-card" rel="noopener noreferrer">
                      <span className="rm-social-label">{s.label}</span>
                      <span className="rm-social-handle">{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Card>

            <SectionHeading title="Security reports" />
            <Card className="rm-contact-sec">
              <p className="muted">
                Found a vulnerability? Please report it responsibly via our
                <a href="/security" className="rm-link"> security disclosure page</a>
                — not a general contact form.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
