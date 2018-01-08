# # IOTProject

IOTProject est une application Android développée en HTML/CSS/Javascript sous le framework CORDOVA.
Elle a pour but de gérer la domotique chez moi. Elle communique par MQTT via un broker présent sur un RaspberryPi qui transmet les informations nécéssaires à des contrôleurs de type ESP8266. 

## Getting Started

### Prerequisites

Si ce n'est pas déjà fait, installez NodeJS :

```
https://nodejs.org/en/
```

Ensuite NPM :
```
https://www.npmjs.com/package/npm
```

Une fois terminé, on installe CORDOVA via NPM :
```
npm install cordova -g
```

Il vous faudra également un IDE qui prend en charge HTML/CSS/Javascript.
Pour ma part, j'utilise WebStorm :
```
https://www.jetbrains.com/webstorm/
```

### Installing

Clonez le projet et ouvrez le dans votre IDE.
Les sources se trouvent dans le dossier :
```
PathToProject\IOTProject2\mqqt\www
```

## Deployment

Pour générer une .apk lancez la commande suivante dans le répertoire du projet :
```
cordova build
```

## Built With

* [NodeJS](https://nodejs.org/en/) 
* [Webstorm](https://www.jetbrains.com/webstorm/) - IDE
* [Cordova](https://cordova.apache.org/) - Framework de développement Mobile Hybrid


## License

Ce projet est sous license MIT.
