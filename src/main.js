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
    // 1. Initialize Magnetic Cursor
    this.cursor = new Cursor();

    // 2. Initialize Audio Engine
    this.audio = new AudioEngine();

    // 3. Initialize Preloader
    new Preloader(() => {
      this.onReady();
    });

    // 4. Bind interactive components
    this.initRoleCycler();
    this.initSkillsMatrix();
    this.initContactActions();
    this.initScrollObservers();
    this.initHeaderBehavior();
    this.initMobileNav();
  }

  onReady() {
    console.log('[PortfolioApp] Unmasked & Initialized');

    // Mount Three.js WebGL Scene
    const container = document.getElementById('webgl-container');
    if (container) {
      this.sceneManager = new SceneManager(container);
    }

    // Reveal Hero elements with crisp rhythm
    document.querySelectorAll('.hero-section .reveal-line').forEach((el, i) => {
      setTimeout(() => {
        el.closest('.reveal-wrapper')?.classList.add('is-in-view');
      }, i * 150 + 100);
    });
  }

  initRoleCycler() {
    const el = document.getElementById('hero-role-text');
    if (!el) return;

    const roles = [
      'SOFTWARE ENGINEER',
      'CREATIVE TECHNOLOGIST',
      'SRM CSE BUILDER',
      'SYSTEMS ARCHITECT'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let waitTimer = 0;

    const tick = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        el.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 30 : 65;

      if (!isDeleting && charIndex === currentRole.length) {
        speed = 2200; // Hold role
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400; // Pause before typing next
      }

      setTimeout(tick, speed);
    };

    setTimeout(tick, 1000);
  }

  initSkillsMatrix() {
    const tabsContainer = document.getElementById('domain-tabs');
    const nodesContainer = document.getElementById('skills-nodes');
    const inspector = document.getElementById('matrix-inspector');

    if (!tabsContainer || !nodesContainer || !inspector) return;

    // Render Domain Tabs
    tabsContainer.innerHTML = skillDomains.map((domain, i) => `
      <button class="domain-tab ${domain.id === this.currentDomainId ? 'is-active' : ''}" data-domain="${domain.id}" data-cursor="pointer">
        <span class="domain-idx">[0${i + 1}]</span>
        <span>${domain.title.toUpperCase()}</span>
      </button>
    `).join('');

    // Tab Click Event Delegation
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

    // Initial render for default domain
    this.renderSkillsForDomain(this.currentDomainId);
  }

  renderSkillsForDomain(domainId) {
    const domain = skillDomains.find(d => d.id === domainId);
    const nodesContainer = document.getElementById('skills-nodes');
    if (!domain || !nodesContainer) return;

    nodesContainer.innerHTML = domain.skills.map((s, idx) => `
      <div class="skill-node ${idx === 0 ? 'is-selected' : ''}" data-skill="${s.name}" data-cursor="pointer">
        <div class="node-top">
          <span class="node-name">${s.name}</span>
          <span class="node-level">${s.level}</span>
        </div>
        <p class="node-desc">${s.desc}</p>
      </div>
    `).join('');

    // Attach click to skill nodes
    nodesContainer.querySelectorAll('.skill-node').forEach(node => {
      node.addEventListener('click', () => {
        nodesContainer.querySelectorAll('.skill-node').forEach(n => n.classList.remove('is-selected'));
        node.classList.add('is-selected');
        const skillName = node.getAttribute('data-skill');
        const skillObj = domain.skills.find(s => s.name === skillName);
        if (skillObj) {
          this.updateInspector(domain, skillObj);
        }
      });
    });

    // Update inspector with first skill
    if (domain.skills.length > 0) {
      this.updateInspector(domain, domain.skills[0]);
    }
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
      setTimeout(() => {
        toast.classList.remove('is-active');
      }, 2600);
    };

    // Copy Email
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(personalData.contacts.email).then(() => {
          showToast(`COPIED EMAIL // ${personalData.contacts.email}`);
        });
      });
    }

    // Copy Phone
    const copyPhoneBtn = document.getElementById('copy-phone-btn');
    if (copyPhoneBtn) {
      copyPhoneBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(personalData.contacts.phoneRaw).then(() => {
          showToast(`COPIED PHONE // ${personalData.contacts.phone}`);
        });
      });
    }

    // Form Submission
    const contactForm = document.getElementById('transmission-form');
    if (contactForm) {
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
        if (status) {
          status.textContent = '';
          status.className = 'form-status';
        }

        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(result.error || 'Unable to send your message right now.');

          contactForm.reset();
          if (status) {
            status.textContent = 'Message received.';
            status.className = 'form-status is-success';
          }
          showToast('MESSAGE RECEIVED');
        } catch (error) {
          if (status) {
            status.textContent = error.message;
            status.className = 'form-status is-error';
          }
        } finally {
          isSubmitting = false;
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
          submitBtn.querySelector('span').textContent = 'DISPATCH TRANSMISSION';
        }
      });
    }
  }

  initScrollObservers() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');

          // Highlight current nav link
          const sectionId = entry.target.getAttribute('id');
          if (sectionId) {
            document.querySelectorAll('.nav-link').forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
            });
          }
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('section, .reveal-wrapper').forEach(el => observer.observe(el));
  }

  initHeaderBehavior() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.header__nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });

    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
      });
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
