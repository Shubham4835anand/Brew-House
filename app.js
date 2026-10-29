/* ==========================================================================
   NEO-BRUTALIST CAFE COFFEE - APPLICATION JAVASCRIPT
   Interactions:
   - Cart drawer open/close & full state management
   - Menu category filter pills
   - Size & Milk selection with live price calculation
   - Neo-brutalist push button micro-interactions
   - Toast notifications
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Cart State
  const cartState = [
    {
      id: 'cortado-initial',
      name: 'Atelier Cortado',
      size: 'Regular 6oz',
      milk: 'Oat Milk',
      price: 5.50,
      quantity: 1,
      img: 'assets/images/menu-cortado.jpg'
    },
    {
      id: 'croissant-initial',
      name: 'Pain au Chocolat',
      size: 'Warmed & Crisp',
      milk: 'Powdered Sugar',
      price: 5.25,
      quantity: 1,
      img: 'assets/images/menu-croissant.jpg'
    }
  ];

  // DOM Elements
  const cartBackdrop = document.getElementById('cart-modal-backdrop');
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsBox = document.getElementById('cart-items-box');
  const cartCounter = document.getElementById('cart-counter');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');
  const cartTaxVal = document.getElementById('cart-tax-val');
  const cartTotalVal = document.getElementById('cart-total-val');
  const checkoutBtn = document.getElementById('checkout-btn');
  const brutalToast = document.getElementById('brutal-toast');
  const toastText = document.getElementById('toast-text');

  // --- Show Toast ---
  function showToast(msg) {
    if (!brutalToast) return;
    toastText.textContent = msg;
    brutalToast.classList.add('show');
    setTimeout(() => {
      brutalToast.classList.remove('show');
    }, 2200);
  }

  // --- Render Cart Function ---
  function renderCart() {
    const totalCount = cartState.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalCount;

    if (cartState.length === 0) {
      cartItemsBox.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: #71717a;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">☕</div>
          <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #000; margin-bottom: 0.5rem;">YOUR BAG IS EMPTY</div>
          <p style="font-size: 0.85rem;">Pick an artisan espresso or pastry from the menu to dial in your order.</p>
        </div>
      `;
      cartSubtotalVal.textContent = '$0.00';
      cartTaxVal.textContent = '$0.00';
      cartTotalVal.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    cartItemsBox.innerHTML = '';

    cartState.forEach((item, idx) => {
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item-brutal';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-custom">${item.size} • ${item.milk}</div>
          <div class="cart-item-price">$${lineTotal.toFixed(2)}</div>
        </div>
        <div class="stepper-brutal">
          <button class="stepper-btn btn-dec" data-idx="${idx}" aria-label="Decrease quantity">−</button>
          <span style="font-weight: 800; font-size: 0.9rem; min-width: 1.2rem; text-align: center;">${item.quantity}</span>
          <button class="stepper-btn btn-inc" data-idx="${idx}" aria-label="Increase quantity">+</button>
        </div>
      `;
      cartItemsBox.appendChild(itemEl);
    });

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    cartSubtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    cartTaxVal.textContent = `$${tax.toFixed(2)}`;
    cartTotalVal.textContent = `$${total.toFixed(2)}`;
  }

  // Cart Drawer open/close
  openCartBtn.addEventListener('click', () => {
    cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  closeCartBtn.addEventListener('click', () => {
    cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  });

  cartBackdrop.addEventListener('click', (e) => {
    if (e.target === cartBackdrop) {
      cartBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Stepper quantity changes
  cartItemsBox.addEventListener('click', (e) => {
    const incBtn = e.target.closest('.btn-inc');
    const decBtn = e.target.closest('.btn-dec');

    if (incBtn) {
      const idx = parseInt(incBtn.dataset.idx, 10);
      cartState[idx].quantity += 1;
      renderCart();
    } else if (decBtn) {
      const idx = parseInt(decBtn.dataset.idx, 10);
      if (cartState[idx].quantity > 1) {
        cartState[idx].quantity -= 1;
      } else {
        cartState.splice(idx, 1);
        showToast('✕ Item removed from bag');
      }
      renderCart();
    }
  });

  // Checkout action
  checkoutBtn.addEventListener('click', () => {
    if (cartState.length === 0) {
      showToast('⚠️ Your coffee bag is empty!');
      return;
    }
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    showToast(`⚡ Order #${orderNum} confirmed! Ready at counter in 3m.`);
    cartState.length = 0;
    renderCart();
  });

  // --- Category Tabs Filter ---
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const drinkCards = document.querySelectorAll('.brutal-drink-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      drinkCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Menu Card Customizer Logic (Size, Milk, Add to Cart) ---
  drinkCards.forEach(card => {
    const sizeChips = card.querySelectorAll('.pill-options-row[data-type="size"] .option-chip');
    const milkChips = card.querySelectorAll('.pill-options-row[data-type="milk"] .option-chip');
    const priceTag = card.querySelector('.drink-price-tag');
    const basePrice = parseFloat(priceTag.dataset.base || 5.00);

    // Size selection updates price tag
    sizeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sizeChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');

        const delta = parseFloat(chip.dataset.delta || 0);
        const finalPrice = basePrice + delta;
        priceTag.textContent = `$${finalPrice.toFixed(2)}`;
      });
    });

    // Milk selection
    milkChips.forEach(chip => {
      chip.addEventListener('click', () => {
        milkChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
      });
    });

    // Add to Cart button
    const addBtn = card.querySelector('.add-to-cart-action');
    addBtn.addEventListener('click', () => {
      const name = addBtn.dataset.name;
      const img = addBtn.dataset.img;

      const selSizeChip = card.querySelector('.pill-options-row[data-type="size"] .option-chip.selected');
      const selMilkChip = card.querySelector('.pill-options-row[data-type="milk"] .option-chip.selected');

      const sizeVal = selSizeChip ? selSizeChip.dataset.value : 'Regular';
      const milkVal = selMilkChip ? selMilkChip.dataset.value : 'Classic';
      const delta = selSizeChip ? parseFloat(selSizeChip.dataset.delta || 0) : 0;
      const itemPrice = basePrice + delta;

      const existing = cartState.find(it => it.name === name && it.size === sizeVal && it.milk === milkVal);
      if (existing) {
        existing.quantity += 1;
      } else {
        cartState.push({
          id: `item-${Date.now()}`,
          name: name,
          size: sizeVal,
          milk: milkVal,
          price: itemPrice,
          quantity: 1,
          img: img
        });
      }

      renderCart();
      showToast(`⚡ Added ${name} to order!`);
    });
  });

  // --- 4K Coffee Background Slider Animation (2.6s transition) ---
  const bgSliders = document.querySelectorAll('.coffee-bg-slider');
  if (bgSliders.length > 0) {
    let activeSlideIndex = 0;
    const totalSlideCount = 3;

    setInterval(() => {
      activeSlideIndex = (activeSlideIndex + 1) % totalSlideCount;
      bgSliders.forEach(slider => {
        const slides = slider.querySelectorAll('.coffee-slide');
        slides.forEach((slide, index) => {
          if (index === activeSlideIndex) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });
      });
    }, 2600); // 2.6-second change animation as requested
  }

  // --- Navbar Scroll Mix Effect ---
  const navbarEl = document.querySelector('.neo-navbar');
  if (navbarEl) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbarEl.classList.add('scrolled');
      } else {
        navbarEl.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --- Contact Form Submission ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const msgInput = document.getElementById('contact-message');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
        showToast('⚠️ Please fill out all required fields');
        return;
      }

      showToast(`⚡ Message sent! Thank you, ${nameInput.value.trim().split(' ')[0]}.`);
      contactForm.reset();
    });
  }

  // --- Reviews Auto-Scroll Carousel (Every 2s, scroll to left, 3 visible reviews) ---
  const reviewsTrack = document.getElementById('reviews-track');
  const reviewsViewport = document.getElementById('reviews-viewport');
  const prevBtn = document.getElementById('reviews-prev-btn');
  const nextBtn = document.getElementById('reviews-next-btn');
  const dotsWrap = document.getElementById('reviews-dots');

  if (reviewsTrack) {
    const originalCards = Array.from(reviewsTrack.children);
    const totalOriginals = originalCards.length; // 5 cards
    let currentIndex = 0;
    let autoScrollTimer = null;
    let isTransitioning = false;

    // Clone first 3 cards and append to track for seamless circular scrolling
    originalCards.slice(0, 3).forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      reviewsTrack.appendChild(clone);
    });

    // Create 5 indicator dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < totalOriginals; i++) {
        const dot = document.createElement('button');
        dot.className = `review-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to review ${i + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(i, true);
          resetAutoScroll();
        });
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots(activeIdx) {
      if (!dotsWrap) return;
      const dots = dotsWrap.querySelectorAll('.review-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIdx % totalOriginals);
      });
    }

    function getCardStepWidth() {
      const firstCard = reviewsTrack.children[0];
      if (!firstCard) return 0;
      const cardRect = firstCard.getBoundingClientRect();
      const gap = 24; // 1.5rem = 24px
      return cardRect.width + gap;
    }

    function goToSlide(index, animate = true) {
      if (animate) {
        reviewsTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      } else {
        reviewsTrack.style.transition = 'none';
      }
      currentIndex = index;
      const step = getCardStepWidth();
      reviewsTrack.style.transform = `translateX(-${currentIndex * step}px)`;
      updateDots(currentIndex);
    }

    function nextSlide() {
      if (isTransitioning) return;
      currentIndex++;
      goToSlide(currentIndex, true);

      // If we reached the cloned section (index == totalOriginals), reset seamlessly
      if (currentIndex === totalOriginals) {
        isTransitioning = true;
        setTimeout(() => {
          goToSlide(0, false);
          isTransitioning = false;
        }, 620); // right after 0.6s transition ends
      }
    }

    function prevSlide() {
      if (isTransitioning) return;
      if (currentIndex === 0) {
        // Jump to clone end first without animation, then slide to totalOriginals - 1
        goToSlide(totalOriginals, false);
        setTimeout(() => {
          currentIndex = totalOriginals - 1;
          goToSlide(currentIndex, true);
        }, 20);
      } else {
        currentIndex--;
        goToSlide(currentIndex, true);
      }
    }

    function startAutoScroll() {
      stopAutoScroll();
      autoScrollTimer = setInterval(nextSlide, 2000); // 2 seconds auto-scroll as requested
    }

    function stopAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }

    function resetAutoScroll() {
      stopAutoScroll();
      startAutoScroll();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoScroll();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoScroll();
      });
    }

    // Pause on mouse hover, resume on mouse leave
    if (reviewsViewport) {
      reviewsViewport.addEventListener('mouseenter', stopAutoScroll);
      reviewsViewport.addEventListener('mouseleave', startAutoScroll);
    }

    // Recalculate on window resize
    window.addEventListener('resize', () => {
      goToSlide(currentIndex % totalOriginals, false);
    });

    // Start auto-scroll immediately
    startAutoScroll();
  }

  // ==========================================================================
  // ABOUT SECTION 3-IMAGE AUTO-SCROLL (2s interval, scroll left loop)
  // ==========================================================================
  const aboutTrack = document.getElementById('about-coffee-track');
  const aboutViewport = document.getElementById('about-img-viewport');
  const aboutDots = document.querySelectorAll('.about-carousel-dots .carousel-dot');

  if (aboutTrack && aboutViewport) {
    const originalSlides = Array.from(aboutTrack.querySelectorAll('.about-coffee-slide'));
    const totalSlides = originalSlides.length; // 3 images

    // Seamless infinite clone: append clone of first slide
    const firstClone = originalSlides[0].cloneNode(true);
    aboutTrack.appendChild(firstClone);

    let currentSlide = 0;
    let isSlideTransitioning = false;
    let autoScrollInterval = null;

    function updateAboutDots(index) {
      if (!aboutDots.length) return;
      const activeIdx = index % totalSlides;
      aboutDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIdx);
      });
    }

    function scrollNext() {
      if (isSlideTransitioning) return;
      currentSlide++;
      aboutTrack.style.transition = 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
      aboutTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      updateAboutDots(currentSlide);

      // If reached the cloned first slide, smoothly reset back to slide 0 without animation
      if (currentSlide === totalSlides) {
        isSlideTransitioning = true;
        setTimeout(() => {
          aboutTrack.style.transition = 'none';
          currentSlide = 0;
          aboutTrack.style.transform = 'translateX(0%)';
          isSlideTransitioning = false;
        }, 660);
      }
    }

    function startAboutAutoScroll() {
      stopAboutAutoScroll();
      autoScrollInterval = setInterval(scrollNext, 2000); // 2 seconds auto-scroll
    }

    function stopAboutAutoScroll() {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    }

    // Pause on mouse hover, resume on mouse leave
    aboutViewport.addEventListener('mouseenter', stopAboutAutoScroll);
    aboutViewport.addEventListener('mouseleave', startAboutAutoScroll);

    // Start auto-scrolling immediately
    startAboutAutoScroll();
  }

  // Initial cart render
  renderCart();
});
