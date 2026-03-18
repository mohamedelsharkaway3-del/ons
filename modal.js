// Updated modal.js with Founder-only modals and 3D interactions
const modalContainer = document.getElementById('modal-container');
function createModal(title, contentHTML, onSaveCallback) {
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade-in');
  modal.innerHTML = `
    <div class="modal-content glass-card slide-up">
      <h3>${title}</h3>
      ${contentHTML}
      <div class="modal-actions">
        <button class="btn" id="modal-save">Save</button>
        <button class="btn" id="modal-close">Close</button>
      </div>
    </div>`;
  modalContainer.appendChild(modal);
  modal.querySelector('#modal-close').onclick = () => modal.remove();
  modal.querySelector('#modal-save').onclick = () => { onSaveCallback(); modal.remove(); };
}