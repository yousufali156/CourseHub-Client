import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faCodepen,
  faFreeCodeCamp,
  faDev,
  faReact,
  faVuejs,
  faAngular,
  faNodeJs,
  faWordpress,
  faAws,
  faDocker,
  faAndroid,
} from '@fortawesome/free-brands-svg-icons';

const icons = [
  faAndroid,
  faGithub,
  faCodepen,
  faFreeCodeCamp,
  faDev,
  faReact,
  faVuejs,
  faAngular,
  faNodeJs,
  faWordpress,
  faAws,
  faDocker,
];

const ContactMarquee = () => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const displayed = window.innerWidth < 640 ? 3 : 6;

    marquee.style.setProperty('--marquee-elements-displayed', displayed);
    marquee.style.setProperty('--marquee-elements', icons.length);

    for (let i = 0; i < displayed; i++) {
      const clone = marquee.children[i].cloneNode(true);
      marquee.appendChild(clone);
    }
  }, []);

  return (
    <div className="w-full bg-black overflow-hidden relative h-[100px]">
      {/* gradient edges */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black to-transparent z-10" />

      <ul
        ref={marqueeRef}
        className="flex h-full items-center gap-12 animate-marquee"
        style={{
          '--marquee-elements-displayed': 6,
          '--marquee-elements': icons.length,
          '--marquee-animation-duration': `${icons.length * 2}s`,
        }}
      >
        {icons.map((icon, index) => (
          <li
            key={index}
            className="min-w-[80px] text-4xl text-white text-center animate-colorChange"
          >
            <FontAwesomeIcon icon={icon} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactMarquee;
