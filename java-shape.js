// container for the viewer, typically this is a div
var _container = document.getElementById('sdv-container');
// viewer settings 
var _viewerSettings = {
  // container to use 
  container: _container,
  // when creating the viewer, we want to get back an API v2 object 
  api: {
    version: 2
  },
  // ticket for a ShapeDiver model 
  ticket: 'ad7f8b415e8e520f99133becbc185a08c8929a7540d1405acbb398b41e3fc53315f1bd62cc929101407f71ceb5017c6ffbf54b3762416c1410c11d2d82cc0f2f9b8d44ac947ea2043e501fcd66abc1fc38fb9de036318cd301d42ac943a4e310e57060ec6f0b4c229844f89b87096ea2978c18808293-c1858d6c06b7a0b6532a92750cb740ba',
  modelViewUrl: 'eu-central-1'
};

// create the viewer, get back an API v2 object 
var api = new SDVApp.ParametricViewer(_viewerSettings);

var viewerInit = false;
var parameters;
api.scene.addEventListener(api.scene.EVENTTYPE.VISIBILITY_ON, function() {
  if (!viewerInit) {
    var globalDiv = document.getElementById("parameters");
    parameters = api.parameters.get();
    parameters.data.sort(function(a, b) {
      return a.order - b.order;
    });
    console.log(parameters.data);
    for (let i = 0; i < parameters.data.length; i++) {
      let paramInput = null;
      let paramDiv = document.createElement("div");
      let param = parameters.data[i];
      let label = document.createElement("label");
      label.setAttribute("for", param.id);
      label.innerHTML = param.name;
      if (param.type == "Int" || param.type == "Float" || param.type == "Even" || param.type == "Odd") {
        paramInput = document.createElement("input");
        paramInput.setAttribute("id", param.id);
        paramInput.setAttribute("type", "range");
        paramInput.setAttribute("min", param.min);
        paramInput.setAttribute("max", param.max);
        paramInput.setAttribute("value", param.value);
        if (param.type == "Int") paramInput.setAttribute("step", 1);
        else if (param.type == "Even" || param.type == "Odd") paramInput.setAttribute("step", 2);
        else paramInput.setAttribute("step", 1 / Math.pow(10, param.decimalplaces));
        paramInput.onchange = function() {
          api.parameters.updateAsync({
            id: param.id,
            value: this.value
          });
        };
      } else if (param.type == "Bool") {
        paramInput = document.createElement("input");
        paramInput.setAttribute("id", param.id);
        paramInput.setAttribute("type", "checkbox");
        paramInput.setAttribute("checked", param.value);
        paramInput.onchange = function() {
          console.log(this);
          api.parameters.updateAsync({
            id: param.id,
            value: this.checked
          });
        };
      } else if (param.type == "String") {
        paramInput = document.createElement("input");
        paramInput.setAttribute("id", param.id);
        paramInput.setAttribute("type", "text");
        paramInput.setAttribute("value", param.value);
        paramInput.onchange = function() {
          api.parameters.updateAsync({
            id: param.id,
            value: this.value
          });
        };
      } else if (param.type == "Color") {
        paramInput = document.createElement("input");
        paramInput.setAttribute("id", param.id);
        paramInput.setAttribute("type", "color");
        paramInput.setAttribute("value", param.value);
        paramInput.onchange = function() {
          api.parameters.updateAsync({
            id: param.id,
            value: this.value
          });
        };
      } else if (param.type == "StringList") {
        paramInput = document.createElement("select");
        paramInput.setAttribute("id", param.id);
        for (let j = 0; j < param.choices.length; j++) {
          let option = document.createElement("option");
          option.setAttribute("value", j);
          option.setAttribute("name", param.choices[j]);
          option.innerHTML = param.choices[j];
          if (param.value == j) option.setAttribute("selected", "");
          paramInput.appendChild(option);
        }
        paramInput.onchange = function() {
          api.parameters.updateAsync({
            id: param.id,
            value: this.value
          });
        };
      }
      if (param.hidden) paramDiv.setAttribute("hidden", "");
      paramDiv.appendChild(label);
      paramDiv.appendChild(paramInput);
      globalDiv.appendChild(paramDiv);
    }

    var exports = api.exports.get();
    for (let i = 0; i < exports.data.length; i++) {
      let exportAsset = exports.data[i];
      let exportDiv = document.createElement("div");
      let exportInput = document.createElement("input");
      exportInput.setAttribute("id", exportAsset.id);
      exportInput.setAttribute("type", "button");
      exportInput.setAttribute("name", exportAsset.name);
      exportInput.setAttribute("value", exportAsset.name);
      exportInput.onclick = function() {
        api.exports.requestAsync({
          id: this.id
        }).then(
          function(response) {
            let link = response.data.content[0].href;
            window.location = link;
          }
        );
      };
      exportDiv.appendChild(exportInput);
      globalDiv.appendChild(exportDiv);
    }
    viewerInit = true;
  }
});