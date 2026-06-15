// ==========================================================================
// Live Configurations
// ==========================================================================
// 1. Email Access Key (Web3Forms): Get your free key at https://web3forms.com/
// If set, inquiries and bookings will be sent directly to your registered email!
const EMAIL_ACCESS_KEY = '0ff5b58a-bb79-498c-94f8-661e3a85e31a';

document.addEventListener('DOMContentLoaded', () => {

    // Populate hidden access keys for Web3Forms
    const contactAccessKey = document.getElementById('contactAccessKey');
    const bookingAccessKey = document.getElementById('bookingAccessKey');
    if (contactAccessKey) contactAccessKey.value = EMAIL_ACCESS_KEY;
    if (bookingAccessKey) bookingAccessKey.value = EMAIL_ACCESS_KEY;

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');
    
    function toggleMobileMenu() {
        const isOpen = mobileNavOverlay.style.display === 'block';
        if (isOpen) {
            mobileNavOverlay.style.display = 'none';
            document.body.style.overflow = '';
            mobileMenuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
        } else {
            mobileNavOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden'; // prevent scrolling behind menu
            mobileMenuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        }
    }

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavOverlay.style.display = 'none';
            document.body.style.overflow = '';
            mobileMenuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
        });
    });

    /* ==========================================================================
       Interactive Card Spotlight Hover Effect
       ========================================================================== */
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* ==========================================================================
       Consultation Booking Modal Logic
       ========================================================================== */
    const ctaModal = document.getElementById('ctaModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeCtaModal = document.getElementById('closeCtaModal');
    const openCtaModal = document.getElementById('openCtaModal');
    const consultationForm = document.getElementById('consultationForm');
    const formSuccessState = document.getElementById('formSuccessState');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const formService = document.getElementById('formService');

    // Trigger modal selectors
    const bookBtns = document.querySelectorAll('.book-consultation-btn, .get-started-btn, .get-in-touch-btn');

    function openModal(titleText = "Book a Consultation", descText = "Fill out the form below, and our AI consultants will get in touch with you shortly.", selectedService = "") {
        modalTitle.textContent = titleText;
        modalDesc.textContent = descText;
        
        if (selectedService) {
            formService.value = selectedService;
        }

        ctaModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        ctaModal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form & states
        setTimeout(() => {
            consultationForm.style.display = 'flex';
            formSuccessState.style.display = 'none';
            consultationForm.reset();
            const submitBtn = consultationForm.querySelector('.form-submit-btn');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Request';
        }, 300);
    }

    bookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            let title = "Book a Consultation";
            let desc = "Book a strategy call with our AI engineering leads to map out your architecture.";
            let serviceValue = "strategy";

            // If clicked from get started/get in touch
            if (btn.classList.contains('get-in-touch-btn') || btn.classList.contains('get-started-btn')) {
                title = "Get In Touch";
                desc = "Let's collaborate! Leave a message detailing your software and business goals.";
            }

            // Adjust preselected options based on context if card is clicked
            const card = btn.closest('.service-card');
            if (card) {
                const cardTitle = card.querySelector('.service-title').textContent;
                title = `Consultation: ${cardTitle}`;
                desc = `Inquire about our specialized ${cardTitle} services.`;
                
                if (cardTitle.includes("Strategy")) serviceValue = "strategy";
                else if (cardTitle.includes("Chatbot")) serviceValue = "chatbot";
                else if (cardTitle.includes("SaaS")) serviceValue = "saas";
                else if (cardTitle.includes("CRM")) serviceValue = "crm";
                else if (cardTitle.includes("Retail")) serviceValue = "retail";
                else if (cardTitle.includes("Generative")) serviceValue = "generative";
            }

            openModal(title, desc, serviceValue);
        });
    });

    closeCtaModal.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    closeSuccessBtn.addEventListener('click', closeModal);

    // Form submission action
    consultationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = consultationForm.querySelector('.form-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing request...';

        // If Email Access Key is configured, post to Web3Forms
        if (EMAIL_ACCESS_KEY) {
            try {
                const formData = new FormData(consultationForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    consultationForm.style.display = 'none';
                    formSuccessState.style.display = 'flex';
                    return;
                } else {
                    console.error("Form submission failed");
                }
            } catch (error) {
                console.error("Email API submit error:", error);
            }
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Request';
            alert('Failed to send inquiry via Web3Forms. Falling back to local demonstration.');
        }

        // Simulate API network request locally
        setTimeout(() => {
            consultationForm.style.display = 'none';
            formSuccessState.style.display = 'flex';
        }, 1500);
    });

    /* ==========================================================================
       Inline Contact Form Submission
       ========================================================================== */
    const contactUsForm = document.getElementById('contactUsForm');
    const contactSuccessState = document.getElementById('contactSuccessState');

    if (contactUsForm) {
        contactUsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactUsForm.querySelector('.form-submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <span style="display:inline-block; animation: spin 1s infinite linear;">⌛</span>';

            // Add simple inline spin animation stylesheet if not present
            if (!document.getElementById('spin-style')) {
                const style = document.createElement('style');
                style.id = 'spin-style';
                style.innerHTML = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }

            if (EMAIL_ACCESS_KEY) {
                try {
                    const formData = new FormData(contactUsForm);
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (response.ok) {
                        contactUsForm.style.display = 'none';
                        contactSuccessState.style.display = 'flex';
                        return;
                    }
                } catch (error) {
                    console.error("Email send error:", error);
                }
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
                alert('Failed to submit message to Web3Forms. Falling back to local demonstration.');
            }

            // Simulated response
            setTimeout(() => {
                contactUsForm.style.display = 'none';
                contactSuccessState.style.display = 'flex';
            }, 1200);
        });
    }
});
