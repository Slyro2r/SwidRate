const fileInput = document.getElementById('imageInput');

// Drag & drop
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#2563eb';
});

dropZone.addEventListener('dragleave', () => {
  dropZone.style.borderColor = '#374151';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  selectedFile = e.dataTransfer.files[0];
  dropZone.textContent = selectedFile.name;
});

fileInput.addEventListener('change', () => {
  selectedFile = fileInput.files[0];
  dropZone.textContent = selectedFile.name;
});

function saveData() {
  localStorage.setItem('imagesData', JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem('imagesData');
  if (saved) {
    data = JSON.parse(saved);
    renderGallery();
  }
}

function addImage() {
  const title = document.getElementById('titleInput').value;

  if (!title || !selectedFile) {
    alert('Ajoute un titre et une image');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    data.push({ title, image: e.target.result, rating: 0 });
    saveData();
    renderGallery();

    document.getElementById('titleInput').value = '';
    selectedFile = null;
    dropZone.textContent = 'Glisse une image ici ou clique';
  };

  reader.readAsDataURL(selectedFile);
}

function deleteImage(index) {
  data.splice(index, 1);
  saveData();
  renderGallery();
}

function setRating(index, value) {
  data[index].rating = parseFloat(value);
  saveData();
  renderGallery();
}

function renderGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  data.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <div class="card-content">
        <h3>${item.title}</h3>
        <img src="${item.image}" />
        <p>Note: ${item.rating.toFixed(1)} / 5</p>
      </div>
      <div class="card-footer">
        <input type="range" min="0" max="5" step="0.1" value="${item.rating}" 
          onchange="setRating(${index}, this.value)" class="range" />
        <button class="delete-btn" onclick="deleteImage(${index})">🗑️ Supprimer</button>
      </div>
    `;

    gallery.appendChild(div);
  });
}

loadData();
