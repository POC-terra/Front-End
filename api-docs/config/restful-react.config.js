const fs = require("fs");

const apiDocPath = "./api-docs";
const files = fs.readdirSync(apiDocPath).filter(fn => fn.endsWith(".json"));

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const generateConfig = () => {
  let final = {};
  files.forEach(fileName => {
    const backendName = fileName.replace(".json", "");
    final[backendName] = {
      output: "src/api-generated/" + backendName + "-api.tsx",
      file: apiDocPath + "/" + fileName,
    };
  });
  return final;
};

const replaceValueWhenNecessary = (currentOperation, valueToReplace) => {
  let replaceValue = valueToReplace;
  const operations = ["get", "put", "post", "patch"];
  const startingOperation = operations.find(operation => replaceValue.toLowerCase().startsWith(operation));

  if (startingOperation == null) {
    // Rajoute l'opération au début du nom de la fonction si nécessaire, e.g. searchProductUsingGET => getSearchProduct
    replaceValue = capitalize(replaceValue).replace(/^/, currentOperation);
  } else if (startingOperation !== currentOperation) {
    // Gère les getProductsUsingPUT en renommant getPutProducts
    const regexString = "^" + startingOperation;
    const regex = new RegExp(regexString, "g");
    replaceValue = replaceValue.replace(regex, startingOperation + capitalize(currentOperation));
  }

  // Supprime UsingOPERATION
  return replaceValue.replace(/Using[A-Z]+/g, "");
};

const generateValueToReplaceMap = fileJson => {
  const replaceMap = [];
  for (let [, pathValues] of Object.entries(fileJson.paths)) {
    for (let [operation, operationValues] of Object.entries(pathValues)) {
      replaceMap.push({
        toReplace: operationValues.operationId,
        replaceBy: replaceValueWhenNecessary(operation, operationValues.operationId),
      });
    }
  }
  return replaceMap;
};

const cleanJsonFiles = () => {
  files.forEach(fileName => {
    const file = fs.readFileSync(apiDocPath + "/" + fileName);
    const replaceMap = generateValueToReplaceMap(JSON.parse(file));

    let fileString = file.toString();

    // Clean function names
    replaceMap.forEach(replaceObjet => {
      const regex = new RegExp(replaceObjet.toReplace, "g");
      fileString = fileString.replace(regex, replaceObjet.replaceBy);
    });

    // Clean issues with produces
    fileString = fileString
      // Remplace ["*/*""] par ["application/json"]
      .replace(/\["\*{0,1}\/\*{0,1}"\],/g, '["application/json"],');

    // Write new JSON file
    fs.writeFileSync(apiDocPath + "/" + fileName, JSON.stringify(JSON.parse(fileString)));
  });
};

// cleanJsonFiles();
module.exports = generateConfig();
