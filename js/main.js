/* ============================================
   POOL SERVICES WEBSITE — SHARED JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* --- Header scroll effect --- */
  const header = document.querySelector('.header');
  if (header) {
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /* --- Mobile hamburger --- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* --- Active nav link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* --- Service selector chips --- */
  document.querySelectorAll('.service-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.service-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const service = chip.dataset.service;
      if (service) {
        const formSelect = document.getElementById('serviceType');
        if (formSelect) formSelect.value = service;
      }
    });
  });

  /* --- Shop filter --- */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.category;
      document.querySelectorAll('.product-card').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --- Quote list (localStorage) --- */
  let quoteItems = JSON.parse(localStorage.getItem('quoteItems') || '[]');
  updateQuoteIndicator();

  function updateQuoteIndicator() {
    const indicator = document.querySelector('.quote-indicator');
    const count = document.querySelector('.quote-count');
    if (indicator) {
      if (quoteItems.length > 0) {
        indicator.classList.add('show');
        if (count) count.textContent = quoteItems.length;
      } else {
        indicator.classList.remove('show');
      }
    }
  }

  document.querySelectorAll('[data-add-quote]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.dataset.addQuote;
      const moq = btn.dataset.moq || '';
      const existing = quoteItems.find(i => i.name === name);
      if (!existing) {
        quoteItems.push({ name, moq, qty: parseInt(moq) || 1 });
        localStorage.setItem('quoteItems', JSON.stringify(quoteItems));
        btn.textContent = '✓ Added';
        btn.style.background = 'var(--color-primary-dark)';
        updateQuoteIndicator();
      } else {
        alert('This item is already in your quote list.');
      }
    });
  });

  /* --- Quote review modal --- */
  const quoteIndicator = document.querySelector('.quote-indicator');
  const modal = document.querySelector('.modal-overlay');
  if (quoteIndicator && modal) {
    quoteIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      renderQuoteModal();
      modal.classList.add('show');
    });
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });
  }
  const modalClose = document.querySelector('.modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', () => modal.classList.remove('show'));
  }

  window.renderQuoteModal = function() {
    const container = document.querySelector('.quote-items');
    if (!container) return;
    quoteItems = JSON.parse(localStorage.getItem('quoteItems') || '[]');
    if (quoteItems.length === 0) {
      container.innerHTML = '<p style="color:var(--color-text-muted);font-size:0.9rem;">No items in your quote list yet.</p>';
      return;
    }
    container.innerHTML = quoteItems.map((item, i) => `
      <div class="quote-item">
        <div>
          <div class="item-name">${item.name}</div>
          <div class="item-qty">${item.moq ? 'MOQ: ' + item.moq + ' pcs' : 'Qty: ' + item.qty}</div>
        </div>
        <button class="remove-btn" data-remove="${i}">Remove</button>
      </div>
    `).join('');
    container.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        quoteItems.splice(parseInt(btn.dataset.remove), 1);
        localStorage.setItem('quoteItems', JSON.stringify(quoteItems));
        renderQuoteModal();
        updateQuoteIndicator();
      });
    });
  };

  /* --- Product enquiry pre-fill --- */
  document.querySelectorAll('[data-enquire]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.dataset.enquire;
      const moq = btn.dataset.moq || '';
      window.location.href = `contact.html?product=${encodeURIComponent(product)}&moq=${encodeURIComponent(moq)}`;
    });
  });

  /* --- Form submission (demo) --- */
  const forms = document.querySelectorAll('form[data-demo-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = form.querySelector('.form-success');
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      setTimeout(() => { if (successMsg) successMsg.classList.remove('show'); }, 6000);
    });
  });

  /* --- Mobile sticky bar hide on scroll up --- */
  const mobileBar = document.querySelector('.mobile-cta-bar');
  if (mobileBar) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 300) {
        mobileBar.classList.add('hidden');
      } else {
        mobileBar.classList.remove('hidden');
      }
      lastY = currentY;
    });
  }

  /* --- Contact page: pre-fill from URL params --- */
  const params = new URLSearchParams(window.location.search);
  const productParam = params.get('product');
  const moqParam = params.get('moq');
  if (productParam) {
    const serviceType = document.getElementById('serviceType');
    if (serviceType) serviceType.value = 'equipment';
    const messageField = document.querySelector('textarea[name="message"]');
    if (messageField) {
      messageField.value = `I'd like to inquire about: ${productParam}` + (moqParam ? ` (MOQ: ${moqParam} pcs)` : '');
    }
    const serviceTypeField = document.querySelector('select[name="serviceType"]');
    if (serviceTypeField) serviceTypeField.value = 'equipment';
  }
});