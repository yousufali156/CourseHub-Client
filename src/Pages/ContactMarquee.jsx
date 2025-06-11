import React, { useEffect } from 'react';

const icons = [
  'fab fa-github',
  'fab fa-codepen',
  'fab fa-free-code-camp',
  'fab fa-dev',
  'fab fa-react',
  'fab fa-vuejs',
  'fab fa-angular',
  'fab fa-node',
  'fab fa-wordpress',
  'fab fa-aws',
  'fab fa-docker',
  'fab fa-android',
];

const ContactMarquee = () => {
  useEffect(() => {
    const root = document.documentElement;
    const displayed = getComputedStyle(root).getPropertyValue('--marquee-elements-displayed');
    const content = document.querySelector('ul.marquee-content');

    root.style.setProperty('--marquee-elements', content.children.length);

    for (let i = 0; i < displayed; i++) {
      content.appendChild(content.children[i].cloneNode(true));
    }
  }, []);

  return (
    <div
      className="w-full md:w-[80vw] h-[16vh] md:h-[20vh] bg-black text-white overflow-hidden relative mx-auto my-10"
      style={{
        '--marquee-elements-displayed': '3',
        '--marquee-element-width': 'calc(100vw / 3)',
        '--marquee-animation-duration': `calc(var(--marquee-elements) * 3s)`,
      }}
    >
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-20 md:w-40 h-full z-10 bg-gradient-to-r from-black to-transparent" />
      <div className="absolute top-0 right-0 w-20 md:w-40 h-full z-10 bg-gradient-to-l from-black to-transparent" />

      <ul
        className="marquee-content list-none h-full flex animate-[scrolling_linear_infinite]"
        style={{
          animationDuration: 'calc(var(--marquee-elements) * 3s)',
        }}
      >
        {icons.map((icon, index) => (
          <li
            key={index}
            className="flex justify-center items-center shrink-0 w-[calc(100vw/3)] md:w-[calc(80vw/5)] text-[12vh] md:text-[15vh]"
          >
            <i className={icon}></i>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactMarquee;
