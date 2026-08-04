/* -------------------------------------------------------------------------- */
/* Minnekhada Facilities Consulting - Main JavaScript                         */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navbar Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Header Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Animated Stat Counters
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-target') || '0', 10);
          const suffix = target.getAttribute('data-suffix') || '';
          let startValue = 0;
          const duration = 1500;
          const stepTime = Math.abs(Math.floor(duration / endValue));

          const timer = setInterval(() => {
            startValue += 1;
            target.textContent = startValue + suffix;
            if (startValue >= endValue) {
              target.textContent = endValue + suffix;
              clearInterval(timer);
            }
          }, Math.max(stepTime, 20));

          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach((num) => observer.observe(num));
  }

  // Interactive Quote Form Logic
  const serviceSelectCards = document.querySelectorAll('.service-select-card');
  const selectedServicesInput = document.getElementById('selectedServicesInput');

  if (serviceSelectCards.length > 0) {
    const selectedServices = new Set();

    serviceSelectCards.forEach((card) => {
      card.addEventListener('click', () => {
        const serviceName = card.getAttribute('data-service');
        if (card.classList.contains('selected')) {
          card.classList.remove('selected');
          if (serviceName) selectedServices.delete(serviceName);
        } else {
          card.classList.add('selected');
          if (serviceName) selectedServices.add(serviceName);
        }

        if (selectedServicesInput) {
          selectedServicesInput.value = Array.from(selectedServices).join(', ');
        }

        updateQuoteEstimate();
      });
    });
  }

  function updateQuoteEstimate() {
    const selectedCards = document.querySelectorAll('.service-select-card.selected');
    const estimateBadge = document.getElementById('estimatedCostDisplay');
    if (!estimateBadge) return;

    let baseEstimate = 0;
    selectedCards.forEach((card) => {
      const price = parseInt(card.getAttribute('data-base-price') || '250', 10);
      baseEstimate += price;
    });

    if (baseEstimate === 0) {
      estimateBadge.textContent = '$0.00 (Select services above)';
    } else {
      estimateBadge.textContent = `$${baseEstimate} - $${Math.round(baseEstimate * 1.4)} (Estimated Range)`;
    }
  }

  // Quote Form Multi-Step Handler
  const quoteForm = document.getElementById('interactiveQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedbackBox = document.getElementById('quoteSuccessMessage');
      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        quoteForm.reset();
        document.querySelectorAll('.service-select-card').forEach(c => c.classList.remove('selected'));
        updateQuoteEstimate();
        window.scrollTo({ top: feedbackBox.offsetTop - 100, behavior: 'smooth' });
      } else {
        alert('Thank you! Your quote request has been sent successfully. A Minnekhada consultant will reach out shortly.');
      }
    });
  }

  // General Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const alertBox = document.getElementById('contactSuccessMessage');
      if (alertBox) {
        alertBox.style.display = 'block';
        contactForm.reset();
      } else {
        alert('Message sent successfully! We will get back to you within 24 hours.');
      }
    });
  }

  // Cleaning Services Carousel Logic
  const carousel = document.getElementById('cleaningCarousel');
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const progressBar = document.getElementById('carouselProgressBar');
  const viewport = document.getElementById('carouselViewport');

  if (carousel && track && prevBtn && nextBtn && progressBar && viewport) {
    let currentIndex = 0;
    const totalCards = track.children.length;

    function getCardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, totalCards - getCardsPerView());
    }

    function updateCarousel() {
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      
      const cardsPerView = getCardsPerView();
      if (window.innerWidth > 768) {
        const cardWidth = track.children[0].getBoundingClientRect().width;
        const gap = 32; // 2rem gap
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
      } else {
        track.style.transform = 'none';
      }

      // Update buttons
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;

      // Update progress bar scale
      const progressFraction = maxIndex > 0 ? currentIndex / maxIndex : 0;
      progressBar.style.transform = `scaleX(${0.2 + 0.8 * progressFraction})`;
    }

    nextBtn.addEventListener('click', () => {
      const maxIndex = getMaxIndex();
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();

    // Mobile native scroll update progress bar
    viewport.addEventListener('scroll', () => {
      if (window.innerWidth <= 768) {
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        if (maxScroll > 0) {
          const progressFraction = viewport.scrollLeft / maxScroll;
          progressBar.style.transform = `scaleX(${0.2 + 0.8 * progressFraction})`;
        }
      }
    });
  }
});
