import { useState } from 'react';
import ConversationsList from './ConversationsList';
import Split from 'react-split-grid';
import './Grid.css';
import { Outlet } from 'react-router-dom';

export default function Conversations() {
  const [columns, setColumns] = useState('1fr 1px 4fr');

  const handleDrag = (direction, track, gridTemplateStyle) => {
    setColumns(gridTemplateStyle);
  };

  return (
    <>
      <Split
        gridTemplateColumns={columns}
        onDrag={handleDrag}
        cursor="col-resize"
        render={({ getGridProps, getGutterProps }) => (
          <div className="split-grid" {...getGridProps()}>
            <div className="split-column">
              <ConversationsList />
            </div>
            <div
              className="split-column gutter gutter-vertical"
              {...getGutterProps('column', 1)}
            />
            <div className="flex flex-col">
              <Outlet />
            </div>
          </div>
        )}
      />
    </>
  );
}
