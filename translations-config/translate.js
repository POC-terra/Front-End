/* eslint-disable no-console */
const fs = require("fs");
const chalk = require("chalk");

const languages = ["fr", "en"];
// const countries = ["FR"];

// Get locales to generate countries and languages
const locales = languages;
// generateCombo(languages, countries);
// function generateCombo(languages, countries) {
//   return languages.reduce(
//     (a, languageIsoCode) => [...a, ...countries.map(countryIsoCode => languageIsoCode + "-" + countryIsoCode)],
//     [],
//   );
// }

// Get default file
function getTemplateFileData() {
  return JSON.parse(fs.readFileSync("./translations-config/template.json"));
}

function sortAlphabetically(object) {
  const ordered = {};
  Object.keys(object)
    .sort()
    .forEach(function(key) {
      ordered[key] = object[key];
    });
  return ordered;
}

const templateFile = sortAlphabetically(getTemplateFileData());

function updateFile(locale) {
  const currentFilePath = `./public/translations/${locale}.json`;
  try {
    const json = JSON.parse(fs.readFileSync(currentFilePath));
    const propertyToDelete = Object.keys(json).filter(key => !Object.keys(templateFile).includes(key));
    const propertyToCreate = Object.keys(templateFile).filter(key => !Object.keys(json).includes(key));

    propertyToCreate.forEach(toCreate => {
      json[toCreate] = templateFile[toCreate];
    });
    propertyToDelete.forEach(toDelete => {
      delete json[toDelete];
    });

    displayUpdates(locale, propertyToCreate, propertyToDelete);

    fs.writeFileSync(currentFilePath, JSON.stringify(sortAlphabetically(json), null, 2));
  } catch (error) {
    console.log("Création du fichier " + locale + ".json");
    // In case file for the locale doesn't exist, create it from the template.
    fs.writeFileSync(currentFilePath, JSON.stringify(templateFile, null, 2));
  }
}

function displayUpdates(locale, propertyToCreate, propertyToDelete) {
  (propertyToDelete.length || propertyToCreate.length) && console.log(`Fichier ${locale}.json`);
  if (propertyToCreate.length) {
    console.log(`Ajout de(s) propriété(s) : ${chalk.green(propertyToCreate.join(", "))}`);
  }
  if (propertyToDelete.length) {
    console.log(`Suppressions de(s) propriété(s) : ${chalk.red(propertyToDelete.join(", "))}`);
  }
}
locales.forEach(locale => {
  updateFile(locale);
});
