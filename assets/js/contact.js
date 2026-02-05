// Contact page functionality
function initContactPage() {
  const saveContactBtn = document.getElementById('saveContact');
  const copyLinkBtn = document.getElementById('copyLink');
  const copyLinkText = document.getElementById('copyLinkText');

  const contactData = {
    name: 'Nick Wagner',
    phone: '+16029996576',
    email: 'nwagner@learningjourneyai.com',
    linkedin: 'https://www.linkedin.com/in/wagnernicholas',
    github: 'https://github.com/nawagner',
    website: 'https://nickwagner.info'
  };

  // Save contact as vCard
  if (saveContactBtn) {
    saveContactBtn.addEventListener('click', () => {
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contactData.name}
TEL;TYPE=CELL:${contactData.phone}
EMAIL:${contactData.email}
URL:${contactData.website}
URL;TYPE=LinkedIn:${contactData.linkedin}
URL;TYPE=GitHub:${contactData.github}
END:VCARD`;

      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'nick-wagner.vcf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // Copy link to clipboard
  if (copyLinkBtn && copyLinkText) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyLinkText.textContent = 'Copied!';
        setTimeout(() => {
          copyLinkText.textContent = 'Copy Link';
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyLinkText.textContent = 'Copied!';
        setTimeout(() => {
          copyLinkText.textContent = 'Copy Link';
        }, 2000);
      }
    });
  }
}
