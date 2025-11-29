export const Footer = () => {
  return (
    <footer className="section flex items-center h-16 mt-16 border-t border-neutral-200 font-sans">
      <div className="subsection my-auto">
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} coded and designed by Tianyu. All rights reserved.
        </div>
      </div>
    </footer>
  )
}