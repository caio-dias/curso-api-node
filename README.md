rodar mariadb:
- sudo docker run -p 3306:3306 --name mysql-mariadb-node -e MYSQL_ROOT_PASSWORD=root -d mariadb

rodar projeto: 
- npm start

usando docker + sql server

testar banco do heroku no local:
{
    "env": {
        "MYSQL_USER": "bccf36c0253e34",
        "MYSQL_PASSWORD": "62223762",
        "MYSQL_DATABASE": "heroku_ce07db1a0a6b53a",
        "MYSQL_HOST": "us-cdbr-east-04.cleardb.com",
        "MYSQL_PORT": "3306",
        "JWT_KEY": "segredo"
    }
}