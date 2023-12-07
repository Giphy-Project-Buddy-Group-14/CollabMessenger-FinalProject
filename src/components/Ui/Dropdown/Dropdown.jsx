import PropTypes from 'prop-types';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export function Dropdown({ children }) {
  return (
    <Menu as="div" className="relative ml-3">
      {children}
    </Menu>
  );
}

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
};

export function DropdownButton({ children, ...rest }) {
  return (
    <div>
      <Menu.Button {...rest}>
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Open menu</span>
        {children}
      </Menu.Button>
    </div>
  );
}

DropdownButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function DropdownItems({ children }) {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {children}
      </Menu.Items>
    </Transition>
  );
}

DropdownItems.propTypes = {
  children: PropTypes.node.isRequired,
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function DropdownItem({ to, title, onClick }) {
  const handleClick = (event) => {
    if (onClick) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          to={to || '#'}
          className={classNames(
            active ? 'bg-gray-100' : '',
            'block px-4 py-2 text-sm text-gray-700'
          )}
          onClick={handleClick}
        >
          {title}
        </Link>
      )}
    </Menu.Item>
  );
}

DropdownItem.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

DropdownItem.defaultProps = {
  to: '',
};
