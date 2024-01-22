const dropzone = document.querySelector("#drop_zone");
const dropzoneMsg = document.querySelector("#drop_zone p");
const input = document.querySelector("input");

dropzone.addEventListener("dragenter", (e) => {
    e.target.classList.add("highlight");
})

dropzone.addEventListener("dragleave", (e) => {
    e.target.classList.remove("highlight");
    dropzoneMsg.textContent = "Arrasta um ficheiro ou clica para importar";
})

dropzone.addEventListener("click", (e) => {
    input.click();
    input.onchange = (e) => {
        upload(e.target.files[0]);
    }
})

dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzoneMsg.textContent = "Larga o ficheiro para importar";
})

dropzone.addEventListener("drop", async (e) => {
    e.preventDefault();

    if (e.dataTransfer.items[0].kind !== "file") {
        dropzoneMsg.textContent = "Erro: Não é um ficheiro";
        throw new Error("Not a file");
    }

    if (e.dataTransfer.items.length > 1) {
        dropzoneMsg.textContent = "Erro: Não pode enviar mais que um ficheiro";
        throw new Error("Multiple items");
    }

    const filesArray = [...e.dataTransfer.files];

    const isFile = await new Promise((resolve) => {
        const fr = new FileReader();
        fr.onprogress = (e) => {
            if (e.loaded > 50) {
                fr.abort();
                resolve(true);
            }
        }
        fr.onload = () => { resolve(true); }
        fr.onerror = () => { resolve(false); }
        fr.readAsArrayBuffer(e.dataTransfer.files[0]);
    });

    if(!isFile) {
        dropzoneMsg.textContent = "Erro: Não é um ficheiro (não pode ser uma pasta)";
        throw new Error("Couldn't read file");
    }

    upload(filesArray[0]);
});

function upload(file) {
    
    const fd = new FormData();
    fd.append("file", file);

    dropzoneMsg.textContent = "Enviando...";

    const req = new XMLHttpRequest();
    req.open('POST', 'http://httpbin.org/post');

    req.upload.addEventListener("progress", (e) => {
        const progress = e.loaded / e.total;
        dropzoneMsg.textContent = (progress*100).toFixed() + "%";
        if (progress === 1) {
            dropzoneMsg.textContent = "A processar...";
        }
    });

    req.addEventListener("load", () => {
        if (req.status === 200){
            dropzoneMsg.textContent = "Successo";
            console.log(JSON.parse(req.responseText));
        } else {
            dropzoneMsg.textContent = "Envio falhado";
            console.error("Bad response");
        }
    });

    req.addEventListener("error", () => {
        dropzoneMsg.textContent = "Envio falhado";
        console.error("Network error");
    });

    req.send(fd);

}