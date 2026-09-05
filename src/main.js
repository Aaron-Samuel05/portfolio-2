/**
 * MAIN ORCHESTRATOR - DIGITAL STUDIO EXPERIENCE
 * Aaron Ebenezer Samuel Portfolio
 */

import { personalData, projects, skillDomains, areasOfCuriosity } from './data/portfolioData.js';
import { SceneManager } from './3d/SceneManager.js';
import { Cursor } from './interactions/Cursor.js';
import { Preloader } from './interactions/Preloader.js';
import { AudioEngine } from './interactions/AudioEngine.js';

class PortfolioApp {
  constructor() {
    this.sceneManager = null;
    this.cursor = null;
    this.audio = null;
    this.pingPong = null;
    this.currentDomainId = 'languages';
    this.init();
  }

  init() {
    this.cursor = new Cursor();
    this.audio = new AudioEngine();
    new Preloader(() => this.onReady());
    this.initRoleCycler();
    this.initSkillsMatrix();
    this.initContactActions();
    this.initScrollObservers();
    this.initHeaderBehavior();
    this.initMobileNav();
    this.initExperienceMotion();
  }

  onReady() {
    console.log('[PortfolioApp] Unmasked & Initialized');
    const container = document.getElementById('webgl-container');
    if (container) this.sceneManager = new SceneManager(container);
    this.initHeroSequence();
  }

  /* The opening behaves like a title sequence: let the 3D object have the stage first. */
  initHeroSequence() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    hero.classList.add('hero-sequence-active');

