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