rodar mariadb:
- sudo docker run -p 3306:3306 --name mysql-mariadb-node -e MYSQL_ROOT_PASSWORD=root -d mariadb

mysql:
ALTER TABLE ecommerce.produtos ADD COLUMN imagem_produto VARCHAR(500)

CREATE TABLE `ecommerce`.`usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NULL,
  `senha` VARCHAR(100) NULL,
  PRIMARY KEY (`id_usuario`));

  ALTER TABLE ecommerce.usuarios ADD UNIQUE (email)