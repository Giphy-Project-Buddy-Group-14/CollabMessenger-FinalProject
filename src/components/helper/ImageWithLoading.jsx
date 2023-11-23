import PropTypes from "prop-types";
import { useState } from "react";
import LoadingIndicator from "../Ui/LoadingIndicator";

export default function ImageWithLoading({
  src,
  alt,
  className,
  placeholder,
  width = "auto",
  height = "auto",
}) {
  const [imageLoading, setImageLoading] = useState(true);
  const imageStyle = {
    width: width,
    height: height,
    display: imageLoading ? "none" : "block",
  };

  return (
    <>
      <div style={{ width: width, height: height }}>
        {imageLoading && (placeholder || <LoadingIndicator />)}
        <img
          className={className}
          src={src}
          alt={alt}
          onLoad={() => setImageLoading(false)}
          style={imageStyle}
        />
      </div>
    </>
  );
}

ImageWithLoading.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.node,
  width: PropTypes.string,
  height: PropTypes.string,
};
