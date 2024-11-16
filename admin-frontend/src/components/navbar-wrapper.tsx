// "use client";

// import dynamic from "next/dynamic";

// const Navbar = dynamic(() => import("./navbar"), { ssr: false });

// export default function NavbarWrapper() {
//   return <Navbar />;
// }

"use client";

import dynamic from "next/dynamic";

const DynamicSidebar = dynamic(
  () => import("./app-sidebar").then((mod) => mod.AppSidebar),
  { ssr: false }
);

export default function SidebarWrapper() {
  return (
    <div className="sidebar-wrapper">
      <DynamicSidebar />
    </div>
  );
}
