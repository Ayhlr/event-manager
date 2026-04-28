import categories from "../data/categories";
import {
  Music,
  Utensils,
  Gamepad2,
  GraduationCap,
  Sparkles,
  Trophy,
  Theater,
  Users,
  Grid3X3
} from "lucide-react";

function CategorySection({ selectedCategory, onCategoryClick }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "music":
        return <Music size={30} />;
      case "food":
        return <Utensils size={30} />;
      case "games":
        return <Gamepad2 size={30} />;
      case "education":
        return <GraduationCap size={30} />;
      case "entertainment":
        return <Sparkles size={30} />;
      case "sports":
        return <Trophy size={30} />;
      case "performance":
        return <Theater size={30} />;
      case "social":
        return <Users size={30} />;
      default:
        return <Grid3X3 size={30} />;
    }
  };

  return (
    <div style={{ padding: "30px 20px", backgroundColor: "#d9d9d9" }}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#030817"
        }}
      >
        Explore by Category
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "35px",
          flexWrap: "wrap"
        }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;

          return (
            <div
              key={category.name}
              onClick={() => onCategoryClick(category.name)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <div
                style={{
                  width: "95px",
                  height: "95px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#1a2238",
color: "#ffffff",
                  border: isSelected
                    ? "2px solid #030817"
                    : "1px solid #030817",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.56)",
                  transition: "0.2s"
                }}
              >
                {getIcon(category.icon)}
              </div>

              <span
                style={{
                  marginTop: "12px",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#030817"
                }}
              >
                {category.name === "All Categories" ? "All" : category.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategorySection;