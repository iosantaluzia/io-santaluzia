import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const useGoogleAnalytics = (measurementId?: string) => {
  const location = useLocation();

  useEffect(() => {
    if (measurementId && window.gtag) {
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, measurementId]);

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  const trackPageView = (pageTitle?: string, pagePath?: string) => {
    if (window.gtag && measurementId) {
      window.gtag('config', measurementId, {
        page_title: pageTitle,
        page_path: pagePath || location.pathname + location.search,
      });
    }
  };

  const trackPhoneCall = (phoneNumber: string) => {
    trackEvent('phone_call', {
      event_category: 'contact',
      event_label: phoneNumber,
      value: 1
    });
  };

  const trackWhatsAppClick = () => {
    trackEvent('whatsapp_click', {
      event_category: 'contact',
      event_label: 'whatsapp_button',
      value: 1
    });
  };

  const trackFormSubmission = (formName: string) => {
    trackEvent('form_submit', {
      event_category: 'lead_generation',
      event_label: formName,
      value: 1
    });
  };

  const trackAppointmentRequest = () => {
    trackEvent('appointment_request', {
      event_category: 'conversion',
      event_label: 'appointment_form',
      value: 1
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackPhoneCall,
    trackWhatsAppClick,
    trackFormSubmission,
    trackAppointmentRequest
  };
};