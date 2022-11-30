"use client";

import React, { ImgHTMLAttributes, useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

export default function SwitchableImage(
  props: ImgHTMLAttributes<any> & {
    defaultWidth?: number;
    defaultHeight?: number;
  }
): React.ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const defaultHeight = props.defaultHeight || 100;
  const defaultWidth = props.defaultWidth || 100;

  const [{ height, width }, setDimensions] = useState({
    height: defaultHeight,
    width: defaultWidth,
  });
  const [loading, setLoading] = useState(true);
  const handleStartLoading = () => {
    setDimensions({
      height: divRef.current?.clientHeight || defaultHeight,
      width: divRef.current?.clientWidth || defaultWidth,
    });
    setLoading(true);
  };
  return (
    <div ref={divRef}>
      {loading && (
        <Box
          height={height}
          width={width}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress size={50} />
        </Box>
      )}
      <img
        alt={"Loading Image"}
        {...props}
        onLoadStartCapture={handleStartLoading}
        onLoad={() => setLoading(false)}
        style={loading ? { display: "none" } : undefined}
      />
    </div>
  );
}
