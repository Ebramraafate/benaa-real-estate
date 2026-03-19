/**
 * خدمة البيانات - طبقة تجريد للتوافق مع ERPNext
 * ============================================
 * حالياً تقرأ من ملفات JSON محلية
 * يمكن استبدالها لاحقاً بـ ERPNext API
 */

class DataService {
  constructor() {
    this.baseUrl = '';
    this.cache = new Map();
    this.useERPNext = false; // تفعيل ERPNext API لاحقاً
    this.erpNextUrl = ''; // عنوان ERPNext API
  }

  async fetchData(endpoint) {
    if (this.cache.has(endpoint)) {
      return this.cache.get(endpoint);
    }

    try {
      let data;
      if (this.useERPNext) {
        // ERPNext API mode
        const response = await fetch(`${this.erpNextUrl}/api/resource/${endpoint}`);
        const result = await response.json();
        data = result.data;
      } else {
        // Local JSON mode
        const response = await fetch(`${this.baseUrl}/data/${endpoint}.json`);
        data = await response.json();
      }

      this.cache.set(endpoint, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  }

  async getCompanyInfo() {
    return this.fetchData('company');
  }

  async getServices() {
    const data = await this.fetchData('services');
    return data?.services || [];
  }

  async getProjects() {
    const data = await this.fetchData('projects');
    return data?.projects || [];
  }

  async getStoreItems() {
    const data = await this.fetchData('projects');
    return data?.store || { enabled: false, items: [] };
  }

  // ERPNext compatible methods
  async submitContactForm(formData) {
    if (this.useERPNext) {
      try {
        const response = await fetch(`${this.erpNextUrl}/api/method/frappe.client.insert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doc: {
              doctype: 'Lead',
              lead_name: formData.name,
              email_id: formData.email,
              mobile_no: formData.phone,
              notes: formData.message,
              source: 'Website'
            }
          })
        });
        return await response.json();
      } catch (error) {
        console.error('Error submitting form:', error);
        return null;
      }
    } else {
      console.log('Form data (will be sent to ERPNext):', formData);
      return { success: true };
    }
  }
}

// Singleton
const dataService = new DataService();
export default dataService;
