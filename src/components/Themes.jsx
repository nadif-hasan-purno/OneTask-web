import NavBar from "./NavBar";

function Themes() {
  const themes = [
    "light",
    "dark",
    "cupcake",
    "corporate",
    "emerald",
    "synthwave",
    "retro",
    "cyberpunk",
  ];

  const toggleTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <div className="min-h-screen">
      <NavBar themes={themes} onThemeChange={toggleTheme} />

      {/* Main content */}
      <div className="p-8">
        <div className="space-y-4">
          <button className="btn btn-primary">Primary Button</button>
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Card Title</h2>
              <p>
                This card will change appearance based on the selected theme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Themes;
