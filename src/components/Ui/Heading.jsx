import { PropTypes } from 'prop-types';

export default function Heading({ title }) {
  return (
    <h6 className="text-lg font-bold dark:text-white text-center pb-4 pt-4">
      {title}
    </h6>
  );
}

Heading.propTypes = {
  title: PropTypes.string.isRequired,
};