    const revealHeroCopy = () => {
      hero.classList.add('hero-copy-revealed');
      document.querySelectorAll('.hero-section .reveal-line').forEach((el, i) => {
        setTimeout(() => el.closest('.reveal-wrapper')?.classList.add('is-in-view'), i * 130);
      });
    };

    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : 1250;
    window.setTimeout(revealHeroCopy, delay);
  }

  initRoleCycler() {
    const el = document.getElementById('hero-role-text');
    if (!el) return;
    const roles = ['SOFTWARE ENGINEER', 'CREATIVE TECHNOLOGIST', 'SRM CSE BUILDER', 'SYSTEMS ARCHITECT'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const tick = () => {
      const currentRole = roles[roleIndex];
      el.textContent = isDeleting ? currentRole.substring(0, charIndex - 1) : currentRole.substring(0, charIndex + 1);
      charIndex += isDeleting ? -1 : 1;
      let speed = isDeleting ? 30 : 65;
      if (!isDeleting && charIndex === currentRole.length) { speed = 2200; isDeleting = true; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 400; }
      setTimeout(tick, speed);
    };
    setTimeout(tick, 1000);
  }

  initSkillsMatrix() {
    const tabsContainer = document.getElementById('domain-tabs');
    const nodesContainer = document.getElementById('skills-nodes');
    const inspector = document.getElementById('matrix-inspector');
    if (!tabsContainer || !nodesContainer || !inspector) return;

    tabsContainer.innerHTML = skillDomains.map((domain, i) => `
      <button class="domain-tab ${domain.id === this.currentDomainId ? 'is-active' : ''}" data-domain="${domain.id}" data-cursor="pointer">
        <span class="domain-idx">[0${i + 1}]</span><span>${domain.title.toUpperCase()}</span>
      </button>`).join('');

    tabsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.domain-tab');
      if (!btn) return;
      const domainId = btn.getAttribute('data-domain');
      if (domainId === this.currentDomainId) return;
      this.currentDomainId = domainId;
      document.querySelectorAll('.domain-tab').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      this.renderSkillsForDomain(domainId);
    });
    this.renderSkillsForDomain(this.currentDomainId);
  }

  renderSkillsForDomain(domainId) {
    const domain = skillDomains.find(d => d.id === domainId);
    const nodesContainer = document.getElementById('skills-nodes');
    if (!domain || !nodesContainer) return;
    nodesContainer.innerHTML = domain.skills.map((s, idx) => `
      <div class="skill-node ${idx === 0 ? 'is-selected' : ''}" data-skill="${s.name}" data-cursor="pointer">
        <div class="node-top"><span class="node-name">${s.name}</span><span class="node-level">${s.level}</span></div>
        <p class="node-desc">${s.desc}</p>
      </div>`).join('');
    nodesContainer.querySelectorAll('.skill-node').forEach(node => node.addEventListener('click', () => {
      nodesContainer.querySelectorAll('.skill-node').forEach(n => n.classList.remove('is-selected'));
      node.classList.add('is-selected');
      const skillObj = domain.skills.find(s => s.name === node.getAttribute('data-skill'));
      if (skillObj) this.updateInspector(domain, skillObj);
    }));
    if (domain.skills.length) this.updateInspector(domain, domain.skills[0]);
  }

  updateInspector(domain, skill) {
    const tag = document.getElementById('inspector-tag');
    const title = document.getElementById('inspector-title');
    const domainName = document.getElementById('inspector-domain');
    const body = document.getElementById('inspector-body');
    const levelVal = document.getElementById('inspector-level');
    const focusVal = document.getElementById('inspector-focus');
    if (tag) tag.textContent = domain.code;
    if (title) title.textContent = skill.name;
    if (domainName) domainName.textContent = domain.title;
    if (body) body.textContent = `${skill.desc}. Rigorously applied across real-world projects and active academic research at SRM Institute of Science & Technology.`;
    if (levelVal) levelVal.textContent = skill.level;
    if (focusVal) focusVal.textContent = domain.title;
  }

  initContactActions() {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    let isSubmitting = false;
    const showToast = (message) => {
      if (!toast || !toastMsg) return;
      toastMsg.textContent = message;
      toast.classList.add('is-active');
      setTimeout(() => toast.classList.remove('is-active'), 2600);
    };
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) copyEmailBtn.addEventListener('click', () => navigator.clipboard.writeText(personalData.contacts.email).then(() => showToast(`COPIED EMAIL // ${personalData.contacts.email}`)));
    const copyPhoneBtn = document.getElementById('copy-phone-btn');
    if (copyPhoneBtn) copyPhoneBtn.addEventListener('click', () => navigator.clipboard.writeText(personalData.contacts.phoneRaw).then(() => showToast(`COPIED PHONE // ${personalData.contacts.phone}`)));

    const contactForm = document.getElementById('transmission-form');
    if (!contactForm) return;
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting || !contactForm.reportValidity()) return;
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const status = document.getElementById('form-status');
      const formData = Object.fromEntries(new FormData(contactForm).entries());
      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.querySelector('span').textContent = 'TRANSMITTING...';
      if (status) { status.textContent = ''; status.className = 'form-status'; }
      try {
        const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Unable to send your message right now.');
        contactForm.reset();
        if (status) { status.textContent = 'Message received.'; status.className = 'form-status is-success'; }
        showToast('MESSAGE RECEIVED');
      } catch (error) {
        if (status) { status.textContent = error.message; status.className = 'form-status is-error'; }
      } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        submitBtn.querySelector('span').textContent = 'DISPATCH TRANSMISSION';
      }
    });
  }

  initScrollObservers() {
    const sections = [...document.querySelectorAll('main > section')];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in-view');
        const sectionId = entry.target.getAttribute('id');
        if (sectionId) document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`));
      });
    }, { threshold: 0.2, rootMargin: '-10% 0px -35% 0px' });
    sections.forEach(el => observer.observe(el));
  }

  initExperienceMotion() {
    const progress = document.createElement('div');
    progress.className = 'experience-progress';
    progress.innerHTML = '<span></span>';
    document.body.appendChild(progress);

    const spotlight = document.createElement('div');
    spotlight.className = 'experience-spotlight';
    spotlight.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spotlight);

    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty('--scroll-progress', ratio.toFixed(4));
      progress.style.setProperty('--progress', `${ratio * 100}%`);
      const sections = [...document.querySelectorAll('main > section')];
      const active = sections.reduce((best, section) => {
        const distance = Math.abs(section.getBoundingClientRect().top - window.innerHeight * 0.32);
        return !best || distance < best.distance ? { section, distance } : best;
      }, null);
      if (active?.section?.id) document.body.dataset.section = active.section.id;
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { updateScroll(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    updateScroll();

    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', (event) => {
        document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
      }, { passive: true });
    }
  }

  initHeaderBehavior() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 50);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.header__nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('is-open'));
    nav.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => nav.classList.remove('is-open')));
  }
}

window.addEventListener('DOMContentLoaded', () => new PortfolioApp());
