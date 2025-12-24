import '../App.css'
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { FaArrowRight, FaGithub, FaGlobe, FaMapMarkerAlt, FaPlay, FaRocket, FaServer, FaExternalLinkAlt } from 'react-icons/fa'
import { IoIosAnalytics } from 'react-icons/io'
import { MdDashboardCustomize, MdEmail, MdPhone } from 'react-icons/md'
import { SiReact, SiTailwindcss, SiTensorflow } from 'react-icons/si'

const API_URL = import.meta.env.VITE_API_URL

const stats = [
  { label: 'Products shipped', value: '40+' },
  { label: 'Interns placed', value: '120+' },
  { label: 'Clients served', value: '25+' },
]

const services = [
  { title: 'Software Development', icon: <FaServer />, desc: 'Cloud-first builds with resilient architectures.' },
  { title: 'Web Development', icon: <SiReact />, desc: 'High-performance web apps with modern stacks.' },
  { title: 'Mobile App Development', icon: <FaGlobe />, desc: 'Cross-platform apps with native feel.' },
  { title: 'UI / UX Design', icon: <SiTailwindcss />, desc: 'Clean, conversion-friendly product design.' },
  { title: 'Training & Workshops', icon: <FaPlay />, desc: 'Hands-on upskilling for teams and students.' },
  { title: 'Internship Programs', icon: <MdDashboardCustomize />, desc: 'Real projects, mentorship, and proof of work.' },
  { title: 'Project Guidance', icon: <IoIosAnalytics />, desc: 'Architecture reviews and delivery coaching.' },
  { title: 'AI Integration', icon: <SiTensorflow />, desc: 'ML pipelines and AI features that scale.' },
]

type Internship = {
  id: number
  title: string
  skills: string[]
  duration: string
  mode: string
  stipend: string
  status: string
  link: string | null
  description: string | null
}

const projects = [
  {
    title: 'Realtime Analytics Dashboard',
    tech: ['React', 'Node', 'WebSockets'],
    desc: 'Live telemetry for IoT fleets with alerting and anomaly detection.',
    link: '#',
  },
  {
    title: 'AI Resume Screener',
    tech: ['Python', 'NLP', 'Vector DB'],
    desc: 'Automated candidate shortlisting with explainable scoring.',
    link: '#',
  },
  {
    title: 'Fintech Mobile Suite',
    tech: ['React Native', 'GraphQL', 'Stripe'],
    desc: 'Secure payments, KYC, and savings automation in one app.',
    link: '#',
  },
  {
    title: 'Cloud Cost Optimizer',
    tech: ['AWS', 'Lambda', 'Step Functions'],
    desc: 'Scheduled optimizations that reduce spend with zero downtime.',
    link: '#',
  },
  {
    title: 'Cyber Range Lab',
    tech: ['Kubernetes', 'gRPC', 'Rust'],
    desc: 'Isolated lab for security drills and automated scoring.',
    link: '#',
  },
  {
    title: 'Vision Quality Inspector',
    tech: ['PyTorch', 'Edge AI', 'ONNX'],
    desc: 'Defect detection on the edge with cloud sync for retraining.',
    link: '#',
  },
]

const contact = {
  email: 'tusharsingh2262@gmail.com',
  phone: '+91 9015588822',
  address: 'Remote-first, with hubs in NYC & saharsa',
}

const Badge = ({ children }: { children: ReactNode }) => <span className="chip">{children}</span>

