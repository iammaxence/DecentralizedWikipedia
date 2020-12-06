# Decentralized Wikipedia

Implement a complete Wikipedia in a decentralized way, on Ethereum. (squellette du projet by @ghivert)

- Mode d'emploi :

1. Run Ganache
2. Aller dans la racine du projet et executer dans le terminal : npm install
4. Executer dans le terminal à la racine du projet : npm run contracts:build
5. Executer dans le terminal à la racine du projet : npm run contracts:migrate
6. Executer dans le terminal : sudo npm start
7. Lancer metamask et se connecter sur un client du serveur Ganache


- Utilisation du site web:

Add article:
Permet d'ajouter un article en échange d'éther. On entre le titre de l'article, son contenue et on appuie sur le bouton "publier". Une demande de transaction d'ether s'ouvre (Avec metamask). On accepte la transaction pour publier l'article.

All Articles:
Permet de visualiser tous les articles publiés. On entre l'id de l'article, on appuie sur le bouton "Rechercher". On accède à une page avec le titre et le contenue de l'article:  On peut mettre à jour l'article à partir d'ici.

Mettre à jour un article:
Après avoir recherché un article, on accède à la page de ce dernier. On double click sur le contenue de l'article pour le modifier. On appuie sur le bouton "O" pour accepter les changements. Une demande de transaction d'ether s'ouvre (Avec metamask). On accepte la transaction pour mettre à jour l'article.
