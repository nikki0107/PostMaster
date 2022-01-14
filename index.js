console.log('This is index.js for PostMaster');

// Hide the parameters box initially
$('#parametersBox').hide();
// document.getElementById('parametersBox').style.display = 'none';      // Another way

// let contentType = (document.getElementById('json').checked) ? 'json' : 'params';

let json = document.getElementById('json');
let params = document.getElementById('params');

// Hide the parameters box
json.addEventListener('click', fetchJsonBox);
function fetchJsonBox() {
    $('#jsonBox').show();
    $('#parametersBox').hide();
}

// Hide the json box
params.addEventListener('click', fetchParamsBox);
function fetchParamsBox() {
    $('#jsonBox').hide();
    $('#parametersBox').show();
}

// let plusBtn = document.getElementById('plusBtn');
// plusBtn.addEventListener('click',addParameters);

let index = 2;
function addParameters() {
    let parametersBox = document.getElementById('parametersBox');
    let html = `<div id="param${index}" class="row mb-3">
                    <label for="paramKey${index}" class="col-sm-2 col-form-label">Parameter ${index}</label>
                    <div class="col-sm-4">
                        <input type="text" id="paramKey${index}" class="form-control" placeholder="Enter Parameter ${index} Key">
                    </div>
                    <div class="col-sm-4">
                        <input type="text" id="paramValue${index}" class="form-control" placeholder="Enter Parameter ${index} Value">
                    </div>
                    <button class="btn btn-primary col-auto" onclick="removeParameters(${index});">-</button>
                </div>
                `;
    let div = document.createElement('div');
    div.innerHTML = html;
    parametersBox.appendChild(div.firstElementChild);
    index++;
}

function removeParameters(index) {
    let paramId = document.getElementById(`param${index}`);
    let ok = confirm('Do you want to delete this paramter');
    if (ok) {
        paramId.remove();
    }
}

let submit = document.getElementById('submit');
submit.addEventListener('click', fetchFunc);

function fetchFunc(e) {
    e.preventDefault();

    // let responseBox = document.getElementById('responseBox');
    let responsePrismBox = document.getElementById('responsePrismBox');

    // Tell the user to wait until fetching response
    // responseBox.value = 'Please wait.. Fetching response..';
    responsePrismBox.innerHTML = 'Please wait.. Fetching response..';
    Prism.highlightAll();

    // Get the url value 
    let url = document.getElementById('url').value;

    // Get the request type
    let requestType = (document.getElementById('get').checked) ? 'GET' : 'POST';
    // let requestType = document.querySelector("input[name='requestType']:checked").value;

    // Get the content type
    let contentType = (document.getElementById('json').checked) ? 'json' : 'params';
    // let contentType = document.querySelector("input[name='contentType']:checked").value;

    if (requestType == 'GET') {
        fetch(url, { method: 'get' })
            .then(response => response.text())
            .then(text => {
                // responseBox.value = text;
                responsePrismBox.innerHTML = text;
                Prism.highlightAll();
            })
            // .catch(() => console.log('Error occured!!'))        // Catch is not implementing
            .finally(() => console.log('Your request is evaluated'));
    }
    else {
        let data;
        if (contentType == 'json') {
            data = JSON.parse(document.getElementById('requestJson').value);     // Give content in json box w.r.t json string rules otherwise JSON.parse() will give an error as JSON.parse() accepts JSON string as an argument
            console.log(data);
        }
        else {
            data = {};

            // Both are correct ways to make json object
            // for (let i = 1; i < index; i++) {
            //     // console.log(document.getElementById('paramKey' + (i)).value);
            //     if (document.getElementById('paramKey' + (i)) != undefined) {
            //         let key = document.getElementById('paramKey' + (i)).value;
            //         let value = document.getElementById('paramValue' + (i)).value;
            //         // console.log(key,value);
            //         data[key] = value;
            //         // console.log(data);
            //     }
            // }
            // data = JSON.stringify(data);

            // console.log(document.getElementById('parametersBox').children);
            Array.from(document.getElementById('parametersBox').children).forEach(element => {
                if (element.children[1].firstElementChild.value != undefined) {
                    // console.log(element.children);
                    // console.log(element.children[1]);
                    // console.log(element.children[2]);
                    let paramKey = element.children[1].firstElementChild.value;
                    let paramValue = element.children[2].firstElementChild.value;
                    if (isNaN(paramValue)) {
                        paramValue = paramValue;
                    }
                    else {
                        paramValue = Number(paramValue);
                    }
                    // console.log(paramKey,paramValue);
                    data[paramKey] = paramValue;
                }
            })
            // data = JSON.stringify(data);
            console.log(data);
        }
        // console.log(typeof data);
        params = {
            method: 'post',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'       // Content-type tells what type of data to expect in given url i.e. a Content-Type header provides the client with the actual content type of the returned content
            },
            body: JSON.stringify(data)       // Changing JSON object to JSON text/string so response.text() accepts it.
        }
        fetch(url, params).then(response => response.text()).then(text => {        // response.text() generates a string whereas response.json() generates json object in the form of promise
            // console.log(data);
            // responseBox.value = text;
            responsePrismBox.innerHTML = text;
            Prism.highlightAll();
        }).finally(() => console.log('Your request is evaluated'));
    }
}