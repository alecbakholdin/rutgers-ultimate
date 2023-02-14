import { base64ArrayBuffer } from "util/arrayBuffer";
import React, { useEffect, useMemo, useState } from "react";
import { getDownloadURL, ref } from "@firebase/storage";
import { storage } from "config/firebaseApp";

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
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>();
  useEffect(() => {
    if (storagePath) {
      getDownloadURL(ref(storage, storagePath))
        .then(setDownloadUrl)
        .catch(console.error);
    }
  }, [storagePath, binary]);

  const altText = alt || "image";
  const imgStyle = {
    maxHeight: "100%",
    maxWidth: "100%",
    borderRadius: "5px",
  };
  return base64Binary ? (
    <img
      src={`data:image/jpeg;base64,${base64Binary}`}
      alt={altText}
      style={imgStyle}
    />
  ) : downloadUrl ? (
    <img src={downloadUrl} alt={altText} style={imgStyle} />
  ) : (
    <></>
  );
}
