'use strict';
// Google Tag устанавливается отдельно в head каждой HTML-страницы.

// Отправка заявки в Google Таблицу через опубликованный Apps Script Web App.
(() => {
  const leadForm = document.querySelector('#lead-form');
  if (!leadForm) return;

  // Метки кампании берём из адреса страницы. Пришёл без меток — пишем прочерки по умолчанию.
  const params = new URLSearchParams(window.location.search);
  const defaults = {utm_source: 'direct', utm_medium: 'none', utm_campaign: 'not_set'};
  for (const [key, fallback] of Object.entries(defaults)) {
    leadForm.elements.namedItem(key).value = params.get(key)?.trim() || fallback;
  }

  const requestId = leadForm.elements.namedItem('request_id');
  leadForm.addEventListener('submit', () => {
    // Один и тот же ID у повторной отправки: таблица отклонит дубль.
    if (!requestId.value) requestId.value = 'REQ-' + crypto.randomUUID().toUpperCase();
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {lead_source: 'contact_form'});
    }
    document.querySelector('#form-status').textContent =
      'Заявка отправлена. Проверьте строку в таблице по request_id: ' + requestId.value;
    // preventDefault() не вызываем: браузер отправляет POST в скрытый iframe.
    // Событие GA4 показывает попытку отправки, а не ответ приёмника.
  });
})();

const programCta = document.querySelector('#program-cta');
if (programCta) {
  programCta.addEventListener('click', () => {
    document.querySelector('#program-preview').hidden = false;
    if (typeof gtag === 'function') {
      gtag('event', 'cta_click', {
        button_name: 'program',
        page_section: 'hero'
      });
    }
  });
}
