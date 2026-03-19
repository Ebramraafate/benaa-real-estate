/**
 * التحريكات عند التمرير
 */
export function initAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // مراقبة جميع العناصر المتحركة
  document.querySelectorAll('.fade-up, .fade-right, .fade-left, .scale-in').forEach(el => {
    observer.observe(el);
  });
}

/**
 * عداد الأرقام المتحرك
 */
export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const end = parseInt(target.getAttribute('data-count'));
        animateCounter(target, 0, end, 2000);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, start, end, duration) {
  const range = end - start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  let current = start;
  
  const timer = setInterval(() => {
    current += increment * Math.max(1, Math.floor(range / 60));
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = current + '+';
  }, stepTime);
}
