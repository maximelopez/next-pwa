"use client";

import { useState, useEffect } from "react";
import Camera from "../../components/Camera";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<string[]>([]);

  // Charger les photos depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem("photos");
    if (stored) setPhotos(JSON.parse(stored));
  }, []);

  // Ajouter une photo
  const addPhoto = (newPhoto: string) => {
    setPhotos(prev => {
      const updated = [newPhoto, ...prev];
      localStorage.setItem("photos", JSON.stringify(updated));
      return updated;
    });
  };

  // Supprimer une photo par index
  const deletePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("photos", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="container">
      <Camera addPhoto={addPhoto} />

      {photos.length > 0 && (
        <div className="gallery">
          <h3>Galerie</h3>
          <div className="photos" style={{ display: "flex", flexWrap: "wrap" }}>
            {photos.map((photo, idx) => (
              <div key={idx} style={{ position: "relative", margin: 5 }}>
                <img
                  src={photo}
                  alt={`Photo ${idx}`}
                  style={{ width: 150, height: 150, objectFit: "cover" }}
                />
                <button
                  onClick={() => deletePhoto(idx)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                  }}
                  title="Supprimer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
