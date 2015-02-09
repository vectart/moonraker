![Moonraker Logo](https://dl.dropboxusercontent.com/u/6598543/logo-black.png)

Un framework de test web léger et facile à utiliser pour Node. Il a été conçu pour être rapide et favoriser la maintenabilité et le travail d'équipe.
Il fournit en une fois tout ce dont vous avez besoin - des fonctionnalités/scénarios BDD habituels, une bibliothèque simple d'objets page, une capacité de parallélisation des tests et des rapports sexy.

Il intègre [Yadda](https://github.com/acuminous/yadda), [Selenium-Webdriver](https://code.google.com/p/selenium/wiki/WebDriverJs), [Mocha](http://mochajs.org/) & [Chai](http://chaijs.com/).


* [Installation](#installation)
* [Exemple projet](#exemple-projet)
* [Configuration](#configuration)
* [Exécution de vos tests](#exécution-de-vos-tests)
* [Projet exemple](#projet-exemple)
* [Ecriture de vos tests](#ecriture-de-vos-tests)
* [Objets page](#objets-page)
* [Components](#components)
* [Etiquettes de fonctionnalités](#etiquettes-de-fonctionnalités)
* [Assertions](#assertions)
* [CoffeeScript](#coffeescript)
* [Intégration avec Saucelabs / Browserstack](#integration-avec-saucelabs--browserstack)
* [Exécution de vos tests en parallèle](#exécution-de-vos-tests-en-parallèle)
* [Génération des rapports](#génération-de-rapports)
* [Référence des objets page](#référence-des-objets-page)
* [Référence des sessions](#référence-des-sessions)
* [A FAIRE](#a-faire)

_note: ceci est la traduction française du [README](./README.md) original_

### Dernière version

La version actuelle de Moonraker est la 0.3.2. Les changements récents comprennent :
* Gestion de l'internationalisation. Les fonctionalités / étapes peuvent être écrites dans n'importe quelle langue que Yadda prend en charge.
* La traduction des rapports Moonraker est également prise en charge.
* Les traductions en français (mises à jour de ce README, exemple i18n et traduction des rapports) fournies par [poum](https://github.com/poum).
* Patch/fix fourni par [vectart](https://github.com/vectart)


### Installation

Moonraker peut être installé en utilisant [npm](https://www.npmjs.org/) - `$ npm install moonraker` ou en ajoutant `moonraker` dans votre `package.json`.

### Exemple projet

Vous trouverez un exemple de projet complet dans le répertoire `example/basic` qui contient tout ce dont vous avez besoin pour commencer à utiliser Moonraker - exemple de fonctionnalité, définitions d'étapes, objets pages et un fichier de configuration dans une structure projet conseillée.

Les tests de l'exemple font appel à Chrome, si bien que vous aurez besoin d'avoir installé et mis dans votre PATH la dernière version de [chromedriver](http://chromedriver.storage.googleapis.com/index.html).

`npm install` puis `npm test` depuis le répertoire de l'exemple pour lancer la fonctionnalité fournie à titre d'exemple.

### Configuration

Moonraker est configuré en utilisant un fichier `config.json` à la racine de votre projet:

```json
{
  "baseUrl": "http://www.laterooms.com",
  "featuresDir": "tests/features",
  "stepsDir": "tests/steps",
  "resultsDir": "results",
  "reporter": "moonraker",
  "threads": 1,

  "tags": "@booking",

  "testTimeout": 60000,
  "elementTimeout": 5000,

  "browser": {
    "browserName": "chrome",
    "chromeOptions": {
      "args": ["--no-sandbox"]
    }
  }
}
```

* `baseUrl`        - Votre url de base, les urls relatives de vos objets page se baseront sur elle.*
* `featuresDir`    - Le chemin d'accès à votre répertoire de fonctionnalités.*
* `stepsDir`       - Le chemin d'accès à votre répertoire de définitions d'étapes.*
* `resultsDir`     - Le chemin d'accès dans lequel vous souhaitez que vos résultats soient générés. (Valeur par défaut: /results)
* `reporter`       - Le type de générateur de rapport que vous souhaitez que Moonraker utilise (plus d'information sur ce sujet [plus bas](#génération-de-rapports)).
* `threads`        - Le nombre de processus que vous souhaitez utiliser pour l'exécution des tests. (Valeur par défaut: 1)
* `tags`           - Facultatif: liste d'étiquettes de fonctionnalités séparées par des virgules (davantage d'informations à ce sujet [plus bas](#feature-tags)).
* `testTimeout`    - Le délai maximum de test (étape de scénario) au-delà duquel il sera indiqué en échec (ms). (Valeur par défaut: 60000)
* `elementTimeout` - Le temps maximum pendant lequel selenium essaiera de trouver un élément dans une page (ms). (Valeur par défaut: 3000) 
* `browser`        - Un objet décrivant les [fonctionnalités souhaitées](https://code.google.com/p/selenium/wiki/DesiredCapabilities) pour votre navigateur.*
* `seleniumServer` - Optionel: adresse réseau de votre serveur autonome selenium.
* `language` - Optionel: indique la langue à utiliser (English par défaut, `French` pour le français).

\* - Obligatoire

L'exemple de configuration précédent suppose que vous utilisez directement Chrome; pour vous connecter à un serveur selenium distant, ajoutez simplement l'adresse
de votre serveur à votre `config.json`:

`"seleniumServer": "http://127.0.0.1:4444/wd/hub"`.

Vous pouvez utiliser ceci pour vous connecter à des fournisseurs de services du cloud tels que [Saucelabs](https://saucelabs.com/) et [Browserstack](https://www.browserstack.com/automate). Voir [plus loin](#integration-avec-saucelabs--browserstack) pour des exemples de configuration du navigateur.

Vous pouvez également choisir la langue à utiliser avec `language`, si vous avez l'intention d'utiliser des fichiers de définition de fonctionalités ou d'étapes qui ne sont pas en anglais. La liste complète des langues prises en charge est disponibile [ici](https://github.com/acuminous/yadda/tree/master/lib/localisation).

Toutes les options de configuration de Moonraker peuvent être surchargées pendant l'exécution de vos tests (voir plus loin) en utilisant des paramètres à la ligne de commandes (par ex. : `--baseUrl=http://www.example.com` ou `--browser.browserName=phantomjs`) ou en renseignant des variables d'environnement. Ces configurations ont précédence sur celles de `config.json` dans cet ordre: paramètres de la ligne de commande > variables d'environnement > config.

Vous pouvez également ajouter ce que vous voulez à la configuration et y accéder en utilisant : `var config = require('moonraker').config;`.

### Exécution de vos tests

Pour lancer Moonraker, exécutez `$ node node_modules/moonraker/bin/moonraker.js` ou, pour rendre les choses plus simples, vous pouvez ajouter ce raccourci dans votre `package.json`:

```json
{
  "scripts": {
    "test": "node node_modules/moonraker/bin/moonraker"
  }
}
```
... de telles sorte que vous puissiez simplement exécuter `$ npm test`. Notez que vous ne pouvez pas passer de paramètres en ligne de commande en utilisant le raccourci `$ npm test`.

### Projet exemple

Vous trouverez un projet exemple complet dans le répertoire `/example` avec tout ce dont vous avez besoin dans une structure projet suggérée pour commencer à utiliser Moonraker - des fonctionnalités, des définitions d'étapes, des objets page et une configuration.

Les tests d'exemple utilisent Chrome donc vous aurez besoin de télécharger la dernière version de [chromedriver](http://chromedriver.storage.googleapis.com/index.html) et de le rendre accessible dans votre path.

### Ecriture de vos tests

Les tests pour Moonraker sont écrits en utilisant [Yadda](https://github.com/acuminous/yadda), une implémentation BDD très semblable à [Cucumber](http://cukes.info/) et en utilisant le framework de test JavaScript [Mocha](http://visionmedia.github.io/mocha/).

Tout comme Cucumber, Yadda relie des étapes écrites en langage naturel à du code, mais peut être plus flexible en ne vous restreignant pas à une syntaxe rigide (Etant donné, Quand, Alors / Given, When, Then) mais en vous permettant de définir la vôtre ...

```
Feature: Searching from the homepage

  Scenario: Simple Search

    Given I visit the home page
    When I search for 'Manchester'
    Whatever language I like here
```

```javascript
exports.define = function (steps) {

  steps.given("I visit the home page", function () {
    // some code
  });

  steps.when("I search for '$query'", function (query) {
    // some code
  });

  steps.define("Whatever language I like here", function() {
    // some code
  });

};

```

Bien que Yadda puisse prendre en charge de nombreuses bibliothèques, Moonraker charge actuellement toutes les définitions d'étapes trouvées dans votre répertoire d'étapes dans une seule grosse bibliothèque si bien que, tout comme avec Cucumber, vous devez veiller attentivement à ne pas avoir de conflits dans les noms d'étapes.

### Objets page 

Moonraker utilise pleinement le pattern des objets page (Page Object) et abstrait les interactions avec les pages pour limiter la duplication de code et rendre les tests faciles à mettre à jour quand l'IHM change.

Pour créer un objet page:

```javascript
// tests/pages/home.js
var Page = require('moonraker').Page;

module.exports = new Page({

  url: { value: '/' },

  txtSearch: { get: function () { return this.element("input[id='txtSearch']"); } },
  btnSearch: { get: function () { return this.element('btn-primary', 'className'); } },

  searchFor: { value: function (query) {
    this.txtSearch.sendKeys(query);
    this.btnSearch.click();
  }}

});
```

Chaque page possède une url, certains éléments et des méthodes utilitaires dont vous pourriez avoir besoin.

Les éléments sont récupérés en utilisant des sélecteurs CSS (ou, optionnellement, en indiquant un autre type de sélecteur) et retourne un web-element selenium avec lequel on peut interagir [comme à l'acoutumée](https://code.google.com/p/selenium/wiki/WebDriverJs). Une référence complète peut être trouvée [plus loin](#référence-des-objets-page).

Vous pouvez alors utiliser vos objets page dans vos définitions d'étapes:

```javascript
// tests/steps/home-search-steps.js
var homePage = require('../pages/home'),
    searchResults = require('../pages/search-results');

exports.define = function (steps) {

  steps.given("I visit the home page", function () {
    homePage.visit();
  });

  steps.when("I search for '$query'", function (query) {
    homePage.txtSearch.sendKeys(query);
    homePage.btnSearch.click();
    // Ou utilisez homePage.searchFor(query);
  });

  steps.then("I should see '$heading' in the heading", function (heading) {
    searchResults.heading.getText().then(function (text) {
      text.should.equal(heading);
    });
  });

};

```

### Components

Les Components sont exactement comme des objets page et vous permettent de regrouper des éléments dans un composant, puis d'ajouter ce composant lui-même dans un objet page.

```javascript
// tests/pages/components/nav.js
var Component = require('moonraker').Component

module.exports = new Component({

  selLanguage: { get: function () { return this.element('.locale select'); } },
  selCurrency: { get: function () { return this.element('.currency select'); } }

});
```

```javascript
// tests/pages/home.js
var Page = require('moonraker').Page,
    nav = require('./components/nav');

module.exports = new Page({

  url: { value: '/' },
  nav: { get: function () { return this.component(nav, "section[class='header']"); } },
  ...

});
```

Les Components sont ajoutés à une page exactement de la même façon que les éléments mais en utilisant:
`this.component(component, rootNode)` où 'component' est votre objet component et 'rootNode' est un sélecteur CSS représentant votre noeud racine des composants dans la page.

Tous les éléments de votre composant ont leur portée limitée à ce rootNode si bien que dans l'exemple précédent, l'élément `selLanguage` avec son sélecteur `.locale select` ne sera trouvé que dans l''élément `section[class='header']`.

Votre composant peut ensuite être réutilisé dans vos objets pages et peuvent apparaître à différents endroits de la page.

Utiliser vos composants:

```javascript
// tests/steps/home-search-steps.js
var homePage = require('../pages/home');

exports.define = function (steps) {

  steps.given("I visit the home page", function () {
    homePage.visit();
  });

  steps.when("I select my currency", function () {
    homePage.nav.selCurrency.click();
    // etc..
  });

});

```
### Etiquettes de fonctionnalités

Moonraker prend en charge les étiquettes de fonctionnalités (tags) pour vous permettre d'organiser les choses et de n'exécuter que certaines fonctionnalités que vous aurez choisies:

```
@testing
Feature: Searching from the homepage

 Scenario: Simple Search

 Given I visit the home page
 ...
```

Dans votre config.json (ou en le surchargeant via des paramètres en ligne de commande / des variables d'environnement), vous pouvez préciser "tags": "@testing"` ponr n'exécuter que les fonctionnalités qui possèdent cette étiquette ou utiliser `'!@testing'` pour les ignorer. Vous pouvez également utiliser une liste séparée par des virgules - `@accounts,@booking` etc. Les fonctionnalités marquées comme `@Pending` seront ignorées mais incluses comme des fonctionnalités en attente dans le rapport de tests de Moonraker.


### Assertions

Le style 'should' de la bibliothèque d'assertion [Chai](http://chaijs.com/guide/styles/) est utilisable dans vos définitions d'étapes.

### CoffeeScript

Vous pouvez utiliser CoffeeScript pour vos définitions d'étapes et objets page si vous préférez:

```coffee
# /pages/home.coffee
Page = require('moonraker').Page

module.exports = new Page

  url: value: '/'

  txtSearch: get: () -> @element "input[id='txtSearch']"
  btnSearch: get: () -> @element ".btn-primary"

  searchFor: value: (query) ->
    @txtSearch.sendKeys query
    @btnSearch.click()
```

```coffee
# /steps/home-search-steps.coffee
homePage = require '../pages/home'
searchResults = require '../pages/search-results'

exports.define = (steps) ->

  steps.given "I visit the home page", () ->
    homePage.visit()

  steps.when "I search for '$query'", (query) ->
    homePage.txtSearch.sendKeys query
    homePage.btnSearch.click()

  steps.then "I should see '$heading' in the heading", (heading) ->
    searchResults.heading.getText().then (text) ->
      text.should.equal heading
```

### Intégration Saucelabs / Browserstack

Pour lancer vos tests chez des fournisseurs de services du cloud tels que [Saucelabs](https://saucelabs.com/) ou [Browserstack](https://www.browserstack.com/automate), vous avez seulement besoin de configurer Moonraker avec l'adresse `seleniumServer` appropriée et des `browser capabilities` qui incluent votre identifiant et votre clef d'accès:

Saucelabs:

```json
"seleniumServer": "http://ondemand.saucelabs.com:80/wd/hub",

  "browser": {
    "username": "USERNAME",
    "accessKey": "KEY",
    "browserName": "safari",
    "version": "8.0",
    "platform": "OS X 10.10"
  }
```

Browserstack:

```json
"seleniumServer": "http://hub.browserstack.com/wd/hub",

  "browser": {
    "browserstack.user": "USERNAME",
    "browserstack.key": "KEY",
    "browserName": "Safari",
    "browser_version": "8.0",
    "os": "OS X",
    "os_version": "Yosemite",
    "resolution": "1920x1080"
  }
```

Note: Comme vous pouvez le constater dans ces exemples, chaque fournisseur indique de manière différente les capacités de telle sorte que vous aurez besoin de vous référer à la documentation de votre fournisseur:

https://docs.saucelabs.com/reference/platforms-configurator/

http://www.browserstack.com/automate/capabilities

### Exécution de vos tests en parallèle

Moonraker a été conçu en ayant la vitesse en tête et gère la parallélisation des tests. Pour tirer avantage de ceci, vous avez simplement besoin d'augmenter le nombre de processus dans la configuration.

Moonraker va répartir vos fichiers de fonctionnalités selon le nombre de processus fixé et démarre un nouveau processus fils (et un nouveau navigateur) pour chacun. Si vous avez 4 fichiers de fonctionnalités et que vous voulez utiliser 2 processus, 2 fonctionnalités seront exécutées par processus / navigateur.

La parallélisation des tests fonctionne comme attendu avec les connexions des pilotes distants de la même façon que localement. Si vous disposez de ressources matérielles suffisamment puissantes sur lesquelles exécuter vos tests et en plus, une instance d'une grille selenium haute performance sur laquelle ouvrir des connexion, vous pouvez réduire de manière spectaculaire les temps d'exécution de vos tests.

Au mieux, vous ne serez cependant pas plus rapide que votre plus longue exécution de fonctionnalité, donc si vous avez des fonctionnalités contenant des tonnes de scénarios, vous devriez penser à les répartir dans des fichiers de fonctionnalités plus petits et plus facilement gérables.

### Génération de rapports

Comme les tests sont exécutés en utilisant Mocha, vous pouvez utiliser n'importe lequel des [reporters](http://mochajs.org/#reporters) de Mocha.
Configurez simplement le reporter nécessaire dans la configuration.
Cependant, comme Mocha est conçu pour une exécution en série, vous rencontrerez des problèmes en exécutant Moonraker en parallèle, donc Moonraker fournit
son propre reporter adapté pour Mocha.

Pour l'utiliser, configurez le reporter dans votre configuration `moonraker`. Ce reporter comporte une sortie console semblable à celle de Mocha spec et un rapport html est enregistré dans votre répertoire des résultats: 

![rapport Moonraker](https://dl.dropboxusercontent.com/u/6598543/report.png)

Le rapport html comporte les détails de toutes les erreurs et les captures d'écran du navigateur.

Si vous utilisez Moonraker dans une autre langue que l'anglais (indiquée dans la config), le rapport essaiera de trouver les traductions correspondantes dans [ce fichier](https://github.com/LateRoomsGroup/moonraker/blob/master/lib/reporter/i18n/translations.json), et se rabattra sur l'anglais pouur celles qui manquent. Vous êtes encouragé à contribuer pour ajouter les traductions dont vous pourriez avoir besoin.

### Référence des objets page

Comme le montrent les exemples, toutes les interactions avec les éléments des pages (et le pilote sous-jacent) sont abstraites dans vos objets page. Quand vous créez un objet page, vous disposez de plusieurs façons pour y attacher des éléments de façon à ce que vous puissiez interagir avec eux dans vos définitions d'étapes:

```javascript
var Page = require('moonraker').Page;

module.exports = new Page({

  url: { value: '/search' },

  aTxtInput:  { get: function () { return this.element("input[id='txtSearch']"); } },
  buttons:    { get: function () { return this.elements("button"); } },
  aSelect:    { get: function () { return this.select("select[name='rt-child']"); } },
  aComponent: { get: function () { return this.component(yourComponent, "div[class='container']"); } },

  onLoad: { value: function () {
    // du code à exécuter immédiatement après que la page a été chargée.
  } }

});
```

* Configurer une valeur d'url sert au moment d'appeler `visit()` dans votre objet page, par exemple: `examplePage.visit();`. Ces url sont relatives à baseUrl indiquée dans votre config, mais si vous indiquez une url complète telle que `http://www.example.com` baseUrl sera ignoré. De plus, `visit()` accepte un objet requête optionel : `examplePage.visit({ foo: 'bar', baz: 'qux' });` ira sur `http://yourBaseUrl/search?foo=bar&baz=qux`.

* `element(selecteur, type)` - est utilisé pour trouver un élément particulier via un type de sélecteur et retourne un web-élement selenium. Le type est facultatif et s'il n'est pas précisé, le type 'css' est utilisé (comme dans l'exemple précédent). Vous pouvez indiquer un autre type de sélecteur si c'est nécessaire - `this.element('//a/b/c', 'xpath')`. On accède ensuite aux éléments à partir de vos objets pages: `examplePage.aTxtInput.click();`. Tous les types de [sélecteurs Selenium](https://code.google.com/p/selenium/source/browse/javascript/webdriver/locators.js#212) sont pris en charge.
* `elements(sélecteur, type)` - est utilisé pour trouver tous les éléments de la page qui correspondent à ce sélecteur et renvoyer une collection des web-éléments selenium. Par exemple:
```javascript
examplePage.buttons.then(function (elems) {
  elems.forEach(function (elem) {
    // etc..
  });
});
```

* `select(selecteur, type)` - est identique à `element` mais inclut un utilitaire `selectOption(optionValue)` pour faciliter le choix d'une option selon sa valeur dans vos listes déroulantes. Par exemple: `examplePage.aSelect.selectOption(3);`

* `component(votreComponent, rootNode)` - Attache un composant que vous avez défini à votre page. Voir [components](#components).

Il existe quelques méthodes utilitaires additionnelles que vous pouvez utiliser :

* `title(handler)` - Pour obtenir le titre de la page. Par exemple :
```javascript
examplePage.title(function (t) {
  console.log(t);
});
```

* `waitFor(fn, timeout)` - Expose le `driver.wait` de selenium pour attendre explicitement qu'une condition particulière devienne vraie. Par exemple :
```javascript
search: { value: function (query) {
    var _this = this;
    this.waitFor(function () {
      return _this.aTxtInput.isDisplayed();
    }, 5000);
    this.aTxtInput.sendKeys(query);
} }
```

* `alert()` - Tente de basculer sur la boîte de dialogue d'alerte actuelle. Par exemple : `examplePage.alert.accept();`.
* `onLoad()` - Une fonction optionelle que vous pouvez définir et qui sera exécutée quand la page est chargée.

Les composants sont identiques et ont accès aux mêmes méthodes d'élément mais pas à ceux spécifiques aux pages : `visit()`, `title()`, `alert()` & `component()`.
Voir la documentation officielle de [selenium webdriver](https://code.google.com/p/selenium/wiki/WebDriverJs) pour plus d'information sur la manière de travailler avec les éléments.

### Référence des sessions

Moonraker utilise un objet session pour regrouper les fonctions concernant la session actuelle de test et qui peut être utilisé dans vos définitions d'étapes, etc:
```javascript
var session = require('moonraker').session;
session.resizeWindow(320, 480);
```

* `execute(fn)` - Ajoute n'importe quelle fonction au flux de contrôle du pilote web. Voir [les flux de contrôle](https://code.google.com/p/selenium/wiki/WebDriverJs#Control_Flows).
* `defer()` - Renvoie un objet webdriver.promise.defer(). Voir [objets différés](https://code.google.com/p/selenium/wiki/WebDriverJs#Deferred_Objects).
* `resizeWindow(x, y)` - Redimensionne la fenêtre du navigateur. Par défaut, elle est maximisée.
* `refresh()` - Rafraîchit la page actuelle.
* `saveScreenshot(nom_de_fichier)` - Enregistre une capture d'écran dans `/votreRepertoireResults/screenshots/nom_de_fichier`. Ceci est appelé automatiquement en cas d'échec du test.
* `deleteAllCookies()` - Supprime tous les cookies.
* `addCookie(nom, valeur, domaineFacultatif, cheminAccesFacultatif, estSecuriséFacultati)` - Ajoute un cookie.
* `getCookie(nom)` - Récupère un cookie par son nom.
* `currentUrl(handler)` - Récupère l'url actuelle sous forme d'un objet [url](http://nodejs.org/api/url.html) analysé. Par exemple :
```javascript
session.currentUrl(function (url) {
  console.log(url);
});
```
* `savePerfLog(nom_de_fichier)` - Enregistre les journaux de performance du driver dans `/votreRepertoirResults/perf_logs/nom_de_fichier`. Ceci a été testé avec Chrome pour importer des journaux dans une instance locale de [webpagetest](http://www.webpagetest.org/) pour générer des graphiques cascades de performance, etc.

### A FAIRE 

* D'autres utilitaires pour les éléments - intégration du nouveau module [until](https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/CHANGES.md#v2440).
* D'autres exemples de fonctionnalités, d'étapes et de pages.
