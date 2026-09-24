import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">EduMarks</div>
      <div className="navbar-links">
        <a href="#">Dashboard</a>
        <a href="#">Marks Entry</a>
        <a href="#">Results</a>
      </div>
    </nav>
  );
}

export default Navbar;
