export const Footer = () => {
  return (
    <footer className="section flex items-center h-16 mt-16 border-t border-gray-100 font-sans">
      <div className="subsection my-auto">
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Tianyu. All rights reserved.
        </div>
      </div>
    </footer>
  )
}