function startGrid(lista = null) {
    const grid = document.querySelector("#grid");
    grid.innerHTML = null;
    let sample = ["Andrew", "Robert", "Steve"];

    if (lista != null){
        sample = lista
    }

    const plateiaConteudo = localStorage.getItem("plateia")
    
        
        for (let i = 1; i <= 32; i++) {
            const box = document.createElement("div")
            const lugar = document.createElement("div");
            pessoa = sample[i - 1] ? sample[i - 1] : "";
            lugar.innerHTML = "<h4>" + pessoa + "</h4>";
            lugar.setAttribute("id", "l" + i);
            lugar.setAttribute("draggable", true);
            lugar.addEventListener("dragstart", dragStart);

            box.setAttribute("id", "box" + i);
            box.addEventListener("drop", drop);
            box.addEventListener("dragover", allowDrop);
            box.append(lugar);
            grid.append(box);
        }
    
    gravarPlateia();
}

const lerLista = (e) => {
        e.target.files[0].text().then((t) => {
            const outcome = t.split(/\r?\n/)
            outcome.shift();
            outcome.shift();

            const result = outcome.map((x) => x.replace("-", "").trim());

            startGrid(result);
        });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragStart(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let destinoBox;
    let temp;

    const data = ev.dataTransfer.getData("Text");
    const origemBox = document.getElementById(data).parentNode;

    if (ev.target.tagName == "H4") {
        destinoBox = ev.target.parentNode.parentNode;
        temp = ev.target.parentNode.parentNode.firstChild;
    } else {
        destinoBox = ev.target.parentNode;
        temp = ev.target.parentNode.firstChild;
    }
    if (destinoBox.id != origemBox) {
    destinoBox.innerHTML = "";
    destinoBox.appendChild(document.getElementById(data));
    origemBox.appendChild(temp);
    }
    gravarPlateia();
}

function gravarPlateia() {
    const plateiaConteudo = document.querySelector("#grid").innerHTML;
    localStorage.setItem("plateia", plateiaConteudo);
}

function exportarPreparar() {
    const gridList = document.querySelectorAll("#grid div div h4");
    const listaExport = [];
    listaExport.push("# Lista VIP");
    listaExport.push("");

    gridList.forEach((e) => {
        if (e.innerHTML === "") {
            listaExport.push("-");
        } else {
            listaExport.push("- " + e.innerHTML);
        }
    })

    let txtPlateia = "";
    
    listaExport.forEach((e) => {
        txtPlateia += e + "\n";
    })

    return txtPlateia;
}

function exportarPlateia() {
    const txtPlateia = exportarPreparar();

    const download = document.createElement("a");
    var file = new Blob([txtPlateia], { type: "text/plain" });
    download.href = URL.createObjectURL(file);
    download.download = "plateiaExport.txt";
    download.click();
}

function copiarPlateia() {
    const txtPlateia = exportarPreparar();

    navigator.clipboard.writeText(txtPlateia);
}

document.addEventListener("DOMContentLoaded", (event) => {
    startGrid();

    document.querySelector("#bt-exportar").addEventListener("click", exportarPlateia);
    document.querySelector("#bt-copy").addEventListener("click", copiarPlateia);
})