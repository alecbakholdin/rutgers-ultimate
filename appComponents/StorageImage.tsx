import { base64ArrayBuffer } from "util/arrayBuffer";
import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { getDownloadURL, ref } from "@firebase/storage";
import { storage } from "config/firebaseApp";
import { CircularProgress, Stack } from "@mui/material";

export default function ({
  storagePath,
  binary,
  alt,
}: {
  storagePath?: string;
  binary?: ArrayBuffer;
  alt?: string;
}) {
  const base64Binary = useMemo(
    () => binary && base64ArrayBuffer(binary),
    [binary]
  );
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>();
  useEffect(() => {
    if (storagePath) {
      setLoading(true);
      getDownloadURL(ref(storage, storagePath))
        .then(setDownloadUrl)
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    }
  }, [storagePath, binary]);

  const altText = alt || "image";
  const imgStyle: CSSProperties = {
    objectFit: "contain",
    height: "100%",
    width: "100%",
    borderRadius: "5px",
    ...(loading ? { display: "none" } : {}),
  };
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
    >
      {base64Binary ? (
        <img
          src={`data:image/jpeg;base64,${base64Binary}`}
          alt={altText}
          style={imgStyle}
        />
      ) : downloadUrl ? (
        <img
          src={downloadUrl}
          alt={altText}
          style={imgStyle}
          onLoadStartCapture={() => setLoading(true)}
          onLoad={() => setLoading(false)}
        />
      ) : null}
      {loading && <CircularProgress />}
    </Stack>
  );
}
