import PropTypes from 'prop-types';
import { useState } from 'react';
import LoadingIndicator from '../Ui/LoadingIndicator';
import { EMPTY_PROFILE_PICTURE } from '../../common/constants';
export default function ImageWithLoading({
  src,
  alt,
  className,
  placeholder,
  width = 'auto',
  height = 'auto',
}) {
  const [imageLoading, setImageLoading] = useState(true);
  const imageStyle = {
    width: width,
    height: height,
    display: imageLoading ? 'none' : 'block',
  };

  return (
    <>
      <div style={{ width: width, height: height }}>
        {imageLoading && (placeholder || <LoadingIndicator />)}
        <img
          className={className}
          src={src || EMPTY_PROFILE_PICTURE}
          alt={alt}
          onLoad={() => setImageLoading(false)}
          style={imageStyle}
        />
      </div>
    </>
  );
}

ImageWithLoading.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.node,
  width: PropTypes.string,
  height: PropTypes.string,
};
