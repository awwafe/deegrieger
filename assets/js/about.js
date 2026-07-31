(() => {
  'use strict';

  const mobileQuery = window.matchMedia('(max-width: 63.999rem)');
  const header = document.querySelector('[data-site-header]');
  const menuButton = document.querySelector('.mobile-menu');
  const navigation = document.getElementById('primary-navigation');

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    const label = menuButton.querySelector('[data-menu-label]');
    if (label) label.textContent = 'Open navigation';
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
      const label = menuButton.querySelector('[data-menu-label]');
      if (label) label.textContent = open ? 'Close navigation' : 'Open navigation';
    });

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('click', (event) => {
      if (header && !header.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  const disclosureSections = [...document.querySelectorAll('[data-disclosure]')];

  const applyDisclosureState = (section) => {
    const expanded = section.dataset.expanded === 'true';
    const useDisclosure = mobileQuery.matches;
    const button = section.querySelector('[data-disclosure-toggle]');
    const label = section.querySelector('[data-disclosure-label]');
    const extraContent = [...section.querySelectorAll('[data-disclosure-extra]')];

    extraContent.forEach((element) => {
      element.hidden = useDisclosure && !expanded;
    });

    if (button) button.setAttribute('aria-expanded', String(expanded));
    if (label) label.textContent = expanded ? 'Collapse section' : 'Continue reading';
  };

  disclosureSections.forEach((section) => {
    const button = section.querySelector('[data-disclosure-toggle]');
    if (!button) return;

    button.addEventListener('click', () => {
      const nextState = section.dataset.expanded !== 'true';
      section.dataset.expanded = String(nextState);
      applyDisclosureState(section);
    });

    applyDisclosureState(section);
  });

  const handleBreakpointChange = () => {
    disclosureSections.forEach(applyDisclosureState);
    if (!mobileQuery.matches) closeMenu();
  };

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', handleBreakpointChange);
  } else {
    mobileQuery.addListener(handleBreakpointChange);
  }

  const indexLinks = [...document.querySelectorAll('[data-section-index] a[href^="#"]')];
  const sections = indexLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveIndex = (sectionId) => {
    indexLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  indexLinks.forEach((link) => {
    link.addEventListener('click', () => setActiveIndex(link.getAttribute('href').slice(1)));
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveIndex(visible.target.id);
    }, {
      rootMargin: '-20% 0px -62% 0px',
      threshold: [0.01, 0.2, 0.5]
    });

    sections.forEach((section) => observer.observe(section));
  }
})();
