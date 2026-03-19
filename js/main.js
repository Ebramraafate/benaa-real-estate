/**
 * الملف الرئيسي - بناء للمقاولات والديكور
 */
import { initNavbar } from './navbar.js';
import { initAnimations, initCounters } from './animations.js';

// إخفاء شاشة التحميل
document.addEventListener('DOMContentLoaded', () => {
  // إخفاء شاشة التحميل بعد تحميل الصفحة
  const loadingScreen = document.querySelector('.loading-screen');
  setTimeout(() => {
    loadingScreen?.classList.add('hidden');
  }, 600);

  // تهيئة المكونات
  initNavbar();
  initAnimations();
  initCounters();
  initContactForm();
  initPortfolioFilters();
});

/**
 * فلترة المشاريع
 */
function initPortfolioFilters() {
  const filters = document.querySelectorAll('.portfolio__filter');
  const cards = document.querySelectorAll('.project-card');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const category = filter.getAttribute('data-filter');
      
      cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * نموذج التواصل
 */
function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'جاري الإرسال...';
    submitBtn.disabled = true;

    try {
      // يمكن ربطها بـ ERPNext API لاحقاً
      console.log('Form data:', data);
      
      // محاكاة الإرسال
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // إرسال عبر واتساب
      const whatsappMsg = `مرحباً، أنا ${data.name}%0Aالبريد: ${data.email}%0Aالهاتف: ${data.phone}%0A%0A${data.message}`;
      const whatsappUrl = `https://wa.me/201155855811?text=${whatsappMsg}`;
      
      // عرض خيارات الإرسال
      showSuccessModal(whatsappUrl);
      form.reset();
    } catch (error) {
      alert('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showSuccessModal(whatsappUrl) {
  const modal = document.createElement('div');
  modal.className = 'success-modal';
  modal.innerHTML = `
    <div class="success-modal__content">
      <div class="success-modal__icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12l3 3 5-5"/>
        </svg>
      </div>
      <h3>تم إرسال رسالتك بنجاح!</h3>
      <p>سنتواصل معك في أقرب وقت ممكن</p>
      <div class="success-modal__buttons">
        <a href="${whatsappUrl}" target="_blank" class="btn btn--whatsapp btn--sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
          أرسل عبر واتساب أيضاً
        </a>
        <button class="btn btn--outline-dark btn--sm" onclick="this.closest('.success-modal').remove()">إغلاق</button>
      </div>
    </div>
  `;

  // أنماط النافذة المنبثقة
  modal.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10001;
    display: flex; align-items: center; justify-content: center; padding: 20px;
  `;
  const content = modal.querySelector('.success-modal__content');
  content.style.cssText = `
    background: white; border-radius: 16px; padding: 40px; text-align: center;
    max-width: 420px; width: 100%; animation: fadeInUp 0.3s ease;
  `;
  content.querySelector('h3').style.cssText = 'margin: 16px 0 8px; font-size: 1.25rem; color: #0a1628;';
  content.querySelector('p').style.cssText = 'color: #636e72; margin-bottom: 24px;';
  const btnsDiv = content.querySelector('.success-modal__buttons');
  btnsDiv.style.cssText = 'display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;';
  
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
