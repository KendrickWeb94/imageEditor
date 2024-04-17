const fileInput = document.querySelector(".file-input");
const previewImg = document.querySelector(".preview-img img");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const filterOptions = document.querySelectorAll(".filter button");
const resetfilterBtn = document.querySelectorAll(".reset-filter");
const rotateOptions = document.querySelectorAll(".rotate button");
const saveImgBtn = document.querySelectorAll(".save-img");
const chooseImgBtn = document.querySelector(".choose-img");

let Brightness = 100;
let Saturation = 100;
let Inversion = 0;
let Grayscale = 0;
let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `Brightness(${Brightness}%) Saturate(${Saturation}%)  Invert(${Inversion}%)  Grayscale(${Grayscale}%)`;
};

const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    document.querySelector(".container").classList.remove("disable");
    resetfilterBtn.forEach((btn) => {
      btn.click(); // Trigger a click on each reset button
    });
  });
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;
    if (option.id === "Brightness") {
      filterSlider.max = "200";
      filterSlider.value = Brightness;
      filterValue.innerText = `${Brightness}%`;
    } else if (option.id === "Saturation") {
      filterSlider.max = "200";
      filterSlider.value = Saturation;
      filterValue.innerText = `${Saturation}%`;
    } else if (option.id === "Inversion") {
      filterSlider.max = "100";
      filterSlider.value = Inversion;
      filterValue.innerText = `${Inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = Grayscale;
      filterValue.innerText = `${Grayscale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}`;
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "Brightness") {
    Brightness = filterSlider.value;
  } else if (selectedFilter.id === "Saturation") {
    Saturation = filterSlider.value;
  } else if (selectedFilter.id === "Inversion") {
    Inversion = filterSlider.value;
  } else {
    Grayscale = filterSlider.value;
  }
  applyFilters();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id == "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

const resetfilter = () => {
  const selectedFilter = document.querySelector(".filter .active");
  if (selectedFilter.id === "Brightness") {
    Brightness = 100;
  } else if (selectedFilter.id === "Saturation") {
    Saturation = 100;
  } else if (selectedFilter.id === "Inversion") {
    Inversion = 0;
  } else {
    Grayscale = 0;
  }

  // Reset the slider and apply filters
  filterSlider.value = selectedFilter.id === "Brightness" ? 100 : 0;
  filterValue.innerText = `${filterSlider.value}%`;
  applyFilters();
};

saveImgBtn.forEach((saveImgBtn) => {
  saveImgBtn.addEventListener("click", saveImage);
});

function saveImage() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  ctx.filter = `Brightness(${Brightness}%) Saturate(${Saturation}%)  Invert(${Inversion}%)  Grayscale(${Grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  document.body.appendChild(canvas);

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);

// Fix for resetfilterBtn
resetfilterBtn.forEach((btn) => {
  btn.addEventListener("click", resetfilter);
});

chooseImgBtn.addEventListener("click", () => fileInput.click());
