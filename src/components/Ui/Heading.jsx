import { PropTypes } from 'prop-types';

export default function Heading({ title }) {
  return <div className="text-m font-bold dark:text-white pb-6">{title}</div>;
}

Heading.propTypes = {
  title: PropTypes.string.isRequired,
};
