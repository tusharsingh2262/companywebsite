// import { Outlet } from "react-router-dom"
// import Header from "../components/Header"
// import Footer from "../components/Footer"

// export default function MainLayout() {
//   return (
//     <div className="app-shell">
//       <Header />
//       <main className="app-content">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   )
// }


import { Outlet } from "react-router-dom"
import { useState } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

export default function MainLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="app-layout">
      <Header onMenuClick={() => setOpen(true)} />

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="content">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
