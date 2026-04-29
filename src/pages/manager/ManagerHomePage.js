import { useEffect, useState } from "react";
import HeroSection from "../../components/HeroSection";
import CategorySection from "../../components/CategorySection";
import SearchBar from "../../components/SearchBar";
import { apiRequest } from "../../api";

function ManagerHomePage() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStadium, setSelectedStadium] = useState("All Stadiums");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getEventDate = (date) => {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) return null;

    parsedDate.setHours(0, 0, 0, 0);
    return parsedDate;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/events");

      const approvedEvents = data.filter(
        (event) => event.status === "approved"
      );

      setEvents(approvedEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredEvents = events.filter((event) => {
    const search = String(searchTerm || "").toLowerCase();

    const title = String(event?.title || "").toLowerCase();
    const location = String(event?.location || "").toLowerCase();
    const organizer = String(
      event?.organizer?.name || event?.organizer || event?.clubName || ""
    ).toLowerCase();

    const category = String(event?.category || "");
    const stadium = String(event?.stadium || event?.location || "");

    const eventDate = getEventDate(event.date);
    const isUpcoming = eventDate && eventDate >= today;

    const matchesSearch =
      title.includes(search) ||
      location.includes(search) ||
      organizer.includes(search);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      selectedCategory === "All" ||
      category === selectedCategory;

    const matchesStadium =
      selectedStadium === "All Stadiums" || stadium === selectedStadium;

    return isUpcoming && matchesSearch && matchesCategory && matchesStadium;
  });

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading events...</p>;
  }

  if (error) {
    return <p style={{ padding: "30px", color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <HeroSection />

      <CategorySection
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStadium={selectedStadium}
        setSelectedStadium={setSelectedStadium}
      />

      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        Upcoming Events
      </h2>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 320px))",
          justifyContent: "center",
          gap: "30px",
          padding: "20px 0 40px"
        }}
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const attending = Number(
              event.attendingCount || event.attending || 0
            );

            const capacity = Number(event.capacity || 0);

            const spotsLeft = Math.max(capacity - attending, 0);

            const progress =
              capacity > 0
                ? Math.min((attending / capacity) * 100, 100)
                : 0;

            const organizerName =
              event.organizer?.name ||
              event.organizer ||
              event.clubName ||
              "Event Manager";

            const eventDate = event.date
              ? new Date(event.date).toLocaleDateString()
              : "No date";

            const defaultImage =
              event.category === "Sports"
                ? "https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
                : event.category === "Educational"
                ? "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b"
                : event.category === "Music"
                ? "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
                : "https://images.unsplash.com/photo-1511795409834-ef04bbd61622";

            return (
              <div
                key={event._id}
                style={{
                  width: "320px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #ddd",
                  background: "white",
                  margin: "15px"
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={
                      event.image && event.image.startsWith("http")
                        ? event.image
                        : defaultImage
                    }
                    onError={(e) => {
                      e.currentTarget.src = defaultImage;
                    }}
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      background: "#ccc"
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "white",
                      border: "1px solid black",
                      padding: "4px 10px",
                      borderRadius: "10px",
                      fontSize: "12px"
                    }}
                  >
                    {event.category}
                  </span>
                </div>

                <div style={{ padding: "15px" }}>
                  <h5 style={{ marginBottom: "5px" }}>{event.title}</h5>

                  <p
                    style={{
                      fontSize: "13px",
                      color: "#777",
                      marginBottom: "10px"
                    }}
                  >
                    by {organizerName}
                  </p>

                  <p style={{ margin: "5px 0" }}>📍 {event.location}</p>
                  <p style={{ margin: "5px 0" }}>📅 {eventDate}</p>
                  <p style={{ margin: "5px 0" }}>
                    ⏰ {event.time || "No time"}
                  </p>

                  <p style={{ margin: "5px 0" }}>
                    👥 {attending} / {capacity} attending
                  </p>

                  <div style={{ marginTop: "10px" }}>
                    <p style={{ fontSize: "12px", marginBottom: "5px" }}>
                      Capacity
                    </p>

                    <div
                      style={{
                        height: "6px",
                        background: "#eee",
                        borderRadius: "10px"
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          background: "black",
                          borderRadius: "10px"
                        }}
                      ></div>
                    </div>

                    <p style={{ fontSize: "12px", textAlign: "right" }}>
                      {spotsLeft} spots left
                    </p>
                  </div>

                  {event.description && (
                    <p
                      style={{
                        marginTop: "12px",
                        padding: "10px",
                        background: "#f8f8f8",
                        borderRadius: "8px",
                        fontSize: "14px"
                      }}
                    >
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              gridColumn: "1 / -1"
            }}
          >
            No events found.
          </p>
        )}
      </div>
    </div>
  );
}

export default ManagerHomePage;