function Home() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    try {
      const res = await fetch(`${API_URL}/internships`)
      const data = await res.json()
      setInternships(data.internships || [])
    } catch (err) {
      console.error("Failed to fetch internships:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="hero">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="grid-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Modern Software Solution</p>
          <h1>
            Build. Launch. <span className="gradient-text">Scale.</span>
          </h1>
          <p className="lede">
            We design and run products end-to-end. Apply to our internship program or explore the work we build
            for clients world wide.
          </p>
          <div className="hero-actions">
            <button className="btn primary">
              Apply for Internship <FaArrowRight />
            </button>
            <button className="btn ghost">
              View Projects <FaPlay />
            </button>
          </div>
          {/* <div className="stats">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div> */}
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <div className="floating-header">
              <div className="pulse-dot" />
              <p>Live Delivery Pipeline</p>
              <FaRocket />
            </div>
            <div className="floating-body">
              <div className="pipeline-step active">Design</div>
              <div className="pipeline-step active">Build</div>
              <div className="pipeline-step active">Deploy</div>
              <div className="pipeline-step">Scale</div>
            </div>
            <div className="floating-footer">
              <div className="badge success">99.9% uptime</div>
              <div className="badge subtle">AI assisted</div>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <p className="eyebrow">What we offer</p>
          <h2>Services tailored to ship fast</h2>
          <p className="lede">From concept to production with senior engineers, designers, and mentors.</p>
        </div>
        <div className="grid cards">
          {services.map((service) => (
            <div key={service.title} className="card">
              <div className="icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <p className="eyebrow">Internship programs</p>
          <h2>Learn by building production-grade products</h2>
          <p className="lede">
            Card-based listings with filters for domain, duration, and mode. Add links via the admin dashboard when you
            are ready.
          </p>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            Loading internships...
          </div>
        ) : internships.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            No internships available at the moment. Check back soon!
          </div>
        ) : (
          <div className="grid cards">
            {internships.map((intern) => (
              <div key={intern.id} className="card">
                <div className="card-top">
                  <div className="badge accent">{intern.status === 'Accepting' ? 'Open' : intern.status}</div>
                  <h3>{intern.title}</h3>
                  <p>{intern.duration} • {intern.mode}</p>
                </div>
                <div className="chips">
                  {intern.skills.map((skill, idx) => (
                    <Badge key={idx}>{skill}</Badge>
                  ))}
                </div>
                {intern.description && (
                  <p style={{ margin: '12px 0', color: '#cbd5e1', fontSize: '14px' }}>
                    {intern.description}
                  </p>
                )}
                <div className="card-footer">
                  <span className="stipend">Stipend: {intern.stipend}</span>
                  {intern.link ? (
                    <a
                      href={intern.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn small"
                    >
                      Apply <FaExternalLinkAlt />
                    </a>
                  ) : (
                    <button className="btn small" disabled>
                      Apply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <p className="eyebrow">Featured work</p>
          <h2>Projects that keep shipping</h2>
          <p className="lede">Grid gallery with filters by Web, App, AI/ML, Cloud, Cybersecurity, and more.</p>
        </div>
        <div className="grid cards projects">
          {projects.map((project) => (
            <div key={project.title} className="card project-card">
              <div className="card-top">
                <h3>{project.title}</h3>
                <div className="chips">
                  {project.tech.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </div>
              <p>{project.desc}</p>
              <div className="card-footer">
                <button className="btn text">
                  View more <FaArrowRight />
                </button>
                <div className="ghost-link">
                  <FaGithub /> <span>GitHub</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section contact">
        <div>
          <p className="eyebrow">About & contact</p>
          <h2>Let’s build something bold</h2>
          <p className="lede">
            Mission-driven team shipping reliable software. Remote-first with global clients and a strong mentor network
            for interns.
          </p>
          <div className="contact-list">
            <div className="contact-item">
              <MdEmail /> <span>{contact.email}</span>
            </div>
            <div className="contact-item">
              <MdPhone /> <span>{contact.phone}</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt /> <span>{contact.address}</span>
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn primary">
              Contact us <FaArrowRight />
            </button>
            <button className="btn ghost">
              View dashboard <MdDashboardCustomize />
            </button>
          </div>
        </div>
        <div className="contact-card">
          <p className="eyebrow">Admin dashboard idea</p>
          <h3>Manage internships & projects</h3>
          <ul>
            <li>Add/remove internship postings with deadlines and status.</li>
            <li>Update project cards, tech stack, and filters.</li>
            <li>View applications and inquiry messages.</li>
            <li>Analytics: page views and applies.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Home
