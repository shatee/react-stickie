import React, { ReactElement, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Sticky } from '../../src';
import { content } from './content';

const ignorePositionSticky = false;
// const ignorePositionSticky = true;

const StickyHeader = ({ heading }: { heading: string }) => {
  const [isStick, setStick] = useState(false);

  const onChange = useCallback((isStick) => {
    setStick(isStick);
    console.log(isStick, 'header', heading);
  }, []);

  return (
    <Sticky
      className="headerWrapper"
      top={20}
      ignorePositionSticky={ignorePositionSticky}
      onChange={onChange}
    >
      <header className={isStick ? 'stick' : ''}>
        <h1>{heading}</h1>
        <div>isStick: {isStick ? 'true' : 'false'}</div>
      </header>
    </Sticky>
  );
};

const StickyFooter = ({ heading }: { heading: string }) => {
  const [isStick, setStick] = useState(false);

  const onChange = useCallback((isStick) => {
    setStick(isStick);
    console.log(isStick, 'footer', heading);
  }, []);

  return (
    <Sticky
      className="footerWrapper"
      bottom={20}
      ignorePositionSticky={ignorePositionSticky}
      onChange={onChange}
    >
      <footer className={isStick ? 'stick' : ''}>
        <h1>{heading}</h1>
        <div>isStick: {isStick ? 'true' : 'false'}</div>
      </footer>
    </Sticky>
  );
};

const App = (): ReactElement => {
  return (
    <div className="container">
      {content.map(({ heading, body }) => (
        <section key={heading}>
          <StickyHeader heading={heading} />
          <pre>{body}</pre>
          <StickyFooter heading={heading} />
        </section>
      ))}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('.app'));
