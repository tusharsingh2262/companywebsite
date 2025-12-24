import { useState, useEffect } from "react"
import { FaPlus, FaEdit, FaTrash, FaLink, FaCheck, FaTimes } from "react-icons/fa"
import { useAppSelector } from "../store/hooks"

const API_URL = import.meta.env.VITE_API_URL

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

export default function AdminDashboard() {
  const { token } = useAppSelector((s) => s.auth)
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    skills: "",
    duration: "",
    mode: "Remote",
    stipend: "",
    status: "Accepting",
    link: "",
    description: "",
  })

  // Fetch internships
  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/internships`)
      const data = await res.json()
      setInternships(data.internships || [])
      setError("")
    } catch (err) {
      setError("Failed to load internships")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    const payload = {
      ...formData,
      skills: skillsArray,
      link: formData.link || null,
      description: formData.description || null,
    }

    try {
      const url = editingId
        ? `${API_URL}/internships/${editingId}`
        : `${API_URL}/internships`

      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to save internship")
      }

      await fetchInternships()
      resetForm()
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to save internship")
    }
  }

  const handleEdit = (internship: Internship) => {
    setFormData({
      title: internship.title,
      skills: internship.skills.join(", "),
      duration: internship.duration,
      mode: internship.mode,
      stipend: internship.stipend,
      status: internship.status,
      link: internship.link || "",
      description: internship.description || "",
    })
    setEditingId(internship.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this internship?")) return

    try {
      const res = await fetch(`${API_URL}/internships/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to delete internship")
      }

      await fetchInternships()
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to delete internship")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      skills: "",
      duration: "",
      mode: "Remote",
      stipend: "",
      status: "Accepting",
      link: "",
      description: "",
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage internships and other details</p>
        </div>
        <button className="btn primary" onClick={() => setShowForm(true)}>
          <FaPlus /> Add New Internship
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {showForm && (
        <div className="admin-form-card">
          <div className="admin-form-header">
            <h2>{editingId ? "Edit Internship" : "Add New Internship"}</h2>
            <button className="btn ghost small" onClick={resetForm}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Web Development Intern"
                required
              />
            </div>

            <div className="form-group">
              <label>Skills (comma-separated) *</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, TypeScript, Tailwind"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration *</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="3 months"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mode *</label>
                <select
                  value={formData.mode}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  required
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Stipend *</label>
                <input
                  type="text"
                  value={formData.stipend}
                  onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                  placeholder="Yes / No / Performance-based"
                  required
                />
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="Accepting">Accepting</option>
                  <option value="Waitlist">Waitlist</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Application Link</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com/apply"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details about this internship..."
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn primary">
                <FaCheck /> {editingId ? "Update" : "Create"} Internship
              </button>
              <button type="button" className="btn ghost" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading internships...</div>
      ) : (
        <div className="admin-internships-list">
          {internships.length === 0 ? (
            <div className="admin-empty">
              <p>No internships found. Click "Add New Internship" to create one.</p>
            </div>
          ) : (
            internships.map((internship) => (
              <div key={internship.id} className="admin-internship-card">
                <div className="admin-internship-header">
                  <div>
                    <h3>{internship.title}</h3>
                    <div className="admin-internship-meta">
                      <span className="badge accent">{internship.status}</span>
                      <span>{internship.duration} • {internship.mode}</span>
                    </div>
                  </div>
                  <div className="admin-internship-actions">
                    <button
                      className="btn ghost small"
                      onClick={() => handleEdit(internship)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="btn ghost small"
                      onClick={() => handleDelete(internship.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>

                <div className="admin-internship-skills">
                  {internship.skills.map((skill, idx) => (
                    <span key={idx} className="chip">{skill}</span>
                  ))}
                </div>

                <div className="admin-internship-footer">
                  <span>Stipend: {internship.stipend}</span>
                  {internship.link && (
                    <a
                      href={internship.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn text small"
                    >
                      <FaLink /> View Link
                    </a>
                  )}
                </div>

                {internship.description && (
                  <p className="admin-internship-description">{internship.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
