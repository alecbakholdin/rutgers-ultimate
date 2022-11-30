import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";

export default function ImageGallery({
  imageLinks,
}: {
  imageLinks?: string[];
}): React.ReactElement {
  const images = imageLinks?.filter((link) => link) ?? [];
  const [activeImage, setActiveImage] = useState<string | undefined>(
    images.length > 0 ? images[0] : undefined
  );
  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images]);

  return (
    <Grid container>
      <Grid key={"main-image"} item xs={12}>
        {activeImage && <img src={activeImage} width={"100%"} />}
      </Grid>
      {images?.length > 1 &&
        images.map((image, i) => (
          <Grid
            key={"image-" + i}
            item
            sx={{
              padding: 0.3,
              margin: 0.3,
              border: `2px solid ${image === activeImage ? "red" : "gray"}`,
              borderRadius: 2,
              "&:hover": {
                cursor: "pointer",
              },
            }}
            onClick={() => setActiveImage(image)}
          >
            <img src={image} height={"50px"} />
          </Grid>
        ))}
    </Grid>
  );
}
