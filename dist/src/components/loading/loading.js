const templateFile = await fetch("./src/components/loading/template.html.inc");
const template = await templateFile.text();

const scene = document.querySelector("#mainScene");

let Loading = {};

Loading.renderLoadingScreen = async function () {
    // Create the zone for the loading screen

    const tempDiv = document.createElement("div");
    console.log(tempDiv);
    tempDiv.id = "loadingScreen";
    tempDiv.innerHTML = template;
    const entities = tempDiv.querySelectorAll("#loadingScreen");

    entities.forEach((entity) => {
        scene.appendChild(entity);
    });
};

Loading.removeLoadingScreen = function () {
    // remove the zone for the loading screen
    const loadingScreen = document.querySelector("#loadingScreen");
    if (loadingScreen) {
        loadingScreen.remove();
    }
};

export { Loading };