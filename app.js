const url = 'http://127.0.0.1:3001/services/bd';


document.querySelector('#form-new-note').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let object = {}

    formData.forEach((value, key) => object[key] = value);

    const jsonData = JSON.stringify(object);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonData,
    })
    .then(result => console.log(result))
    .catch(error => console.log('Error:', error));
});

document.querySelector('#form-update').addEventListener('submit', (e) => {
    e.preventDefault();
    const id =  document.getElementById('idNuevo').value
    
    const formData = new FormData(e.target);

    let object = {}

    formData.forEach((value, key) => object[key] = value);

    const jsonData = JSON.stringify(object);
    console.log(jsonData)

    fetch(url + '/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonData
    })
    .then(result => {return res.text()})
    .then(msg => console.log(msg))
    .catch(err => console.log(err))
});

document.querySelector('#form-del-note').addEventListener('submit', (e) => {
    e.preventDefault()

    const id = document.getElementById('idNota').value
    
    fetch(url+ '/' + id, {
        method: 'DELETE',
    })
    .then(res => {
        return res.text()
    })
    .then(msg => console.log(msg))
});

document.querySelector('#getAllNotes').addEventListener('click', (e) => {
    var notes;

    fetch(url).then((res) => {
        return res.json()
    })
    .then((jsonNotes) => {
        var tableHTML = "<tr><th>Contenido</th><th>ID</th><th>¿Importante?</th></tr>"

        for (let item in jsonNotes) {
            tableHTML += "<tr>"
            let dataObj = jsonNotes[item]

            for (let value in dataObj) {
                tableHTML += "<td>" + dataObj[value] + "</td>"
            }
            tableHTML += "</tr>"
        }

        document.getElementById('allNotes').innerHTML = tableHTML

    })
    .catch(err => console.log(err.stack))
});




