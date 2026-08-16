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
      // Clear the quote list after submission
      localStorage.removeItem('quoteItems');
      // Update the quote indicator to hide it
      const indicator = document.querySelector('.quote-indicator');
      if (indicator) indicator.classList.remove('show');
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

  /* --- Product image gallery --- */
  document.querySelectorAll('.product-gallery').forEach(gallery => {
    const mainImgs = gallery.querySelectorAll('.gallery-main img');
    const thumbs = gallery.querySelectorAll('.gallery-thumbs img');
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        mainImgs.forEach(img => img.style.display = 'none');
        if (mainImgs[i]) mainImgs[i].style.display = 'block';
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  });

  /* --- Lightbox (click to enlarge + zoom) --- */
  // Create lightbox elements if not present
  if (!document.querySelector('.lightbox')) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
      <div class="lightbox-img-wrapper">
        <img class="lightbox-img" src="" alt="Enlarged product image">
      </div>
      <button class="lightbox-next" aria-label="Next">&#8250;</button>
      <div class="lightbox-controls">
        <button class="lightbox-btn zoom-out" aria-label="Zoom out">&minus;</button>
        <span class="lightbox-zoom-level">100%</span>
        <button class="lightbox-btn zoom-in" aria-label="Zoom in">&plus;</button>
        <button class="lightbox-btn zoom-reset" aria-label="Reset zoom">&#8634;</button>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxZoomIn = document.querySelector('.lightbox-btn.zoom-in');
  const lightboxZoomOut = document.querySelector('.lightbox-btn.zoom-out');
  const lightboxZoomReset = document.querySelector('.lightbox-btn.zoom-reset');
  const lightboxZoomLevel = document.querySelector('.lightbox-zoom-level');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let lbZoom = 1;
  let lbOffsetX = 0, lbOffsetY = 0;
  let lbImages = [];
  let lbIndex = 0;
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;

  function updateLightboxTransform() {
    lightboxImg.style.transform = `translate(${lbOffsetX}px, ${lbOffsetY}px) scale(${lbZoom})`;
    lightboxZoomLevel.textContent = Math.round(lbZoom * 100) + '%';
  }

  function openLightbox(images, startIndex) {
    lbImages = images;
    lbIndex = startIndex;
    lbZoom = 1;
    lbOffsetX = 0;
    lbOffsetY = 0;
    lightboxImg.src = lbImages[lbIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateLightboxTransform();
    // Show/hide prev/next based on image count
    lightboxPrev.style.display = lbImages.length > 1 ? 'flex' : 'none';
    lightboxNext.style.display = lbImages.length > 1 ? 'flex' : 'none';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showLbImage(index) {
    lbIndex = ((index % lbImages.length) + lbImages.length) % lbImages.length;
    lbZoom = 1;
    lbOffsetX = 0;
    lbOffsetY = 0;
    lightboxImg.src = lbImages[lbIndex];
    updateLightboxTransform();
  }

  // Click on main gallery images to open lightbox
  document.querySelectorAll('.product-gallery').forEach(gallery => {
    const mainImgs = gallery.querySelectorAll('.gallery-main img');
    const imageSrcs = Array.from(mainImgs).map(img => img.src);
    mainImgs.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox(imageSrcs, i));
    });
  });

  // Lightbox controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrapper')) closeLightbox();
  });
  if (lightboxZoomIn) lightboxZoomIn.addEventListener('click', () => {
    lbZoom = Math.min(lbZoom + 0.25, 4);
    updateLightboxTransform();
  });
  if (lightboxZoomOut) lightboxZoomOut.addEventListener('click', () => {
    lbZoom = Math.max(lbZoom - 0.25, 0.5);
    if (lbZoom <= 1) { lbOffsetX = 0; lbOffsetY = 0; }
    updateLightboxTransform();
  });
  if (lightboxZoomReset) lightboxZoomReset.addEventListener('click', () => {
    lbZoom = 1; lbOffsetX = 0; lbOffsetY = 0;
    updateLightboxTransform();
  });
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showLbImage(lbIndex - 1); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showLbImage(lbIndex + 1); });

  // Scroll wheel zoom in lightbox
  if (lightboxImg) {
    lightboxImg.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) lbZoom = Math.min(lbZoom + 0.15, 4);
      else lbZoom = Math.max(lbZoom - 0.15, 0.5);
      if (lbZoom <= 1) { lbOffsetX = 0; lbOffsetY = 0; }
      updateLightboxTransform();
    });
  }

  // Drag to pan when zoomed in
  if (lightboxImg) {
    lightboxImg.addEventListener('mousedown', (e) => {
      if (lbZoom > 1) {
        isDragging = true;
        dragStartX = e.clientX - lbOffsetX;
        dragStartY = e.clientY - lbOffsetY;
        lightboxImg.classList.add('dragging');
      }
    });
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        lbOffsetX = e.clientX - dragStartX;
        lbOffsetY = e.clientY - dragStartY;
        updateLightboxTransform();
      }
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      if (lightboxImg) lightboxImg.classList.remove('dragging');
    });

    // Touch support for mobile
    let touchStartX = 0, touchStartY = 0;
    lightboxImg.addEventListener('touchstart', (e) => {
      if (lbZoom > 1 && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX - lbOffsetX;
        touchStartY = e.touches[0].clientY - lbOffsetY;
      }
    });
    lightboxImg.addEventListener('touchmove', (e) => {
      if (lbZoom > 1 && e.touches.length === 1) {
        e.preventDefault();
        lbOffsetX = e.touches[0].clientX - touchStartX;
        lbOffsetY = e.touches[0].clientY - touchStartY;
        updateLightboxTransform();
      }
    });
  }

  // Keyboard controls for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLbImage(lbIndex - 1);
    if (e.key === 'ArrowRight') showLbImage(lbIndex + 1);
    if (e.key === '+' || e.key === '=') { lbZoom = Math.min(lbZoom + 0.25, 4); updateLightboxTransform(); }
    if (e.key === '-') { lbZoom = Math.max(lbZoom - 0.25, 0.5); if (lbZoom <= 1) { lbOffsetX = 0; lbOffsetY = 0; } updateLightboxTransform(); }
  });
  const productParam = params.get('product');
  const moqParam = params.get('moq');
  const serviceParam = params.get('service');
  const bulkParam = params.get('bulk');
  
  const serviceTypeField = document.querySelector('select[name="serviceType"]');
  const messageField = document.querySelector('textarea[name="message"]');
  
  // Fix 1: Service page CTAs (?service=lifeguard, ?service=maintenance, ?service=equipment)
  if (serviceParam) {
    const serviceMap = {
      'lifeguard': { type: 'lifeguard', message: "I'd like to request a lifeguard for my event/property." },
      'maintenance': { type: 'maintenance', message: "I'd like to book pool maintenance services." },
      'equipment': { type: 'equipment', message: "I'd like to inquire about equipment supply." }
    };
    const config = serviceMap[serviceParam];
    if (config && serviceTypeField) serviceTypeField.value = config.type;
    if (config && messageField) messageField.value = config.message;
  }
  
  // Fix 1b: Bulk order (?bulk=1 or ?service=equipment&bulk=1)
  if (bulkParam === '1' || (serviceParam === 'equipment' && bulkParam === '1')) {
    if (serviceTypeField) serviceTypeField.value = 'equipment';
    if (messageField) messageField.value = "I'd like to request a bulk order for equipment.";
  }
  
  // Fix 2: Shop page Enquire button (?product=ProductName&moq=20)
  if (productParam) {
    if (serviceTypeField) serviceTypeField.value = 'equipment';
    if (messageField) {
      messageField.value = `I'd like to inquire about: ${productParam}` + (moqParam ? ` (MOQ: ${moqParam} pcs)` : '');
    }
  }
  
  // Fix 3: Quote List submission (?quote=1 with products in localStorage)
  const quoteParam = params.get('quote');
  if (quoteParam === '1') {
    const quoteItems = JSON.parse(localStorage.getItem('quoteItems') || '[]');
    if (quoteItems.length > 0) {
      if (serviceTypeField) serviceTypeField.value = 'equipment';
      if (messageField) {
        const itemList = quoteItems.map(item => 
          item.name + (item.moq ? ` (MOQ: ${item.moq} pcs)` : '')
        ).join(', ');
        messageField.value = `I'd like a quote for: ${itemList}`;
      }
    }
  }
});