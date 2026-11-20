// js/voice-engine.js
class ArabicVoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.arabicVoice = null;
    this.isEnabled = true;
    this.hoverTimer = null;

    // تحميل أفضل صوت عربي متاح في المتصفح/النظام
    this.loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    const voices = this.synth.getVoices();
    // ترتيب الأولوية لأفضل الأصوات العربية الطبيعية (Microsoft / Google Arabic)
    this.arabicVoice =
      voices.find(v => v.lang.includes('ar') && (v.name.includes('Natural') || v.name.includes('Salma') || v.name.includes('Shakir') || v.name.includes('Hoda'))) ||
      voices.find(v => v.lang.includes('ar-EG')) ||
      voices.find(v => v.lang.includes('ar'));
  }

  speak(text, interrupt = true) {
    if (!this.isEnabled || !text) return;
    if (interrupt) this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-EG';
    if (this.arabicVoice) utterance.voice = this.arabicVoice;
    utterance.rate = 0.95; // سرعة متزنة وواضحة
    utterance.pitch = 1.0;
    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel();
  }

  // تفعيل القراءة التلقائية عند الوقوف بالماوس أو التنقل بالكيبورد (للمكفوفين)
  bindAutoReadElements() {
    const readableElements = document.querySelectorAll('[data-speak], button, a, h1, h2, h3');
    readableElements.forEach(el => {
      const getTextToSpeak = () => el.getAttribute('data-speak') || el.innerText.trim();

      el.addEventListener('mouseenter', () => {
        clearTimeout(this.hoverTimer);
        this.hoverTimer = setTimeout(() => {
          this.speak(getTextToSpeak(), true);
        }, 350); // تأخير بسيط لمنع التداخل السريع
      });

      el.addEventListener('mouseleave', () => {
        clearTimeout(this.hoverTimer);
      });

      el.addEventListener('focus', () => {
        this.speak(getTextToSpeak(), true);
      });
    });
  }
}

window.voiceEngine = new ArabicVoiceEngine();