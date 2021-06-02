const cards = document.querySelectorAll('.cards_recipes .card')
for (let card of cards) {
    card.addEventListener("click", function(){
        const Id = card.getAttribute("id")
        window.location.href = `recipes/${Id}`
    })
}

const currentPageAdmin = location.pathname
const menuItemsAdmin = document.querySelectorAll("header.home.admin .links a")

for (item of menuItemsAdmin) {
    if (currentPageAdmin.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}

const currentPageHome = location.pathname
const menuItemsHome = document.querySelectorAll("header.home .links a")

for (item of menuItemsHome) {
    if (currentPageHome.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}

const ShowHideIngredients = {
    target: document.querySelector('.info.recipe h4.ingredients'),
    contents: document.querySelector('#ingredients'),
    change() {
        if(ShowHideIngredients.target.innerHTML === "Mostrar"){
            ShowHideIngredients.contents.style.display = "block"
            ShowHideIngredients.target.innerHTML = "Esconder"
        } else {
            ShowHideIngredients.contents.style.display = "none"
            ShowHideIngredients.target.innerHTML = "Mostrar"
        }
    }
}

const ShowHidePreparation = {
    target: document.querySelector('.info.recipe h4.preparation'),
    contents: document.querySelector('#preparation'),
    change() {
        if(ShowHidePreparation.target.innerHTML === "Mostrar"){
            ShowHidePreparation.contents.style.display = "block"
            ShowHidePreparation.target.innerHTML = "Esconder"
        } else {
            ShowHidePreparation.contents.style.display = "none"
            ShowHidePreparation.target.innerHTML = "Mostrar"
        }
    }
}

const ShowHideInformation = {
    target: document.querySelector('.info.recipe h4.information'),
    contents: document.querySelector('#information'),
    change() {
        if(ShowHideInformation.target.innerHTML === "Mostrar"){
            ShowHideInformation.contents.style.display = "block"
            ShowHideInformation.target.innerHTML = "Esconder"
        } else {
            ShowHideInformation.contents.style.display = "none"
            ShowHideInformation.target.innerHTML = "Mostrar"
        }
    }
}

const PhotosChefUpload = {
    input: "",
    preview: document.querySelector('#photos_preview'),
    uploadLimit: 1,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosChefUpload.input = event.target
        
        if(PhotosChefUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosChefUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosChefUpload.getContainer(image)

                PhotosChefUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosChefUpload.input.files = PhotosChefUpload.getAllFiles()
    },
    hasLimit(event){    
        const { uploadLimit, input, preview } = PhotosChefUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosChefUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosChefUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosChefUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode //<div class="photo">
        const photosArray = Array.from(PhotosChefUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosChefUpload.files.splice(index, 1)
        PhotosChefUpload.input.files = PhotosChefUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if(removedFiles){
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos_preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target
        
        if(PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event){    
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode //<div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if(removedFiles){
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery_preview img'),
    setImage(e){
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
    }
}

function addIngredient(){
    const ingredients = document.querySelector("#ingredients_create");
    const fieldContainer = document.querySelectorAll (".ingredient");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length -1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
}
document
    .querySelector(".add_ingredient")
    .addEventListener("click", addIngredient)

function addPreparetion(){
    const preparetion = document.querySelector("#preparations_mode")
    const fieldContainer = document.querySelectorAll(".preparation_mode")

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length -1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    preparetion.appendChild(newField);
}
document
    .querySelector(".add_preparations_mode")
    .addEventListener("click", addPreparetion)